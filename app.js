const { formatTime, getData, userData, updateData, overDate, initData } = require("./utils/util");

// app.js
App({
  onLaunch() {
    wx.cloud.init();

    wx.login({
      success: res => {
        getData();
      }
    })
  },
  globalData: {
    userInfo: null,
    userData: null
  }
})
