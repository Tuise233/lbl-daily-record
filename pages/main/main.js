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

  onWake: function(event){
    wx.navigateTo({
      url: '../wake/wake',
    })
  },

  onEatting: function(event){
    let type = Number(event["currentTarget"]["dataset"]["type"]);
    wx.navigateTo({
      url: `../eating/eating?type=${type}`,
    })
  },

  onPicSelf: function(event){
    wx.navigateTo({
      url: '../selfpic/selfpic',
    })
  },

  onGiftStore: function(event){
    wx.navigateTo({
      url: '../store/store_main/store',
    })
  },

  onGiftUse: function(event){
    wx.navigateTo({
      url: '../store/store_history/store',
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
