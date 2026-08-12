// submitReport/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

const STATUS = {
  pending:"pending",
  ai_reviewed:"ai_reviewed",
  confirmed:"confirmed",
  processed:"processed",
  rejected:"rejected"
}

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const { desc, imageFileID, location } = event

  let aiResultData = null
  try {
    // 按照文档：参数名叫 fileID
    const aiRes = await cloud.callFunction({
      name:"aiAudit",
      data:{
        fileID:imageFileID
      }
    })
    // 取出里面 data 对象存入数据库 aiResult
    aiResultData = aiRes.result.data
  } catch(err){
    return {
      success:false,
      msg:"AI审核调用失败",
      error:err.message
    }
  }

  const reportData = {
    openid: OPENID,
    desc: desc || "",
    imageFileID: imageFileID || "",
    location: location || null,
    status: STATUS.ai_reviewed,
    aiResult: aiResultData,
    createTime: db.serverDate()
  }

  const res = await db.collection("reports").add({
    data: reportData
  })

  return {
    success:true,
    data:{
      _id: res._id,
      ...reportData
    }
  }
}
