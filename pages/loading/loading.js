// loading.js

const { default: Notify } = require("../../miniprogram_npm/@vant/weapp/notify/notify");
const { userData, overDate, formatTime, updateData, isNextDay } = require("../../utils/util");

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
    dataVersion: "正在获取...",
    lastestVersion: 0,
    log: "null"
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    this.setData({
      lastestVersion: userData["version"]
    })
    const current = getApp();
    wx.login({
      success(res){
        wx.getUserInfo({
          success(response){
            wx.cloud.callFunction({
              name: "getOpenID",
              data: {
                code: res.code,
                iv: response.iv,
                encryptedData: response.encryptedData
              }
            }).then((callRes) => {
              current.globalData["openId"] = callRes["result"]["openid"];
            })
          }
        })
      }
    })
    setTimeout(() => {
      //数据库实例化
      const database = wx.cloud.database();
      const collection = database.collection("dailypunch");
      //获取数据
      let data = null;
      collection.where({
        name: 'hcx'
      }).get().then((res) => {
        this.setData(res);
        data = res["data"][0];
        if(data != null){
          //更新日期
          let now = formatTime(new Date());

          if(new Date().getHours() < 22 && new Date().getHours() >= 3){
            data["sleep"]["state"] = false;
          }

          if(isNextDay(data["date"], now)){
            //更新数据
            data["date"] = now;
            let newArray = [];
            for(let i = 0; i < 3; i++){
              newArray.push({
                type: i,
                date: formatTime(new Date()),
                state: false,
                mainFood: "",
                secondFood: "",
                thirdFood: "",
                picName: ""
              });
            }
            data["eatting"]["list"].push(newArray);
            data["wake"]["state"] = false;
          }
          this.setData({
            canIUseGetUserProfile: true,
            dataVersion: data["version"]
          })

          //判断数据版本更新
          if(data["version"] != userData["version"]){
            /*
            let newData = userData;
            newData["score"] = data["score"];
            newData["name"] = data["name"];
            newData["date"] = data["date"];
            newData["sleep"] = data["sleep"];
            newData["eatting"] = data["eatting"];
            newData["selfpic"] = data["selfpic"];
            data = newData;
            */
            data["version"] = userData["version"];
          }
          
          current.globalData.userData = data;

          updateData(data);
          setTimeout(() => {
            wx.redirectTo({
              url: '../main/main',
            })
          }, 1000);
        } else {
          wx.cloud.database().collection("dailypunch").add({
            data: userData
          });
          getApp().globalData.userData = data;
          setTimeout(() => {
            wx.redirectTo({
              url: '../main/main',
            })
          }, 2000);
        }
      })
    }, 1000);
  }
})
