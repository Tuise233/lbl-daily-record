
export const userData = {
  "version": "1.4",
  "score": 0,
  "name": "hcx",
  "date": formatTime(new Date()),
  "sleep": {
    "count": 0,
    "state": false,
    "list": []
  },
  "eatting": {
      "count": 0,
      "list": []
  },
  "selfpic": {
    "count": 0,
    "list": []
  },
  "giftlist": []
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

export function overDate(date1, date2){
  let oldDate = String(date1);
  let now = String(date2);
  if(oldDate.split('/')[0] != now.split('/')[0] || oldDate.split('/')[1] != now.split('/')[1] || oldDate.split('/')[2].split(' ')[0] != now.split('/')[2].split(' ')[0]){
    return true;
  } else return false;
}

export function isNextDay(date1, date2){
  let date = String(date1);
  let now = String(date2);
  if(date.split('/')[0] != now.split('/')[0] || date.split('/')[1] != now.split('/')[1] || date.split('/')[2].split(' ')[0] != now.split('/')[2].split(' ')[0]){
    return true;
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

export function updateData(data){
  //上传数据
  wx.cloud.callFunction({
    name: 'updateData',
    data: {
      name: getApp().globalData.name,
      openId: getApp().globalData.openId,
      data: data
    },
    complete(res){
      console.log(res);
    }
  })
}

module.exports = {
  formatTime,
  overDate,
  updateData,
  sendTips,
  userData,
  isNextDay
}
