const Mysql = require('../database/mysql')
const moment = require('moment')

const Log = require('../util/log')

const PLATFORM = 'mastodon'

class MastodonService {
  static async addStatusList (statusList, domain) {
    let valuesSql = ''
    const valuesData = []
    for (let i = 0; i < statusList.length; i++) {
      const item = statusList[i]
      const jsonData = JSON.stringify(item)
      const date = moment(new Date(item.created_at), false).format('YYYY-MM-DD HH:mm:ss')
      if (jsonData.length > 10239) {
        Log.warning(`存入 ${PLATFORM} 动态时遇到过大的 Data JSON，id: ${item.id}`)
        continue
      }
      if (/^<p>[a-f0-9]{20}<\/p>$/i.test(item.content)) {
        return
      }

      const instance = domain.replace(/(http(s?):\/\/)/gm, '')

      valuesData.push(
        PLATFORM + '_' + instance + '_' + item.id,
        PLATFORM,
        item.account.id + '@' + domain.replace(/(http(s?):\/\/)/gm, ''),
        item.account.id,
        item.account.username,
        date,
        jsonData
      )
      valuesSql += (valuesSql ? ',' : '') + '(?, ?, ?, ?, ?, ?, ?)'
    }
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
    console.log(res)
    Log.debug('Mastodon 数据库返回的结果：' + JSON.stringify(res))
    return res
  }

  static async getUserList () {
    const sql = `
            SELECT
                t1.*,
                IFNULL(t2.timeline_switch, 0) as timeline_switch
            FROM
                user_accounts t1
            LEFT JOIN
                twitter_user_timeline_switch t2 ON t1.uid = t2.user_id
            WHERE
                t1.platform = 'twitter'
            `

    const res = await Mysql.matataki.query(sql)
    return JSON.parse(JSON.stringify(res))
  }
}

module.exports = MastodonService
