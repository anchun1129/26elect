// 云函数 boardStat
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  // 获取reports集合，按时间倒序最多100条
  const res = await db.collection('reports').orderBy('time','desc').limit(100).get()
  const list = res.data

  // 获取今日日期
  const todayStr = new Date().toLocaleDateString()
  const todayList = list.filter(item=>{
    const d = new Date(item.time)
    return d.toLocaleDateString() === todayStr
  })

  //统计
  const total = todayList.length
  const warnList = todayList.filter(i=>i.status==='warn')
  const normalList = todayList.filter(i=>i.status==='normal')
  const warnCount = warnList.length
  const normalCount = normalList.length

  //告警地点去重
  const warnPlaces = [...new Set(warnList.map(i=>i.place))]
  //最新5条记录
  const latest5 = list.slice(0,5)

  return {
    total,
    warnCount,
    normalCount,
    warnPlaces,
    latest5
  }
}