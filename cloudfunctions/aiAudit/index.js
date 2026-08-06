const cloud = require('wx-server-sdk');
cloud.init();

exports.main = async (event, context) => {
  // event.fileID 是前端上传图片后拿到的云存储文件ID
  const { fileID } = event;

  // 暂时不调AI，直接返回假结果
  const fakeResult = {
    isViolation: true,         // 是否违规
    confidence: 0.95,          // 置信度
    detail: '电动车（模拟）'   // 识别标签
  };

  // 后续接入真实AI时，就在这里调用API并解析结果

  return {
    code: 0,
    data: fakeResult
  };
};