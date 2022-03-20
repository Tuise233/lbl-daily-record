import Notify from "../../miniprogram_npm/@vant/weapp/notify/notify";
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";
import { formatTime, sendTips, updateData } from "../../utils/util";

// pages/selfpic/selfpic.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        picDetail: "",
        picSrc: ""
    },

    onDetailChange: function(event){
        this.setData({
            picDetail: event.detail
        })
    },

    onPicSelected: function(event){
        var that = this;
        wx.chooseImage({
          count: 1,
          success(res){
              that.setData({
                  picSrc: res.tempFilePaths
              })
          }
        })
    },

    recordSelfpic: function(event){
        let data = getApp().globalData.userData;
        var that = this;
        if(this.data.picDetail == ""){
            Notify({
                type: "warning",
                message: "喂喂喂 此刻的心情怎么不告诉我!",
                top: 0,
                safeAreaInsetTop: true
            });
            return;
        }
        //上传图片
        if(that.data.picSrc != ""){
            Toast.loading({
                message: "上传图片中...",
                forbidClick: true,
                loadingType: 'spinner'
            })
            let now = formatTime(new Date());
            wx.cloud.uploadFile({
                cloudPath: `Image/Self/${getApp().globalData.userData["name"]}_${new Date().valueOf()}.png`,
                filePath: that.data.picSrc[0],
                success(res){
                    wx.cloud.getTempFileURL({
                        fileList: [res.fileID],
                        success(response){
                            data["score"] += 1;
                            data["selfpic"]["count"] += 1;
                            data["selfpic"]["list"].push({
                                data: now,
                                picSrc: res.fileID,
                                detail: that.data.picDetail
                            })
                            Toast.clear();
                            sendTips("女朋友打卡提醒", `火车侠打卡啦  \n事件: 自拍打卡  \n当前积分: ${data["score"]}  \n自拍心情: ${that.data.picDetail}  \n![打卡图片](${response.fileList[0]["tempFileURL"]})`);
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
                            getApp().globalData.userData = data;
                            updateData(data);
                        },
                        fail(res){
                            Notify({
                              type: "danger",
                              message: "上传照片失败 快问问神秘的拉布拉马",
                              top: 0,
                              safeAreaInsetTop: true
                            })
                        }
                    })
                },
                fail(res){
                    Notify({
                      type: "danger",
                      message: "上传照片失败 快问问神秘的拉布拉马",
                      top: 0,
                      safeAreaInsetTop: true
                    })
                }
            })
        } else {
            Notify({
                type: "warning",
                message: "你还没有上传自拍! 糊弄谁呢哼哼",
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