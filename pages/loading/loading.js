// loading.js

const { default: Notify } = require("../../miniprogram_npm/@vant/weapp/notify/notify");
const { userData, overDate, formatTime, updateData } = require("../../utils/util");

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
    const current = getApp();
    setTimeout(() => {
      //数据库实例化
      const database = wx.cloud.database();
      const collection = database.collection("dailypunch");
      //获取数据
      let data = null;
      collection.where({
        name: current.globalData.name
      }).get().then((res) => {
        data = res["data"][0];
        if(data != null){
          //更新日期
          let now = formatTime(new Date());
          if(String(data["date"]).split('/')[1] != now.split('/')[1] || String(data["date"]).split('/')[2].split(' ')[0] != now.split('/')[2].split(' ')[0]){
            //更新数据
            data["date"] = now;
            data["sleep"]["state"] = false;
          }
          this.setData({
            canIUseGetUserProfile: true,
            dataVersion: data["version"]
          })

          //判断数据版本更新
          if(data["version"] != userData["version"]){
            let newData = userData;
            newData["score"] = data["score"];
            newData["name"] = data["name"];
            newData["date"] = data["date"];
            newData["sleep"] = data["sleep"];
            newData["eatting"] = data["eatting"];
            data = newData;
            updateData(data);
          }
          
          current.globalData.userData = data;
          setTimeout(() => {
            wx.redirectTo({
              url: '../main/main',
            })
          }, 1000);
        } else {
          wx.cloud.database().collection("dailypunch").add({
            data: userData
          });
          Notify({
            type: "danger",
            message: "数据拉取失败，快去问问神奇的拉布拉马~",
            top: 0,
            safeAreaInsetTop: true
          })
        }
      })
    }, 1000);
  }
})
