class Command{
	constructor(core) {
		this.core = core
	}
	get info() {
		return {
			name: 'lock',
			developer: 'ZhangSoft',
			level: 2,
			explain: '锁定或解除锁定本频道',
			usage: '^lock',
		}
	}
	run(core, bot, user, args, payload){
		bot.sendJSON({
			cmd: 'lockroom',
		})
	}
}

module.exports = Command
