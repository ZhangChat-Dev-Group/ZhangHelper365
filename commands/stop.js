class Command{
	constructor(core) {}
	get info() {
		return {
			name: 'stop',
			developer: 'ZhangSoft',
			level: 4,
			explain: '关闭或取消关闭此机器人',
			usage: '^stop',
		}
	}
	run(core, bot, user, args, payload){
		if (!core.exitTask) {
			core.exitTask = setTimeout(() => process.exit(0), 5000)
			bot.chat(`我将在5秒后停止运行`)
		} else {
			clearTimeout(core.exitTask)
			delete core.exitTask
			bot.chat(`已取消倒计时`)
		}
	}
}

module.exports = Command
