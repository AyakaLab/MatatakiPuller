const { TimelineService, TimelineTestService } = require('../services/timeline')

class StatusController {
    constructor() {}

    static async getStatus (ctx) {
        if (!ctx.user || !ctx.user.id) {
            ctx.status = 403
            return
        }
        const { page = 1, pagesize = 20 } = ctx.request.query
        console.log('请求的用户：', ctx.user)
        console.log('userId: ', ctx.user.id)
        const res = await TimelineService.getSubscribedTimeline(ctx.user.id, parseInt(page), parseInt(pagesize))
        return {
            code: 0,
            data: res
        }
    }

    static async getStatusTest (ctx) {
        if (!ctx.user || !ctx.user.id) {
            ctx.status = 403
            return
        }
        const { page = 1, pagesize = 20 } = ctx.request.query
        console.log('请求的用户：', ctx.user)
        console.log('userId: ', ctx.user.id)
        const res = await TimelineTestService.getSubscribedTimeline(ctx.user.id, parseInt(page), parseInt(pagesize))
        return {
            code: 0,
            data: res
        }
    }

    static async getStatusSubscriptionList (ctx) {
        if (!ctx.user || !ctx.user.id) {
            ctx.status = 403
            return
        }
        console.log('请求的用户：', ctx.user)
        console.log('userId: ', ctx.user.id)
        const res = await TimelineService.getStatusSubscriptionList(ctx.user.id)
        return {
            code: 0,
            data: res
        }
    }

    static async getStatusSubscriptionListTest (ctx) {
        if (!ctx.user || !ctx.user.id) {
            ctx.status = 403
            return
        }
        console.log('请求的用户：', ctx.user)
        console.log('userId: ', ctx.user.id)
        const res = await TimelineTestService.getStatusSubscriptionList(ctx.user.id)
        return {
            code: 0,
            data: res
        }
    }
}

module.exports = StatusController