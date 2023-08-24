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
	tooFast(core, user, payload) {
		let warnings = user.warnings || 0
		if (user.nick === core.config.auth.nick) return { level: 0, warnings, }
		if (typeof user.lastChat !== 'number') {
			user.lastChat = payload.time
			warnings = 0
			return { level: 0, warnings, }
		}
		if (typeof user.pardonTime === 'number' && Date.now() >= user.pardonTime) {
			warnings = 0
		}
		var tooFast = false
		if (payload.time - 500 <= user.lastChat) {
			warnings += 1
			user.pardonTime = Date.now() + 2 * 60 * 1000
			tooFast = true
		}
		user.lastChat = payload.time
		if (warnings < 6 && warnings % 3 === 0 && tooFast) return { level: 1, warnings, }
		else if (user.warnings >= 6) {
			warnings = 0
			return { level: 2, warnings, }
		}
		return { level: 0, warnings, }
	}
	sameContent(core, user, payload) {
		let warnings = user.warnings || 0
		if (user.nick === core.config.auth.nick) return { level: 0, warnings, }
		if (typeof user.lastContent !== 'string') {
			user.lastContent = payload.text
			warnings = 0
			return { level: 0, warnings, }
		}
		if (typeof user.pardonTime === 'number' && Date.now() >= user.pardonTime) {
			warnings = 0
		}
		var tooFast = false
		if (payload.text === user.lastContent) {
			warnings += 1
			user.pardonTime = Date.now() + 20 * 1000
			tooFast = true
		}
		user.lastContent = payload.text
		if (warnings < 6 && warnings % 3 === 0 && tooFast) return { level: 1, warnings, }
		else if (warnings >= 6) {
			warnings = 0
			return { level: 2, warnings, }
		}
		return { level: 0, warnings, }
	}
	checkSpam(core, bot, payload) {
		const user = bot.users.get(payload.nick)
		const fastResult = this.tooFast(core, user, payload)
		const sameResult = this.sameContent(core, user, payload)

		var level = fastResult.level
		if (sameResult.level > level) level = sameResult.level

		var warnings = fastResult.warnings
		if (sameResult.warnings > warnings) level = sameResult.warnings

		if (level === 1) {
			bot.chat(`@${user.nick} \n# ==**你凭什么凌驾于规则之上？**==`)
			return false
		} else if (level === 2) {
			bot.chat(`@${user.nick} \n# ==**你是故意找茬，是不是？**==`)
			bot.sendJSON({
				cmd: 'dumb',
				nick: user.nick,
				time: 1
			})
			return false
		} else if (level === 0) return payload
	}
	initHooks(bot) {
		bot.regHook('chat', this.checkSpam.bind(this), 25)
	}
}

module.exports = Command
