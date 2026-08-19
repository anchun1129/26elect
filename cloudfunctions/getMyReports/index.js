// getMyReports/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  // 参数兜底+类型约束
  let { page = 1, pageSize = 10, status } = event
  page = Number(page)
  pageSize = Math.min(Number(pageSize), 20) // 限制最大20条，防止拉取过多数据
  const { OPENID } = cloud.getWXContext()
  console.log('我的举报查询参数', { OPENID, page, pageSize, status })

  try {
    // 组装查询条件
    const whereCond = {_openid: OPENID}
    if (status && status.trim()) {
      whereCond.status = status.trim()
    }

    const skipNum = (page - 1) * pageSize
    // 查询列表
    const listRes = await db.collection("reports")
      .where(whereCond)
      .orderBy("createTime", "desc")
      .skip(skipNum)
      .limit(pageSize)
      .get()
    // 查询总数
    const countRes = await db.collection("reports")
      .where(whereCond)
      .count()

    return {
      success: true,
      data: listRes.data,
      total: countRes.total,
      page,
      pageSize
    }
  } catch (err) {
    console.error('查询我的举报异常：', err)
    return {
      success: false,
      message: '查询举报列表失败',
      error: err.message
    }
  }
}


