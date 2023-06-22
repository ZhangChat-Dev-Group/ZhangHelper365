class Command{
	constructor(core) {}
	get info() {
		return {
			name: 'allmsg',
			developer: 'ZhangSoft',
			level: 1,
			explain: '查看你所有的留言',
			usage: '^allmsg 索引（可不填）',
		}
	}
	run(core, bot, user, args, payload){
		const manager = core.commands.getCommand('msg').manager
		const trip = user.trip
		if (!trip) return bot.chat(`看上去还没有设置识别码，快去设置识别码吧`)
		const msgList = Array.from(manager.get(trip))
		if (msgList.length === 0) return bot.chat(`你的留言板空空如也，快去让别人发起留言吧`)
		var reply = `# ${user.nick} 的留言板\n`
		var index = Number.parseInt(args[1]) - 1
		if (isNaN(index) || index < 0) index = 0
		const pages = []
		for (let i = 0; i < Math.ceil(msgList.length / 5); i++) {
			pages.push([])
		}
		for (let i in pages) {
			pages[i] = msgList.splice(0, 5)
		}
		if (index > pages.length - 1) return bot.chat(`你的留言还没有那么多哦`)
		reply += `当前页：${index + 1} / ${pages.length} 每页显示5条留言\n`
		reply += pages[index].map(m => m.msg).join('\n')
		bot.whisper(user.nick, reply)
	}
}

module.exports = Command