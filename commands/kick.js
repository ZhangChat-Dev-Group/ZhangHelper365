class Command{
	constructor(core) {
		this.core = core
	}
	get info() {
		return {
			name: 'kick',
			developer: 'ZhangSoft',
			level: 2,
			explain: '从当前频道踢出一个或多个用户',
			usage: '^kick 昵称1 昵称2 昵称3 ...',
		}
	}
	run(core, bot, user, args, payload){
		if (args.length < 2) {
			return bot.chat('请告诉我谁即将被踢出去')
		}
		const badUsers = args.slice(1)
		bot.sendJSON({
			cmd: 'kick',
			nick: badUsers,
		})
	}
}

module.exports = Command
