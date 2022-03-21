const { getData } = require("./utils/util");

// app.js
App({
  onLaunch() {
    wx.cloud.init();
  },
  globalData: {
    userInfo: null,
    userData: null,
    db: null,
    name: "test",
    openId: null
  }
})
