import Notify from "../../miniprogram_npm/@vant/weapp/notify/notify";
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import { formatTime, overDate, sendTips, updateData } from "../../utils/util"

// pages/eating/eating.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        typeList: ["早餐", "午餐", "晚餐"],
        type: 0,
        mainFood: "", //主食内容
        secondFood: "", //配食内容
        thirdFood: "", //配汤内容,
        foodSrc: "" //食物图片路径
    },

    onPicSelected: function(event){
      var that = this;
      wx.chooseImage({
        count: 1,
        success(res){
          that.setData({
            foodSrc: res.tempFilePaths
          });
        }
      });
    },

    onFoodChange: function(event){
      let id = event["target"]["id"];
      switch(id){
        case "mainFood":{
          this.setData({
            mainFood: event.detail
          });
          break;
        }

        case "secondFood":{
          this.setData({
            secondFood: event.detail
          });
          break;
        }

        case "thirdFood":{
          this.setData({
            thirdFood: event.detail
          });
          break;
        }
      }
    },

    recordEatting: function(event){
      let data = getApp().globalData.userData;
      let recorded = false;
      let index = -1;
      //判断数据
      if(this.data.mainFood == "" || this.data.secondFood == "" || this.data.thirdFood == ""){
        this.setData({
          mainFood: "无",
          secondFood: "无",
          thirdFood: "无"
        });
      }

      //判断是否有当日数据
      let array = data["eatting"]["list"];
      let exist = false;
      if(array.length > 0){
        for(let i = 0; i < array.length; i++){
          let date1 = String(array[i][0]["date"]);
          let date2 = formatTime(new Date());
          if(date1.split('/')[0] == date2.split('/')[0] && date1.split('/')[1] == date2.split('/')[1] && date1.split('/')[2].split(' ')[0] == date2.split('/')[2].split(' ')[0]){
            exist = true;
            break;
          }
        }
      }

      if(exist == false){
        let newArray = [];
        //不存在当日数据，创建当日数据
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
        array.push(newArray);
      } 

      //判断该餐是否记录
      for(let i = 0; i < array.length; i++){
        if(array[i][this.data.type]["state"] == true){
          Notify({
            type: "warning",
            message: "笨蛋 这餐已经记录过啦",
            top: 0,
            safeAreaInsetTop: true
          })
          recorded = true;
          return;
        } else {
          index = i;
        }
      }

      //记录该餐
      if(recorded == false && index != -1){
        var that = this;
        if(this.data.foodSrc != ""){
          //上传图片
          Toast.loading({
            message: "上传图片中...",
            forbidClick: true,
            loadingType: 'spinner'
          });
          wx.cloud.uploadFile({
            cloudPath: `Image/Foods/${getApp().globalData.userData["name"]}_${new Date().valueOf()}.png`,
            filePath: this.data.foodSrc[0],
            success(res){
              wx.cloud.getTempFileURL({
                fileList: [res.fileID],
                success(response){
                  let current = getApp();
                  array[index][that.data.type]["date"] = formatTime(new Date());
                  array[index][that.data.type]["state"] = true;
                  array[index][that.data.type]["mainFood"] = that.data.mainFood;
                  array[index][that.data.type]["secondFood"] = that.data.secondFood;
                  array[index][that.data.type]["thirdFood"] = that.data.thirdFood;
                  array[index][that.data.type]["picName"] = res.fileID;
                  current.globalData.userData["score"] += 1;
                  current.globalData.userData["eatting"]["count"] += 1;
                  current.globalData.userData["eatting"]["list"] = array;
                  Toast.clear();
                  sendTips("女朋友打卡提醒", `火车侠打卡啦  \n事件: ${that.data.typeList[that.data.type]}打卡  \n当前积分: ${current.globalData.userData["score"]}  \n餐食类型: ${that.data.typeList[that.data.type]}  \n主食: ${that.data.mainFood}  \n配食: ${that.data.secondFood}  \n配汤: ${that.data.thirdFood}  \n![打卡图片](${response.fileList[0]["tempFileURL"]})`);
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
                  updateData(current.globalData.userData);
                },
                fail(res){
                  console.log(res);
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
              console.log(res);
              Notify({
                type: "danger",
                message: "上传照片失败 快问问神秘的拉布拉马",
                top: 0,
                safeAreaInsetTop: true
              });
            }
          })
        } else {
          let current = getApp();
          array[index][this.data.type]["date"] = formatTime(new Date());
          array[index][this.data.type]["state"] = true;
          array[index][this.data.type]["mainFood"] = this.data.mainFood;
          array[index][this.data.type]["secondFood"] = this.data.secondFood;
          array[index][this.data.type]["thirdFood"] = this.data.thirdFood;
          array[index][this.data.type]["picName"] = "";
          current.globalData.userData["score"] += 1;
          current.globalData.userData["eatting"]["count"] += 1;
          current.globalData.userData["eatting"]["list"] = array;
          sendTips("女朋友打卡提醒", `火车侠打卡啦  \n事件: ${this.data.typeList[this.data.type]}打卡  \n当前积分: ${current.globalData.userData["score"]}  \n餐食类型: ${this.data.typeList[this.data.type]}  \n主食: ${this.data.mainFood}  \n配食: ${this.data.secondFood}  \n配汤: ${this.data.thirdFood}  \n无打卡图片`);
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
          updateData(current.globalData.userData);
        }
      }

      /*
      //记录该餐
      if(recorded == false && index != -1){
        var that = this;
        //上传图片
        Toast.loading({
          message: "上传图片中...",
          forbidClick: true,
          loadingType: 'spinner'
        });
        let now = formatTime(new Date());
        if(this.data.foodSrc != ""){
          wx.cloud.uploadFile({
            cloudPath: `Image/Foods/${new Date().valueOf()}.png`,
            filePath: this.data.foodSrc[0],
            success(res){
              wx.cloud.getTempFileURL({
                fileList: [res.fileID],
                success(response){
                  let current = getApp();
                  newArray[index]["date"] = now;
                  newArray[index]["state"] = true;
                  newArray[index]["mainFood"] = that.data.mainFood;
                  newArray[index]["secondFood"] = that.data.secondFood;
                  newArray[index]["thirdFood"] = that.data.thirdFood;
                  newArray[index]["picName"] = res.fileID;
                  current.globalData.userData["score"] += 1;
                  current.globalData.userData["eatting"]["count"] += 1;
                  current.globalData.userData["eatting"]["list"].push(newArray);
                  Toast.clear();
                  sendTips("女朋友打卡提醒", `火车侠打卡啦  \n事件: ${that.data.typeList[that.data.type]}打卡  \n当前积分: ${current.globalData.userData["score"]}  \n餐食类型: ${that.data.typeList[that.data.type]}  \n主食: ${that.data.mainFood}  \n配食: ${that.data.secondFood}  \n配汤: ${that.data.thirdFood}  \n![打卡图片](${response.fileList[0]["tempFileURL"]})`);

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
                  updateData(current.globalData.userData);
                },
                fail(res){
                  console.log(res);
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
              console.log(res);
              Notify({
                type: "danger",
                message: "上传照片失败 快问问神秘的拉布拉马",
                top: 0,
                safeAreaInsetTop: true
              });
            }
          })
        } else {
          let current = getApp();
          array[index][this.data.type]["date"] = now;
          array[index][this.data.type]["state"] = true;
          array[index][this.data.type]["mainFood"] = this.data.mainFood;
          array[index][this.data.type]["secondFood"] = this.data.secondFood;
          array[index][this.data.type]["thirdFood"] = this.data.thirdFood;
          array[index][this.data.type]["picName"] = "";
          current.globalData.userData["score"] += 1;
          current.globalData.userData["eatting"]["count"] += 1;
          current.globalData.userData["eatting"]["list"] = array;
          sendTips("女朋友打卡提醒", `火车侠打卡啦  \n事件: ${this.data.typeList[this.data.type]}打卡  \n当前积分: ${current.globalData.userData["score"]}  \n餐食类型: ${this.data.typeList[this.data.type]}  \n主食: ${this.data.mainFood}  \n配食: ${this.data.secondFood}  \n配汤: ${this.data.thirdFood}  \n无打卡图片`);
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
          updateData(current.globalData.userData);
        }
      }
      */
    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            type: options["type"]
        })
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