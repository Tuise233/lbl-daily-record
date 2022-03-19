const { getData } = require("./utils/util");

// app.js
App({
  onLaunch() {
    wx.cloud.init();

    wx.login({
      success: res => {
        
      }
    })
  },
  globalData: {
    userInfo: null,
    userData: null,
    db: null,
    name: "test"
  }
})
