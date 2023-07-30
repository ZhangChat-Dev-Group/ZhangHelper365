const fs = require('fs')
const path = require('path')
const moment = require('moment')

class Command {
	constructor(core) {}
	get info() {
		return {
			name: 'draw',
			developer: 'ZhangSoft',
			level: 1,
			explain: '调用 ?lobby 的 ultra_weeb#Rdais/ 机器人的NovelAI功能生成图片',
			usage: '^draw 关键词',
		}
	}
	run(core, bot, user, args, payload){
		if (!user.trip) return
		const programming = core.ws
		if (!programming.ready) return bot.chat(`在 ?lobby 的互通机器人尚未就绪，请稍后再试，如果此问题重复出现，请联系超级管理员`)

		if (!programming.users.includes('ultra_weeb')) return bot.chat(`无法在 ?lobby 中找到机器人 ultra_weeb`)
		const tags = args.slice(1).join(' ').toLowerCase().replaceAll(',', ' ').replace(/ {2,}/g, ' ').trim()
		if (!tags) return bot.chat('你想画什么？')
		for (let t of core.config.nsfw) {
			if (tags.includes(t)) return bot.sendJSON({
				cmd: 'dumb',
				nick: user.nick,
				time: 1,
			})
		}
		programming.whisper('ultra_weeb', `&igen ${args.slice(1).join(' ')}`)
		if (programming.listeners('img-res').length === 0) programming.on('img-res', img => {
			core.logger.info(`Received a image: ${img}`)
			var link = img.slice(4)
			link = link.slice(0, link.length - 1)
			core.logger.info(`Link: ${link}`)
			fetch(link).then(res => {
				res.arrayBuffer().then(b => {
					fs.writeFile(path.join(__dirname, '..', 'files', moment().format('YYYY-MM-DD_HH-mm-ss.png')), Buffer.from(b), {}, (err) => {
						if (err) core.logger.error('Failed to save image, err: ' + err)
					})
				})
			})
			.catch(err => {
				core.logger.error('Failed to download image, err: ' + err)
			})
			bot.chat(img)
		})
	}
}

module.exports = Command
