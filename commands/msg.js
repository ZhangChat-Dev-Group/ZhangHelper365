const path = require('path')
const fs = require('fs')
const moment = require('moment')

class MessageManager {
	constructor() {
		this.file = path.resolve(__dirname, '..', 'config', 'message.json')
		this.message = {}
		this.load()
	}
	load() {
		this.message = JSON.parse(fs.readFileSync(this.file))
	}
	save() {
		fs.writeFileSync(this.file, JSON.stringify(this.message))
	}
	check(trip) {
		return Array.isArray(this.message[trip])
	}
	get(trip) {
		return this.message[trip] || []
	}
	del(trip) {
		delete this.message[trip]
		this.save()
	}
	read(trip) {
		const all = this.get(trip).filter(m => !m.read)
		var msg = all
		if (msg.length > 5) {
			msg = all.slice(0,5)
			msg.piece = true
		}
		for(let m of msg) {
			m.read = true
		}
		this.save()
		return msg
	}
	add(trip, nick, senderTrip, msg) {
		const now = moment().format('YYYY-MM-DD HH:mm:ss')
		if (!Array.isArray(this.message[trip])) this.message[trip] = []
		this.message[trip].push({
			msg: `[${now}] ${nick}#${senderTrip}: ${msg}`,
			read: false,
		})
		this.save()
	}
}

class Command{
	constructor(core) {
		this.manager = new MessageManager()
		this.noticedID = []
	}
	get info() {
		return {
			name: 'msg',
			developer: 'ZhangSoft',
			level: 1,
			explain: '向指定识别码的用户留言',
			usage: '^msg 识别码 信息',
		}
	}
	run(core, bot, user, args, payload){
		const trip = args[1]
		const message = args.slice(2)
		if (!trip || !message) return bot.chat('抱歉，参数错误，请检查后再试')
		if (!/^[a-zA-Z0-9/\+]{6}$/.test(trip)) return bot.chat('你管这叫识别码？')
		this.manager.add(trip, user.nick, user.trip || '', message)
		bot.chat(`我记下来了，当识别码为 ${trip} 的用户说话的时候，我会提醒TA查看的`)
		bot.users.users.filter(u => u.trip === trip).forEach(u => u.noticed = false)
	}
	notice(core, bot, payload) {
		const user = bot.users.get(payload.nick)
		if (user.noticed) return payload
		if (!user.trip) return payload
		if (this.manager.get(user.trip).filter(m => !m.read).length === 0) return payload
		bot.whisper(user.nick, `hi yo 你有一些留言还没有查看，执行 ^read 即可查看哦`)
		user.noticed = true
		return payload
	}
	initHooks(bot) {
		bot.regHook('chat', this.notice.bind(this), 25)
	}
}

module.exports = Command
