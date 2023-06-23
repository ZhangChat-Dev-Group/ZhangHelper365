class Command{
	constructor(core) {
		this.core = core
	}
	get info() {
		return {
			name: 'ban',
			developer: 'ZhangSoft',
			level: 3,
			explain: '从当前频道踢出一个或多个用户',
			usage: '^ban 昵称1 昵称2 昵称3 ...',
		}
	}
	run(core, bot, user, args, payload){
		if (args.length < 2) {
			return bot.chat('请告诉我谁即将被封禁')
		}
		const badUsers = args.slice(1)
		badUsers.forEach(n => {
			bot.sendJSON({
				cmd: 'ban',
				nick: n
			})
		})
	}
}

module.exports = Command
