class Command{
	constructor(core) {
		if (!Array.isArray(core.config.blockedNicks)) core.config.blockedNicks = []
	}
	get info() {
		return {
			name: 'block',
			developer: 'ZhangSoft',
			level: 3,
			explain: '添加或删除一个被屏蔽的昵称关键字，只要检测到有人使用包含被屏蔽的关键字的昵称加入，就会被自动封禁，不填昵称则显示所有被屏蔽的关键字',
			usage: '^block 昵称',
		}
	}
	run(core, bot, user, args, payload){
		const nick = (args[1] || '').toLowerCase()
		if (!nick) return bot.chat('下面是屏蔽关键词列表：\n' + core.config.blockedNicks.join(' '))
		if (!core.config.blockedNicks.includes(nick)) {
			core.config.blockedNicks.push(nick)
			core.configManager.save()
			bot.chat(`已屏蔽关键字：${nick}\n当有人使用包含这个关键字的昵称加入时，我会立刻将其封禁`)
		}else {
			core.config.blockedNicks = core.config.blockedNicks.filter(n => n !== nick)
			core.configManager.save()
			bot.chat(`已删除关键字：${nick}`)
		}
	}
	checkUser(core, bot, payload) {
		const nick = payload.nick.toLowerCase()
		for (let i of core.config.blockedNicks) {
			if (nick.includes(i)) {
				bot.sendJSON({
					cmd: 'ban',
					nick: payload.nick,
				})
				return false
			}
		}
		return payload
	}
	initHooks(bot) {
		bot.regHook('onlineAdd', this.checkUser.bind(this), 0)
	}
}

module.exports = Command
