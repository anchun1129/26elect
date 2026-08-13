// sendSubscribeMessage/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { openid, templateId, reportId, reportStatus } = event
  console.log('订阅消息入参：', event)

  // 1. 参数完整性校验
  if (!openid || !templateId) {
    return { success: false, message: '缺少openid或templateId' }
  }
  if (!reportId) {
    return { success: false, message: '缺少举报ID reportId' }
  }

  try {
    // 2. 调用订阅消息推送接口
    const sendRes = await cloud.openapi.subscribeMessage.send({
      touser: openid,
      templateId: templateId,
      page: `pages/reportDetail/reportDetail?id=${reportId}`,
      data: {
        thing1: { value: '停放举报处理通知' },
        phrase2: { value: reportStatus || '已更新状态' }
      }
    })
    console.log('订阅消息发送成功：', sendRes)
    return {
      success: true,
      message: '消息推送成功',
      data: sendRes
    }
  } catch (err) {
    console.error('订阅消息发送失败：', err)
    // 3. 分类处理微信官方错误
    let tipMsg = '消息推送失败'
    const errCode = err?.errCode
    switch (errCode) {
      case 43101:
        tipMsg = '用户未订阅该消息，无法推送'
        break
      case 40037:
        tipMsg = '模板ID不存在或已失效'
        break
      case 45009:
        tipMsg = '推送频次超限，请稍后再试'
        break
      case 40003:
        tipMsg = 'openid无效，用户不存在'
        break
    }
    return {
      success: false,
      message: tipMsg,
      errCode,
      errorDetail: err
    }
  }
}