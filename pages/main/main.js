// index.js

import Notify from "../../miniprogram_npm/@vant/weapp/notify/notify";
import { initData } from "../../utils/util";

// 获取应用实例
const app = getApp()

Page({
  data: {
    score: 0
  },

  onSleep: function(event){
    wx.navigateTo({
      url: '../sleep/sleep'
    })
  },

  onEatting: function(event){
    let type = Number(event["currentTarget"]["dataset"]["type"]);
    wx.navigateTo({
      url: `../eating/eating?type=${type}`,
    })
  },

  onInitData: function(event){
    initData();
    setTimeout(() => {
      this.setData({
        score: getApp().globalData.userData["score"]
      })
      Notify({
        type: "danger",
        message: "成功清空数据",
        top: 0,
        safeAreaInsetTope: true
      });
    }, 1000);
  },

  onShow: function(){
    let current = getApp();
    this.setData({
      score: current.globalData.userData["score"]
    })
  }
})
