const { formatTime, updateData, sendTips } = require("../../utils/util");
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify'

// pages/sleep.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        lastTime: "",
        count: 0,
        radio: "0",
        rateValue1: 0,
        rateValue2: 0,
        leaveMsg: "",

        motionList: ["开心", "一般", "不开心"]
    },

    recordSleep: function(event){
        let current = getApp();
        let data = current.globalData.userData;
        let now = new Date();

        //判断内容是否都选择
        if(this.data.rateValue1 == 0 || this.data.rateValue2 == 0){
            Notify({
                type: "warning",
                message: "喂喂喂 怎么没有对自己的状态进行打分!!",
                top: 0,
                safeAreaInsetTop: true,
                duration: 2000
            });
            return;
        }

        //判断今日是否已打卡
        if(data["sleep"]["state"] == true){
            Notify({
                type: "warning",
                message: "笨蛋 今天已经打过卡惹!",
                top: 0,
                safeAreaInsetTop: true
            });
            return;
        }

        //判断是否在打卡时间段内
        if(now.getHours() < 22 && now.getHours() >= 3){
            Notify({
                type: "warning",
                message: "这么早就想打卡 把我当傻瓜!",
                top: 0,
                safeAreaInsetTop: true
            })
        } else {
            current.globalData.userData["score"] += 1;
            current.globalData.userData["sleep"]["count"] += 1;
            current.globalData.userData["sleep"]["state"] = true;
            current.globalData.userData["sleep"]["list"].push({
                "date": formatTime(now),
                "motion": Number(this.data.radio),
                "rete1": this.data.rateValue1,
                "rate2": this.data.rateValue2,
                "text": this.data.leaveMsg
            });
            sendTips("女朋友打卡提醒", `火车侠打卡啦  \n事件: 睡眠打卡  \n当前积分: ${current.globalData.userData["score"]}分  \n今日心情: ${this.data.motionList[Number(this.data.radio)]}  \n执行力评分: ${this.data.rateValue1}分  \n专注力评分: ${this.data.rateValue2}分  \n留言: ${this.data.leaveMsg}`);
            Notify({
                type: "success",
                message: "成功打卡啦! 积分+1",
                top: 0,
                safeAreaInsetTop: true,
                onClose(){
                    wx.navigateBack({
                      delta: 0,
                    })
                }
            })
            updateData(current.globalData.userData);
        }
    },

    onRateChange: function(event){
        if(event["currentTarget"]["id"] == "rateValue1"){
            this.setData({
                rateValue1: event.detail
            });
        } else {
            this.setData({
                rateValue2: event.detail
            });
        }
    },

    onMsgChange: function(event){
        this.setData({
            leaveMsg: event.detail
        })
    },

    onChange: function(event){
        this.setData({
            radio: event.detail,
          });
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
        let current = getApp();
        this.setData({
            lastTime: current.globalData.userData["sleep"]["list"],
            count: current.globalData.userData["sleep"]["count"]
        })
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