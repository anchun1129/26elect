const cloud = require('wx-server-sdk');
const axios = require('axios');   // 需要安装依赖
cloud.init();

// 百度AI配置（不要提交到Git，后期可用云函数环境变量）
const BAIDU_API_KEY = process.env.BAIDU_API_KEY;
const BAIDU_SECRET_KEY = process.env.BAIDU_SECRET_KEY;

// 获取 access_token
async function getAccessToken() {
  const res = await axios.get('https://aip.baidubce.com/oauth/2.0/token', {
    params: {
      grant_type: 'client_credentials',
      client_id: BAIDU_API_KEY,
      client_secret: BAIDU_SECRET_KEY
    }
  });
  return res.data.access_token || res.data.session_key;
}

exports.main = async (event, context) => {
  const { fileID } = event;
  
  try {
    // 1. 下载云存储图片，转为 base64
    const downloadResult = await cloud.downloadFile({ fileID });
    const base64 = downloadResult.fileContent.toString('base64');
    
    // 2. 获取 access_token
    const token = await getAccessToken();
    
    // 3. 调用百度通用物体识别
    const aiRes = await axios.post(
      'https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general',
      { image: base64 },
      {
        params: { access_token: token },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );
    
    // 4. 解析结果，查找与电动车相关的标签
    const results = aiRes.data.result || [];
    const electricKeywords = ['电动', '摩托车', '电瓶车', '电动自行车'];
    const hit = results.find(item => 
      electricKeywords.some(kw => item.keyword.includes(kw))
    );
    
    const isViolation = !!hit;
    const confidence = hit ? hit.score : 0;
    const detail = hit ? hit.keyword : '未识别到电动车';
    
    // 5. 同时更新 reports 集合中的 AI 审核结果
    // 这里先只返回结果，由后端云函数调用本函数并更新状态
    
    return {
      code: 0,
      data: {
        isViolation,
        confidence,
        detail
      }
    };
  } catch (err) {
    console.error('AI审核失败:', err);
    return {
      code: -1,
      errMsg: err.message
    };
  }
};