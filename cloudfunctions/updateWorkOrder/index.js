// updateWorkOrder/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

//数字→英文（管理端传数字）
const numToEng = {
  0: "pending",
  1: "processing",
  2: "rejected",
  3: "processed"
}
//中文备用映射
const cnToEng = {
  "待处理": "pending",
  "处理中": "processing",
  "已驳回": "rejected",
  "已办结": "processed"
}
const validEngStatus = Object.values(numToEng)

exports.main = async (event, context) => {
  const { id, status, remark, processImageFileID } = event
  const { OPENID } = cloud.getWXContext()
  console.log('更新工单入参', event, '操作者openid：', OPENID)

  if (!id || status === undefined) {
    return { success: false, msg: '缺少工单id或者状态参数' }
  }

  let storeStatus = null
  if (typeof status === "number") {
    storeStatus = numToEng[status]
  } else if (typeof status === "string") {
    storeStatus = cnToEng[status]
  }

  if (!validEngStatus.includes(storeStatus)) {
    return { success: false, msg: '传入的状态非法' }
  }

  try {
    const updateObj = {
      status: storeStatus,
      updateTime: db.serverDate()
    }

    if (remark !== undefined) {
      updateObj.remark = remark
    }
    if (processImageFileID !== undefined) {
      updateObj.processImageFileID = processImageFileID
    }

    const res = await db.collection('reports').doc(id).update({
      data: updateObj
    })

    // 判断是否有数据被修改
    if (res.stats.updated === 0) {
      return { success: false, msg: '工单不存在或数据无改动' }
    }

    return {
      success: true,
      msg: '工单更新成功'
    }
  } catch (err) {
    console.error('工单更新异常：', err)
    return {
      success: false,
      msg: '工单更新失败',
      error: err.message
    }
  }
}
