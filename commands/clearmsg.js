class Command{
	constructor(core) {}
	get info() {
		return {
			name: 'clearmsg',
			developer: 'ZhangSoft',
			level: 1,
			explain: '删除你所有的留言',
			usage: '^clearmsg',
		}
	}
	run(core, bot, user, args, payload){
		const manager = core.commands.getCommand('msg').manager
		const trip = user.trip
		if (!trip) return bot.chat(`看上去还没有设置识别码，快去设置识别码吧`)
		manager.del(trip)
		bot.chat(`留言板已经清空啦`)
	}
}

module.exports = Command
