class Command {
	constructor(core) {}
	get info() {
		return {
			name: 'blog',
			developer: 'ZhangSoft',
			level: 1,
			explain: '从MrZhang365的博客上获取指定的文章',
			usage: '^blog ID',
		}
	}
	async run(core, bot, user, args, payload){
		if (args.length < 2) return bot.chat(`你想干嘛？`)
		const id = args[1]
		fetch('https://blog.mrzhang365.cf/api/article/get/?id=' + id).then(result => {
			result.json().then(data => {
				bot.chat(`# ${data.title}\n${data.content}`)
			})
			.catch(e => {
				bot.chat('JSON解析错误')
			})
		})
		.catch(e => {
			bot.chat('博客请求错误')
		})
	}
}

module.exports = Command
