import Notify from "../../miniprogram_npm/@vant/weapp/notify/notify";
import { formatTime, sendTips, updateData } from "../../utils/util";

// pages/wake/wake.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        rateValue1: 0,
        rateValue2: 0
    },

    onRateChange: function(event){
        if(event["currentTarget"]["id"] == "rateValue1"){
            this.setData({
                rateValue1: event.detail
            })
        } else {
            this.setData({
                rateValue2: event.detail
            })
        }
    },

    recordWake: function(event){
        let current = getApp();
        let data = current.globalData.userData;
        let now = new Date();

        //判断内容是否都选择
        if(this.data.rateValue1 == 0 || this.data.rateValue2 == 0){
            Notify({
                type: "warning",
                message: "喂喂喂 怎么没有给自己定个小目标!!",
                top: 0,
                safeAreaInsetTop: true
            })
            return;
        }

        //判断今日是否已打卡
        if(data["wake"]["state"] == true){
            Notify({
                type: "warning",
                message: "笨蛋 今天已经打过卡惹!",
                top: 0,
                safeAreaInsetTop: true
            });
            return;
        }

        //判断是否在打卡时间段内
        if(now.getHours() < 5 || now.getHours() > 12){
            current.globalData.userData["score"] += 1;
            current.globalData.userData["wake"]["count"] += 1;
            current.globalData.userData["wake"]["state"] = true;
            current.globalData.userData["wake"]["list"].push({
                "date": formatTime(now),
                "rate1": this.data.rateValue1,
                "rate2": this.data.rateValue2
            });
            sendTips("女朋友打卡提醒", `火车侠打卡啦  \n事件: 起床打卡  \n当前积分: ${data["score"]}分  \n执行力评分: ${this.data.rateValue1}  \n专注力评分: ${this.data.rateValue2}分`);
            updateData(current.globalData.userData);
            Notify({
                type: "success",
                message: "成功打卡啦! 积分+1",
                top: 0,
                safeAreaInsetTop: true,
                onClose(){
                    wx.navigateBack({
                        delta: 0
                    })
                }
            })
        } else {
            Notify({
                type: "warning",
                message: "这么早就想打卡 把我当傻瓜!",
                top: 0,
                safeAreaInsetTop: true
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})