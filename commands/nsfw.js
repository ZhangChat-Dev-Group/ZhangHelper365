class Command{
	constructor(core) {
		this.core = core
		if (!Array.isArray(core.config.nsfw)) {
			core.config.nsfw = []
			core.configManager.save()
		}
	}
	get info() {
		return {
			name: 'nsfw',
			developer: 'ZhangSoft',
			level: 2,
			explain: '定义或取消定义一个标签是否为nsfw，bot不允许生成包含nsfw标签的图片。不传递参数则显示nsfw标签列表',
			usage: '^nsfw 标签',
		}
	}
	run(core, bot, user, args, payload){
		if (!args[1]) {
			return bot.chat('nsfw列表：'+core.config.nsfw.join(' '))
		}
		const tag = args.slice(1).join(' ').toLowerCase().replaceAll(',', ' ').replace(/ {2,}/g, ' ').trim()
		if (core.config.nsfw.includes(tag)) {
			core.config.nsfw = core.config.nsfw.filter((t) => t !== tag)
			core.configManager.save()
			return bot.chat('已取消定义nsfw标签：' + tag)
		}
		core.config.nsfw.push(tag)
		core.configManager.save()
		bot.chat('已定义nsfw标签：' + tag)
	}
}

module.exports = Command
