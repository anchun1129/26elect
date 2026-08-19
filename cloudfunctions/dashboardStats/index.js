// dashboardStats/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    const res = await db.collection('reports').aggregate()
      .group({
        _id: '$status',
        count: { $sum: 1 }
      })
      .end()

    const statMap = {
      pending: 0,
      ai_reviewed: 0,
      confirmed: 0,
      processed: 0,
      rejected: 0
    }

    res.list.forEach(item => {
      if (statMap.hasOwnProperty(item._id)) {
        statMap[item._id] = item.count
      }
    })

    const total = statMap.pending + statMap.ai_reviewed + statMap.confirmed + statMap.processed + statMap.rejected

    // 今日零点 → 转为毫秒时间戳
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()

    const todayRes = await db.collection('reports')
      .where({
        createTime: _.gte(todayStart)
      })
      .count()

    const todayReports = todayRes.total

    // 已处理 = processed + rejected
    const handled = statMap.processed + statMap.rejected
    const handleRate = total === 0 ? 0 : Number((handled / total * 100).toFixed(2))

    return {
      success: true,
      data: {
        totalReports: total,
        todayReports,
        handleRate,
        ...statMap
      }
    }
  } catch (err) {
    console.error('统计报表出错：', err)
    return {
      success: false,
      message: err.message
    }
  }
}
