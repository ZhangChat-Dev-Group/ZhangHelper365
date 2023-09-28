const moment = require('moment')

class Command{
	constructor(core) {}
	get info() {
		return {
			name: 'arrived',
			developer: 'ZhangSoft',
			level: 1,
			explain: '查看你发送的留言是否已送达目标用户',
			usage: '^arrived',
		}
	}
	run(core, bot, user, args, payload){
		const manager = core.commands.getCommand('msg').manager
		const trip = user.trip
		const messages = manager.message
		if (!trip) return bot.chat(`看上去还没有设置识别码，快去设置识别码吧`)
		
		const notArrived = []
		Object.keys(messages).forEach(u => {
			const notRead = messages[u].filter(m => m.trip === trip && !m.read)
			if (notRead.length > 0) notArrived.push({ trip: u, time: notRead.sort((a, b) => a.time - b.time)[0].time })
		})

		var reply = `# ${user.nick} 的留言未送达用户\n${notArrived.map(o => `识别码：${o.trip} | 最早未送达留言的日期：${moment(o.time).format('YYYY-MM-DD HH:mm:ss')}`).join('\n')}`
		bot.whisper(user.nick, reply)
	}
}

module.exports = Command