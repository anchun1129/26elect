const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const openid = cloud.getWXContext().OPENID
  console.log('查询用户角色 openid：', openid)
  try {
    const res = await db.collection('users').where({
      _openid: openid
    }).get()
    let isAdmin = false
    if (res.data.length > 0) {
      isAdmin = !!res.data[0].isAdmin
    }
    //查不到用户也返回成功
    return {
      success: true,
      data: {
        isAdmin: isAdmin
      }
    }
  } catch (e) {
    //只有数据库故障才会走到这里
    console.error('查询用户角色失败：', e)
    return {
      success: false,
      msg: '服务异常',
      data: { isAdmin: false }
    }
  }
}
