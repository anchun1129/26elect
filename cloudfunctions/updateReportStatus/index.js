// updateReportStatus/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

const ALLOW_STATUS = ['pending', 'ai_reviewed', 'confirmed', 'processed', 'rejected']

exports.main = async (event, context) => {
  const { reportId, status, processImageFileID, userOpenid, templateId } = event
  console.log('更新举报状态入参：', event)

  if (!reportId || !status) {
    return { success: false, message: '缺少参数 reportId 或者 status' }
  }
  if (!ALLOW_STATUS.includes(status)) {
    return { success: false, message: `状态仅允许：${ALLOW_STATUS.join('、')}` }
  }

  try {
    const updateData = {
      status: status,
      updateTime: db.serverDate()
    }
    if (processImageFileID && processImageFileID.trim()) {
      updateData.processImageFileID = processImageFileID.trim()
    }

    const updateRes = await db.collection('reports')
      .doc(reportId)
      .update({ data: updateData })

    if(updateRes.stats.updated === 0){
      return {
        success: false,
        message: '未找到该举报记录，更新失败'
      }
    }

    // 发送订阅消息，单独捕获异常，消息失败不影响主流程
    let sendMsgResult = null
    if (userOpenid && templateId) {
      try{
        sendMsgResult = await cloud.callFunction({
          name: 'sendSubscribeMessage',
          data: {
            openid: userOpenid,
            templateId: templateId,
            reportId: reportId,
            reportStatus: status
          }
        })
        console.log('订阅消息推送成功', sendMsgResult)
      }catch(msgErr){
        console.error('订阅消息推送失败', msgErr)
        // 不阻断更新流程
      }
    }

    return {
      success: true,
      message: '举报状态更新成功',
      updated: updateRes.stats.updated,
      sendMsgResult
    }
  } catch (err) {
    console.error('更新举报状态失败', err)
    return {
      success: false,
      message: '更新失败',
      error: err.message
    }
  }
}

