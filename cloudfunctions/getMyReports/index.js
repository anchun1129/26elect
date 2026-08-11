// getMyReports/index.js
const STATUS = {
  pending:"pending",
  ai_reviewed:"ai_reviewed",
  confirmed:"confirmed",
  processed:"processed",
  rejected:"rejected"
}

exports.main = async (event, context) => {
  // openid由云开发自动拿到
  return {
    success:true,
    data:[
      {
        _id:"fake_r01",
        status:STATUS.pending,
        desc:"电动车占用人行通道停放",
        createTime:new Date()
      },
      {
        _id:"fake_r02",
        status:STATUS.processed,
        desc:"楼道内违规停放电动车",
        createTime:new Date()
      }
    ]
  }
}

