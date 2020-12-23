const { SyncPostService } = require('../services/syncPost')
const Log = require('../util/log')
class SyncPostController {
  static async postSyncPostAdd (ctx) {
    const body = JSON.parse(JSON.stringify(ctx.request.body))
    try {
      await SyncPostService.add(body)
      Log.warning('INSERT action on ' + body.id)
      ctx.body = { code: 0, message: 'success' }
    } catch (e) {
      ctx.body = { code: 1160, message: 'missing context' }
    }
  }

  static async postSyncPostDelete (ctx) {
    const body = JSON.parse(JSON.stringify(ctx.request.body))
    try {
      await SyncPostService.delete(body)
      Log.warning('DELETE action on ' + body.id)
      ctx.body = { code: 0, message: 'success' }
    } catch (e) {
      ctx.body = { code: 1160, message: 'missing context' }
    }
  }
}

module.exports = SyncPostController
