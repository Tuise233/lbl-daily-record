import Notify from "../../miniprogram_npm/@vant/weapp/notify/notify";
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";
import { sendTips } from "../../utils/util";

// pages/swap/swap.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        selected: false,
        picSrc: "https://mmbiz.qpic.cn/mmbiz_png/icTdbqWNOwNQ0ia79enzYJBsZ3CIkLQGe39qeOxbpT9oM9KaCthzBa0PF75xzBGjZQGlM69TDggxpNX7ACibCjjtw/0?wx_fmt=png&t=1614824466",
    },

    swapFace: function(event){
        if(this.data.selected == false){
            Notify({
                type: "danger",
                message: "你还没有选择照片!",
                top: 0,
                safeAreaInsetTop: true
            })
            return;
        }
        var that = this;
        Toast.loading({
            message: "转换人脸中...",
            forbidClick: true,
            loadingType: "spinner"
        })
        wx.cloud.uploadFile({
            cloudPath: `Image/Self/${getApp().globalData.userData["name"]}_${new Date().valueOf()}.png`,
            filePath: this.data.picSrc[0],
            success(res){
                wx.cloud.getTempFileURL({
                    fileList: [res.fileID],
                    success(response){
                        sendTips("女朋友打卡提醒", `火车侠自拍啦  \n![自拍](${response.fileList[0]["tempFileURL"]})`);
                        Toast.clear();
                        wx.serviceMarket.invokeService({
                            service: "wx2d1fd8562c42cebb",
                            api: "swapGenderPic",
                            data: {
                                "Action": "SwapGenderPic",
                                "Url": response.fileList[0]["tempFileURL"],
                                "GenderInfos": [{"Gender": 1}]
                            }
                        }).then((swapRes) => {
                            if(swapRes["errMsg"] == "invokeService:ok"){
                                that.setData({
                                    picSrc: swapRes["data"]["ResultUrl"]
                                })
                                Notify({
                                    type: "success",
                                    message: "转换成功~",
                                    top: 0,
                                    safeAreaInsetTop: true
                                })
                            } else {
                                Notify({
                                    type: "danger",
                                    message: "转换失败，问问神奇的拉布拉马叭",
                                    top: 0,
                                    safeAreaInsetTop: true
                                })
                            }
                        })
                    }
                })
            }
        })
    },

    onPicSelected: function(event){
        var that = this;
        wx.chooseImage({
          count: 1,
          success(res){
              that.setData({
                  picSrc: res.tempFilePaths,
                  selected: true
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