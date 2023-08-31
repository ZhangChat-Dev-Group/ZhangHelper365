const uuid = require('uuid').v4

class Command{
	constructor(core) {
        core.pingId = uuid()
        core.sendTime = 0
    }
	get info() {
		return {
			name: 'ping',
			developer: 'ZhangSoft',
			level: 2,
			explain: '用于测试本bot的网络延迟',
			usage: '^ping',
		}
	}
	run(core, bot, user, args, payload){
		const id = args[1]

        if (id === core.pingId) {
            bot.chat('当前网络延迟：' + String(payload.time - core.sendTime) + 'ms')
            core.pingId = uuid()
            core.sendTime = undefined
            return
        }

        core.pingId = uuid()
        core.sendTime = Date.now()
        bot.chat('^ping ' + core.pingId)
	}
}

module.exports = Command
