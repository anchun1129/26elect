// getPendingReports/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const STATUS = {
    pending:"pending",
    ai_reviewed:"ai_reviewed",
    confirmed:"confirmed",
    processed:"processed",
    rejected:"rejected"
  }

  // 分页参数处理
  let { page = 1, pageSize = 10 } = event
  page = Number(page)
  pageSize = Math.min(Number(pageSize), 20)
  const skipNum = (page - 1) * pageSize

  try {
    const res = await db.collection("reports")
      .where({
        status: db.command.in([STATUS.pending, STATUS.ai_reviewed])
      })
      .orderBy("createTime","desc")
      .skip(skipNum)
      .limit(pageSize)
      .get()

    // 查询总数用于分页
    const countRes = await db.collection("reports")
      .where({
        status: db.command.in([STATUS.pending, STATUS.ai_reviewed])
      }).count()

    return {
      success:true,
      data: res.data,
      total: countRes.total,
      page,
      pageSize
    }
  } catch (err) {
    console.error("查询待处理举报报错：", err)
    return {
      success: false,
      message: "获取待处理列表失败",
      error: err.message
    }
  }
}