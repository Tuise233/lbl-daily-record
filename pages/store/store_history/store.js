import Dialog from "../../../miniprogram_npm/@vant/weapp/dialog/dialog";
import Notify from "../../../miniprogram_npm/@vant/weapp/notify/notify";
import { sendTips, updateData } from "../../../utils/util";

// pages/store/store_histroy/store_histroy.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        giftList: []
    },

    useGift: function(event){
        let index = Number(event["target"]["dataset"]["index"]);
        for(let i = 0; i < this.data.giftList.length; i++){
            if(index == i){
                Dialog.confirm({
                    title: "使用奖品",
                    message: "使用奖励前要三思!! 用了可就没有了噢~"
                }).then(() => {
                    let current = getApp();
                    let name = this.data.giftList[i]["gift"];
                    let oldData = this.data.giftList;
                    oldData.splice(i, 1);
                    this.setData({
                        giftList: oldData
                    })
                    current.globalData.userData["giftlist"].splice(i, 1);
                    sendTips("女朋友使用奖励提醒", `火车侠使用奖励啦  \n奖励: ${name}  \n请尽快兑现!!`);
                    Dialog.alert({
                        message: `好好好 使用${name}\n已经通知拉布拉马啦~`
                    })
                    updateData(current.globalData.userData);
                }).catch(() => {

                })
                break;
            }
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            giftList: getApp().globalData.userData["giftlist"]
        })
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