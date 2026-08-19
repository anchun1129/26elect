const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

const numToStr = {
  0: "pending",
  1: "ai_reviewed",
  2: "processed"
}

exports.main = async (event, context) => {
  const { id, status, processImageFileID } = event
  // 获取云函数调用者openid，可用于权限校验
  const openid = cloud.getWXContext().OPENID

  if (!id) {
    return { success: false, msg: "缺少工单id" }
  }
  if (status === undefined) {
    return { success: false, msg: "缺少状态参数status" }
  }
  const dbStatus = numToStr[status]
  if (!dbStatus) {
    return { success: false, msg: "非法状态值" }
  }

  try {
    const updateData = {
      status: dbStatus,
      updateTime: db.serverDate()
    }

    // 仅当明确传入非undefined的值才更新图片；如果你想空字符串也覆盖，可以保留原来
    if (processImageFileID !== undefined) {
      updateData.processImageFileID = processImageFileID
    }

    const res = await db.collection("reports").doc(id).update({
      data: updateData
    })

    console.log('工单更新', id, '操作者openid:', openid, '新状态:', dbStatus)

    if (res.stats.updated === 0) {
      return { success: false, msg: "工单不存在，未更新" }
    }
    return {
      success: true,
      msg: "状态更新成功"
    }
  } catch (err) {
    console.error('更新工单异常', err)
    return {
      success: false,
      msg: err.message
    }
  }
}
