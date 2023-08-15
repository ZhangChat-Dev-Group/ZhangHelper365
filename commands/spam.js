class Command{
	constructor(core) {}
	get info() {
		return {
			name: 'spam',
			developer: 'ZhangSoft',
			level: 1,
			explain: '请不要刷屏',
			usage: '只要你刷屏，就会自动调用这个命令',
		}
	}
	run(core, bot, user, args, payload){}
	checkSpam(core, bot, payload) {
		const user = bot.users.get(payload.nick)
		if (user.nick === core.config.auth.nick) return payload
		if (typeof user.lastChat !== 'number') {
			user.lastChat = payload.time
			user.warnings = 0
			return payload
		}
		if (typeof user.pardonTime === 'number' && Date.now() >= user.pardonTime) {
			user.warnings = 0
		}
		var tooFast = false
		if (payload.time - 500 <= user.lastChat) {
			user.warnings += 1
			user.pardonTime = Date.now() + 2 * 60 * 1000
			tooFast = true
		}
		user.lastChat = payload.time
		if (user.warnings < 6 && user.warnings % 3 === 0 && tooFast) bot.chat(`@${payload.nick} \n# ==**你凭什么凌驾于规则之上？**==`)
		else if (user.warnings >= 6) {
			bot.chat(`@${user.nick} \n# ==**你是故意找茬儿，是不是？**==`)
			bot.sendJSON({
				cmd: 'dumb',
				nick: user.nick,
				time: 1,
			})
			user.warnings = 0
		}
		return payload

	}
	initHooks(bot) {
		bot.regHook('chat', this.checkSpam.bind(this), 25)
	}
}

module.exports = Command
