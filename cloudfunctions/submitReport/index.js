// submitReport/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

const STATUS = {
  pending: "pending",
  ai_reviewed: "ai_reviewed",
  confirmed: "confirmed",
  processed: "processed",
  rejected: "rejected"
}

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const { desc, imageFileID, location } = event
  console.log('提交举报入参', { OPENID, desc, imageFileID, location })

  // 1. 必填参数校验
  if (!imageFileID) {
    return {
      success: false,
      message: '请上传举报图片'
    }
  }
  if (!desc || desc.trim() === '') {
    return {
      success: false,
      message: '请填写举报描述'
    }
  }
  // 限制描述长度
  const safeDesc = desc.trim().slice(0, 200)

  try {
    let aiResultData = null
    let aiCallFailed = false
    try {
      // 调用AI审核云函数
      const aiRes = await cloud.callFunction({
        name: "aiAudit",
        data: { fileID: imageFileID }
      })
      aiResultData = aiRes.result.data
    } catch (aiErr) {
      console.error('AI审核接口调用异常', aiErr)
      // AI审核失败降级，改为人工待审状态，不阻断用户提交
      aiResultData = { error: aiErr.message }
      aiCallFailed = true
    }

    // 组装入库数据
    const reportData = {
      openid: OPENID,
      desc: safeDesc,
      imageFileID,
      location: location || null,
      status: aiCallFailed ? STATUS.pending : STATUS.ai_reviewed,
      aiResult: aiResultData,
      createTime: db.serverDate()
    }

    // 新增举报记录
    const addRes = await db.collection("reports").add({
      data: reportData
    })

    return {
      success: true,
      message: '举报提交成功',
      data: {
        _id: addRes._id,
        ...reportData
      }
    }
  } catch (dbErr) {
    console.error('举报入库失败', dbErr)
    return {
      success: false,
      message: '举报提交失败，请稍后重试',
      error: dbErr.message
    }
  }
}

