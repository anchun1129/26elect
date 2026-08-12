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

  const res = await db.collection("reports")
    .where({
      status: db.command.in([STATUS.pending, STATUS.ai_reviewed])
    })
    .orderBy("createTime","desc")
    .get()

  return {
    success:true,
    data: res.data
  }
}
