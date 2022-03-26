import { formatTime } from "../../utils/util";

// pages/history/history.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        minDate: null,
        maxDate: null,
        sleepDate: [],
        wakeDate: []
    },

    onSelect: function(event){
        console.log(event.detail);
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let now = new Date();
        let max = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
        this.setData({
            minDate: new Date(now.getFullYear(), now.getMonth(), 1).getTime(),
            maxDate: max.getTime()
        })

        let data = getApp().globalData.userData;

        //记录睡觉时间
        let sleepArray = this.data.sleepDate;
        for(let i = 0; i < data["sleep"]["list"].length; i++){
            let newDate = String(data["sleep"]["list"][i]["date"]);
            let date = new Date(newDate.split('/')[0], Number(newDate.split('/')[1].replace('0', '')) - 1, newDate.split('/')[2].split(' ')[0].replace(' ', '')).getTime();
            sleepArray.push(date);
        }

        //记录早起时间
        let wakeArray = this.data.wakeDate;
        for(let i = 0; i < data["wake"]["list"].length; i++){
            let newDate = String(data["wake"]["list"][i]["date"]);
            let date = new Date(newDate.split('/')[0], Number(newDate.split('/')[1].replace('0', '')) - 1, newDate.split('/')[2].split(' ')[0].replace(' ', '')).getTime();
            wakeArray.push(date);
        }

        this.setData({
            sleepDate: sleepArray,
            wakeDate: wakeArray
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