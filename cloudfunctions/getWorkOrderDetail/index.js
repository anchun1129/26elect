// getWorkOrderDetail/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

const engToNum = {
  pending: 0,
  processing: 1,
  rejected: 2,
  processed: 3
}

exports.main = async (event, context) => {
  const { id } = event
  if (!id) {
    return {
      success: false,
      msg: '缺少工单id'
    }
  }
  try {
    const res = await db.collection('reports').doc(id).get()
    const item = res.data
    if (!item) {
      return {
        success: false,
        msg: '工单不存在'
      }
    }

    const statusEng = item.status
    const statusNum = engToNum[item.status] ?? 0

    // 格式化创建时间
    let createTimeStr = ''
    if(item.createTime){
      const date = new Date(item.createTime)
      if(!isNaN(date.getTime())){
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, '0')
        const d = String(date.getDate()).padStart(2, '0')
        const h = String(date.getHours()).padStart(2, '0')
        const min = String(date.getMinutes()).padStart(2, '0')
        const s = String(date.getSeconds()).padStart(2, '0')
        createTimeStr = `${y}-${m}-${d} ${h}:${min}:${s}`
      }
    }

    return {
      success: true,
      data: {
        _id: item._id,
        _openid: item._openid,
        violationType: item.violationType ?? '',
        description: item.description ?? '',
        location: item.location ?? '',
        phone: item.phone ?? '',
        processImageFileID: item.processImageFileID ?? '',
        remark: item.remark ?? '',
        createTime: createTimeStr,
        updateTime: item.updateTime,
        statusEng: statusEng,
        statusNum: statusNum
      }
    }
  } catch (err) {
    console.error('查询工单详情异常：', err)
    return {
      success: false,
      msg: '查询工单失败',
      error: err.message
    }
  }
}
