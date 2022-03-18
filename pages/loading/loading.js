// loading.js

const { userData, overDate, formatTime } = require("../../utils/util");

// 获取应用实例
const app = getApp()

Page({
  data: {
    motto: '正在载入...',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    dataVersion: 0,
    appVersion: 0,
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    var that = this;
    wx.showModal({
      title: '获取用户信息',
      content: '获取您的昵称、头像、地区及性别',
      success(res){
        wx.getUserProfile({
          desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: (res) => {
            const current = getApp();
            setTimeout(() => {
              //获取数据
              console.log(current.globalData.userData);
              //判断更新
              if(current.globalData.userData["version"] == null || current.globalData.userData["version"] != userData["version"]){
                console.log(1);
                updateData();
              }
              //更新日期
              if(overDate(current.globalData.userData["date"], formatTime(new Date()))){
                current.globalData.userData["date"] = formatTime(new Date());
                current.globalData.userData["sleep"]["state"] = false;
              }
            }, 1000);
            that.setData({
              canIUseGetUserProfile: true,
              dataVersion: userData["version"]
            })
      
            setTimeout(() => {
              wx.redirectTo({
                url: '../main/main',
              })
            }, 1000);
          },
          fail(res){
            console.log(res);
          }
        })
      }
    }) 
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
