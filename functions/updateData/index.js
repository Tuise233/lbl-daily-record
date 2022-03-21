// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const collection = db.collection("dailypunch");

// 云函数入口函数
exports.main = async (event, context) => {
    let success = "success";
    let reason = "";
    let data = event["data"];
    console.log(data);
    try{
        return await collection.where({
            _openid: data["_openid"]
        }).update({
            data: {
                version: data["version"],
                score: data["score"],
                date: data["date"],
                sleep: data["sleep"],
                eatting: data["eatting"],
                selfpic: data["selfpic"],
                giftlist: data["giftlist"]
            }
        });
    } catch(e){
        console.log(e);
        result = "fail";
        reason = e;
    }
    
    return {
        event: event,
        result: success,
        reason: reason
    }
}