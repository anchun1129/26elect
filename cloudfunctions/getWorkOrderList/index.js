const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

const numToStr = {
  0: "pending",
  1: "ai_reviewed",
  2: "processed"
}
const strToNum = {
  "pending": 0,
  "ai_reviewed": 1,
  "processed": 2
}
const colorMap = {
  0: "red",
  1: "orange",
  2: "green"
}

exports.main = async (event, context) => {
  let { status, page = 1, pageSize = 20 } = event

  if (status === undefined) {
    return { success: false, msg: "缺少status参数" }
  }

  const dbStatus = numToStr[status]
  if (!dbStatus) {
    return { success: false, msg: "非法状态值" }
  }

  page = Math.max(1, Number(page))
  pageSize = Math.min(50, Math.max(1, Number(pageSize)))

  try {
    const skipNum = (page - 1) * pageSize
    const query = db.collection("reports").where({ status: dbStatus })

    // 列表数据
    const res = await query
      .skip(skipNum)
      .limit(pageSize)
      .get()
    // 总数
    const countRes = await query.count()

    const list = res.data || []
    const data = list.map(item => {
      let timeStr = ''
      if (item.createTime) {
        const date = new Date(item.createTime)
        if (!isNaN(date.getTime())) {
          const y = date.getFullYear()
          const m = String(date.getMonth() + 1).padStart(2, '0')
          const d = String(date.getDate()).padStart(2, '0')
          const h = String(date.getHours()).padStart(2, '0')
          const min = String(date.getMinutes()).padStart(2, '0')
          const s = String(date.getSeconds()).padStart(2, '0')
          timeStr = `${y}-${m}-${d} ${h}:${min}:${s}`
        }
      }
      const st = strToNum[item.status] ?? 0
      // 颜色兜底，默认红色
      const tagColor = colorMap[st] ?? "red"
      return {
        id: item._id,
        title: item.violationType ?? '',
        desc: item.description ?? '',
        location: item.location ?? '',
        time: timeStr,
        status: st,
        tagColor: tagColor
      }
    })

    return {
      success: true,
      data,
      total: countRes.total,
      page,
      pageSize
    }

  } catch (err) {
    console.error('列表查询异常', err)
    return {
      success: false,
      msg: err.message
    }
  }
}
