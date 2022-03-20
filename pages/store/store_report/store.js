import Notify from "../../../miniprogram_npm/@vant/weapp/notify/notify"
import { sendTips } from "../../../utils/util"

// pages/store/store_report/store.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        reportMsg: "",
    },

    onMsgChange: function(event){
        this.setData({
            reportMsg: event.detail
        })
    },

    storeReport: function(event){
        if(this.data.reportMsg == ""){
            Notify({
                type: "warning",
                message: "喂喂喂 还没写该写的东西我怎么给你提交嘛",
                top: 0,
                safeAreaInsetTop: true
            })
            return;
        }
        sendTips("女朋友反馈提醒", `火车侠有新点子啦  \n奖励建议: ${this.data.reportMsg}`);
        Notify({
            type: "success",
            message: "你的想法已经寄给拉布拉马啦~",
            top: 0,
            safeAreaInsetTop: true,
            onClose(){
                wx.navigateBack({
                  delta: 1
                })
            }
        })
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