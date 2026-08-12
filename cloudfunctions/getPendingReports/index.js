// getPendingReports/index.js

exports.main = async (event, context) => {
  // STATUS移到函数内部
  const STATUS = {
    pending:"pending",
    ai_reviewed:"ai_reviewed",
    confirmed:"confirmed",
    processed:"processed",
    rejected:"rejected"
  }

  return {
    success:true,
    data:[
      {
        _id:"fake_p01",
        status:STATUS.pending,
        desc:"电动车乱停堵塞消防通道",
        createTime:new Date()
      }
    ]
  }
}
