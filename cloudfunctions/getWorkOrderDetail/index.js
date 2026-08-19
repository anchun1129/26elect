const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

const strToNum = {
  "pending": 0,
  "ai_reviewed": 1,
  "processed": 2
}

exports.main = async (event, context) => {
  const { id } = event
  if (!id) {
    return { success: false, msg: "缺少工单id" }
  }

  try {
    const res = await db.collection("reports").doc(id).get()
    
    if (!res.data) {
      return { success: false, msg: "工单不存在" }
    }

    const item = res.data
    let timeStr = ''
    
    if(item.createTime){
      const date = new Date(item.createTime)
      if(!isNaN(date.getTime())){
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, '0')
        const d = String(date.getDate()).padStart(2, '0')
        const h = String(date.getHours()).padStart(2, '0')
        const min = String(date.getMinutes()).padStart(2, '0')
        const s = String(date.getSeconds()).padStart(2, '0')
        timeStr = `${y}-${m}-${d} ${h}:${min}:${s}`
      }
    }
    
    const status = strToNum[item.status] ?? 0

    return {
      success: true,
      data: {
        id: item._id,
        title: item.violationType ?? '',
        desc: item.description ?? '',
        location: item.location ?? '',
        processImageFileID: item.processImageFileID ?? '',
        time: timeStr,
        status: status
      }
    }

  } catch (err) {
    console.error('查询工单详情错误：', err)
    return { success: false, msg: err.message }
  }
}
