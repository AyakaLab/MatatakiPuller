const Log = require('../util/log')
const Mysql = require('../database/mysql')
const moment = require('moment')

class SyncPostService {
  static async add (data) {
    let valuesSql = ''
    const valuesData = []

    try {
      const arr = []
      arr.push(data.id)
      arr.push(data.uid)
      arr.push(data.timestamp)
    } catch {
      throw new Error('Missing context')
    }
    // 依据 UTC 时间生成 Date 对象
    const timestamp = moment.utc(data.timestamp, 'YYYY-MM-DD HH:mm:ss').toDate()

    valuesData.push(
      'matataki_' + data.id,
      'matataki',
      data.uid,
      data.uid,
      null,
      moment(timestamp).format('YYYY-MM-DD HH:mm:ss'),
      data.id
    )
    valuesSql += (valuesSql ? ',' : '') + '(?, ?, ?, ?, ?, CONVERT_TZ(?, "+00:00", "+08:00"), ?)'

    if (!valuesSql) return null
    const sql = `
      INSERT INTO platform_status_cache
        (id, platform, platform_user, platform_user_id, platform_username, timestamp, data)
      VALUES
        ${valuesSql}
      ON DUPLICATE KEY UPDATE
        data = VALUES(data);
    `

    const res = await Mysql.cache.query(sql, valuesData)
    Log.debug('数据库返回的结果：' + JSON.stringify(res))
    return res
  }

  static async delete (data) {
    try {
      const arr = []
      arr.push(data.id)
    } catch {
      throw new Error('Missing context')
    }

    const res = await Mysql.cache.query(`DELETE FROM platform_status_cache WHERE platform = 'matataki' AND id = 'matataki_${data.id}';`)
    console.log(res)
    return res
  }
}

module.exports = {
  SyncPostService
}
