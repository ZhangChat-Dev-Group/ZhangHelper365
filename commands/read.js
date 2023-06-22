class Command{
	constructor(core) {}
	get info() {
		return {
			name: 'read',
			developer: 'ZhangSoft',
			level: 1,
			explain: '查看你还没有阅读的留言',
			usage: '^read',
		}
	}
	run(core, bot, user, args, payload){
		const manager = core.commands.getCommand('msg').manager
		const trip = user.trip
		if (!trip) return bot.chat(`看上去还没有设置识别码，快去设置识别码吧`)
		const msgList = manager.read(trip)
		if (msgList.length === 0) return bot.chat(`好样的！你还没有未读的留言！`)
		var reply = `# ${user.nick} 的留言板\n`
		if (msgList.piece) reply += 'wow，你的人缘可真好~~（来自ZHR的羡慕）~~，以至于我都只能显示前5条了，再次执行 ^read 即可继续查看\n'
		else user.noticed = false
		reply += msgList.map(m => m.msg).join('\n')
		bot.whisper(user.nick, reply)
	}
}

module.exports = Command
