class Command{
	constructor(core) {
		this.core = core
	}
	get info() {
		return {
			name: 'cap',
			developer: 'ZhangSoft',
			level: 2,
			explain: '启用或禁用人机验证',
			usage: '^cap',
		}
	}
	run(core, bot, user, args, payload){
		bot.sendJSON({
			cmd: 'captcha',
		})
	}
}

module.exports = Command
