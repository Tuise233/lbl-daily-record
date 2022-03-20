// pages/store/store.js
const { formatTime, updateData, sendTips } = require("../../../utils/util");
import Notify from '../../../miniprogram_npm/@vant/weapp/notify/notify'
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        score: 0,
        overlay: false,
        giftList: [
            { name: "马上见面卡", score: 0 },
            { name: "5.21￥红包", score: 20 },
            { name: "撤销赌注", score: 35 },
            { name: "零食大礼包", score: 40 },
            { name: "心仪口红", score: 45 },
            { name: "任选小礼物", score: 55 },
            { name: "万能卡", score: 75 },
            { name: "任选大餐卡", score: 85 }
        ],

    },

    getGift: function(event){
        let index = Number(event["target"]["dataset"]["index"]);
        for(let i = 0; i < this.data.giftList.length; i++){
            if(index == i){
                if(this.data.score < this.data.giftList[i].score){
                    Notify({
                        type: "warning",
                        message: "哼哼 积分不够还想换! 拉布拉马已经知道了!",
                        top: 0,
                        safeAreaInsetTop: true
                    })
                } else {
                    Dialog.confirm({
                        title: "兑换奖励",
                        message: "你你你确定要兑换这个奖励?"
                    }).then(() => {
                        let current = getApp();
                        current.globalData.userData["giftlist"].push({
                            date: formatTime(new Date()),
                            gift: this.data.giftList[i].name
                        })
                        current.globalData.userData["score"] -= this.data.giftList[i].score;
                        this.setData({
                            score: this.data.score - this.data.giftList[i].score
                        })
                        sendTips("女朋友抽奖提醒", `火车侠抽奖啦  \n奖励: ${this.data.giftList[i].name}  \n剩余积分: ${this.data.score}`);
                        Dialog.alert({
                            message: `获得${this.data.giftList[i].name}x1~\n放到历史奖励去咯`
                        })
                        updateData(current.globalData.userData);
                    }).catch(() => {
                        
                    })
                }
                break;
            }
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            score: getApp().globalData.userData["score"]
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