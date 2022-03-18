
export const userData = {
  "version": "1.1",
  "score": 0,
  "date": formatTime(new Date()),
  "sleep": {
    "count": 0,
    "state": false,
    "list": []
  },
  "eatting":{
      "count": 0,
      "list": []
  }
}

export function formatTime(date){
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

function formatNumber(n){
  n = n.toString()
  return n[1] ? n : `0${n}`
}

export function initData(){
  const fs = wx.getFileSystemManager();
  const path = `${wx.env.USER_DATA_PATH}/data.txt`;
  fs.access({
    path: path,
    success(res){
      fs.writeFile({
        filePath: path,
        encoding: 'utf-8',
        data: JSON.stringify(userData)
      });
    },
    fail(res){
      fs.writeFile({
        filePath: path,
        data: JSON.stringify(userData),
        encoding: 'utf-8'
      });
    }
  });
  fs.close();
}

export function getData(){
  const fs = wx.getFileSystemManager();
  const path = `${wx.env.USER_DATA_PATH}/data.txt`;
  const current = getApp();
  fs.access({
    path: path,
    success(res){
      fs.readFile({
        filePath: path,
        encoding: 'utf-8',
        success(res){
          current.globalData.userData = JSON.parse(res.data);
        },
        fail(res){
          initData();
        }
      })
    },
    fail(res){
      initData();
    }
  })
  fs.close();
}

export function updateData(){
  const fs = wx.getFileSystemManager();
  const path = `${wx.env.USER_DATA_PATH}/data.txt`;
  const current = getApp();
  //读原数据
  let oldData = current.globalData.userData;
  let newData = userData;
  //新数据赋值
  newData["score"] = oldData["score"];
  newData["date"] = oldData["date"];
  newData["sleep"] = oldData["sleep"];
  newData["eatting"] = oldData["eatting"];
  //写入数据
  current.globalData.userData = newData;
  console.log(`数据更新 ${JSON.stringify(newData)}`);
  fs.access({
    path: path,
    success(res){
      fs.writeFile({
        filePath: path,
        data: JSON.stringify(newData),
        encoding: 'utf-8'
      })
    }
  })
  fs.close();
}

export function saveData() {
  let current = getApp();
  let data = current.globalData.userData;
  //判断文件是否存在
  const fs = wx.getFileSystemManager();
  const path = `${wx.env.USER_DATA_PATH}/data.txt`;
  fs.access({
    path: path,
    success(res){
      //文件存在
      fs.writeFile({
        filePath: path,
        data: JSON.stringify(data),
        encoding: 'utf-8'
      })
    }
  })
  fs.close();
}

export function overDate(date1, date2){
  let oldDate = String(date1);
  let now = String(date2);
  if(oldDate.split('/')[0] != now.split('/')[0] || oldDate.split('/')[1] != now.split('/')[1] || oldDate.split('/')[2].split(' ')[0] != now.split('/')[2].split(' ')[0]){
    return true;
  } else {
    return false;
  }
  return false;
}

export function sendTips(title, text){
  wx.request({
    url: `https://sctapi.ftqq.com/SCT66084TytqLkhaFKp1LcZAl3oXubCsi.send`,
    header: {
      'content-type': 'application/json' // 默认值
    },
    data: {
      title: title,
      desp: text,
      channel: "9"
    }
  })
}

module.exports = {
  userData,
  formatTime,
  initData,
  getData,
  updateData,
  saveData,
  sendTips,
  overDate
}
