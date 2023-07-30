const WebSocket = require('ws')
const events = require('events')

class WebSocketPlus extends WebSocket {
	constructor(url) {
		super(url)
	}

	json(data) {
		this.send(JSON.stringify(data))
	}

	chat(text) {
		this.json({
			cmd: 'chat',
			text,
		})
	}

	whisper(nick, text) {
		this.json({
			cmd: 'whisper', nick, text
		})
	}

	join(nick, channel) {
		this.json({
			cmd: 'join',
			nick, channel
		})
	}
}

class Command extends events.EventEmitter {
	constructor(core) {
		super()
		setTimeout(() => {
			if (core.ws) {
				clearInterval(core.ws.pingTask)
				core.ws.removeAllListeners()
				core.ws.terminate()
			}
			core.ws = new WebSocketPlus('wss://hack.chat/chat-ws')
			core.ws.pingTask = setInterval(() => {
				if (core.ws.readyState !== 1) return
				core.ws.ping()
				core.ws.json({
					cmd: 'ping'
				})
			}, 30000)
			core.ws.users = []
			core.ws.on('open', () => {
				core.ws.join(Math.random().toString(36).substr(2, 8), 'lobby')
			})
			
			core.ws.on('error', () => {
				clearInterval(core.ws.pingTask)
				core.logger.error(`Failed to join ?lobby`)
				core.ws.ready = false
				core.client.chat(`无法加入 ?lobby ，请联系超级管理员执行 ^reload 来重新连接`)
			})
			core.ws.on('close', () => {
				clearInterval(core.ws.pingTask)
				core.logger.error(`Connection to ?lobby disconnected`)
				core.ws.ready = false
				core.client.chat(`与 ?lobby 的连接被中断，请联系超级管理员执行 ^reload 来重新连接`)
			})
			core.ws.on('message', (data) => {
				const payload = JSON.parse(data)
				const cmd = payload.cmd

				if (payload.channel !== 'lobby' && payload.channel !== false) {
					core.logger.error(`Bot in ?lobby was kicked to ?${payload.channel}`)
					core.ws.ready = false
					core.client.chat(`在 ?lobby 里面的Bot被踢到了 ?${payload.channel} ，请联系超级管理员执行 ^reload 来重新连接`)
				}

				if (cmd === 'info') {
					core.logger.info(`info from ?lobby: ${payload.text}`)
				}

				if (cmd === 'onlineSet') {
					core.logger.info(`Joined ?lobby`)
					core.ws.ready = true
					core.ws.users = payload.nicks
				} else if (cmd === 'info' && payload.type === 'whisper' && payload.from === 'ultra_weeb' && payload.trip === 'Rdais/') {
					core.ws.emit('img-res', payload.text.split('\n')[1])
				} else if (cmd === 'onlineAdd') {
					core.ws.users.push(payload.nick)
				} else if (cmd === 'onlineRemove') {
					core.ws.users = core.ws.users.filter(n => n !== payload.nick)
				} else if (cmd === 'warn') {
					core.logger.warn(`?lobby WARNING: ${payload.text}`)
				}
			})
		}, 5000)
	}
	get info() {
		return {
			name: 'lobby',
			developer: 'ZhangSoft',
			level: 4,
			explain: '加入 ?lobby 以调用 ultra_weeb#Rdais/ 机器人',
			usage: '无需手动调用',
		}
	}
	run(core, bot, user, args, payload){}
}

module.exports = Command
