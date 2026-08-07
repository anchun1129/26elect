// submitReport/index.js
// 状态常量，对应任务3
const STATUS = {
  pending:"pending",
  ai_reviewed:"ai_reviewed",
  confirmed:"confirmed",
  processed:"processed",
  rejected:"rejected"
}

exports.main = async (event, context) => {
  // event接收前端传过来：图片fileID、描述、位置等
  console.log("收到上报参数",event)

  // 假逻辑，暂时不真正写库、不上传图片
  return {
    success:true,
    data:{
      _id:"fake_report_001",
      status:STATUS.pending,
      msg:"上报成功（假数据）"
    }
  }
}
