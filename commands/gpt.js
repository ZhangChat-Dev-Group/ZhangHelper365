const fetch = require('node-fetch').default

class Command {
	constructor(core) {
		if (typeof core.config.gptID !== 'object') {
			core.config.gptID = {}
			core.configManager.save()
		}
	}
	get info() {
		return {
			name: 'gpt',
			developer: 'ZhangSoft',
			level: 1,
			explain: '使用 ChatGPT',
			usage: '^gpt 你的问题',
		}
	}
	async gpt(core, user, question) {
		if (typeof core.config.gptID[user.trip] !== 'object') {
			core.config.gptID[user.trip] = {
				id: `#/chat/${(Date.now() / 1000).toFixed()}`,
				// 还有其他的功能，未来再写
			}
			core.configManager.save()
		}

		let result
		
		try{
			result = await (await fetch('https://api.binjie.fun/api/generateStream/', {
				method: 'POST',
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.82',
					'Origin': 'https://c.binjie.fun',
					'Referer': 'https://c.binjie.fun/',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					network: true,
					prompt: question,
					stream: false,
					system: '',
					userId: core.config.gptID[user.trip].id,
					withoutContext: false,
				})
			})).text()
		} catch(e) {
			core.logger.error(`Failed to request ChatGPT: ${e}`)
			return false
		}

		return result

	}
	async run(core, bot, user, args, payload){
		if (!user.trip) return bot.chat(`我是不会为一个没有识别码的用户服务的`)
		if (args.length < 2) return bot.chat(`你想问什么？`)

		const question = args.slice(1).join(' ')
		const result = await this.gpt(core, user, question)

		if (result === false) {
			return bot.chat(`@${user.nick} 我出错了`)
		}
		
		bot.chat(`@${user.nick} ${result}`)
	}
}

module.exports = Command
