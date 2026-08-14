// updateReportStatus/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

// 和其他云函数保持一致：英文状态值
const ALLOW_STATUS = ['pending', 'ai_reviewed', 'confirmed', 'processed', 'rejected']

exports.main = async (event, context) => {
  const { reportId, status, openid, templateId } = event
  console.log('更新举报状态入参：', event)

  // 1. 参数校验
  if (!reportId || !status) {
    return { success: false, message: '缺少参数 reportId 或者 status' }
  }
  if (!ALLOW_STATUS.includes(status)) {
    return { success: false, message: `状态仅允许：${ALLOW_STATUS.join('、')}` }
  }

  try {
    // 2. 更新举报状态，使用服务器时间
    const res = await db.collection('reports').doc(reportId).update({
      data: {
        status: status,
        updateTime: db.serverDate()
      }
    })
    console.log('数据库更新结果', res.stats)

    // 3. 如果传了推送所需参数，自动发送订阅通知
    let sendMsgResult = null
    if (openid && templateId) {
      sendMsgResult = await cloud.callFunction({
        name: 'sendSubscribeMessage',
        data: {
          openid,
          templateId,
          reportId,
          reportStatus: status
        }
      })
      console.log('订阅消息推送结果：', sendMsgResult.result)
    }

    return {
      success: true,
      updated: res.stats.updated,
      sendMsgResult
    }
  } catch (err) {
    console.error('更新举报状态异常：', err)
    let msg = '更新失败'
    if (err.errCode === -1) msg = '该举报记录不存在'
    return {
      success: false,
      message: msg,
      error: err
    }
  }
}

