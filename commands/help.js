class Command{
	constructor(core) {}
	get info() {
		return {
			name: 'help',
			developer: 'ZhangSoft',
			level: 1,
			explain: '查看帮助',
			usage: '^help 命令名（可选）',
		}
	}
	run(core, bot, user, args, payload){
		const cmd = args[1]
		var reply = ''
		if (!cmd) {
			reply += '# 所有命令\n'
			reply += '|等级：|命令：|\n'
			reply += '|---:|:---|\n'
			reply += `|用户：|${core.commands.commands.filter(c => c.info.level === 1).map(c => c.info.name).join(', ')}|\n`
			reply += `|协管：|${core.commands.commands.filter(c => c.info.level === 2).map(c => c.info.name).join(', ')}|\n`
			reply += `|管理员：|${core.commands.commands.filter(c => c.info.level === 3).map(c => c.info.name).join(', ')}|\n`
			reply += `|超级管理员：|${core.commands.commands.filter(c => c.info.level === 4).map(c => c.info.name).join(', ')}|\n`
			reply += '---\n'
			reply += '要获取指定命令的帮助信息，请使用：\n'
			reply += '`^help 命令名`'
		}else {
			const command = core.commands.getCommand(cmd)
			if (!command) return bot.chat(`抱歉，我找不到 ${cmd} 命令的帮助`)
			reply += `${cmd} 命令：\n`
			reply += `| | |\n`
			reply += `|---:|:---|\n`
			reply += `|名称：|${command.info.name}|\n`
			reply += `|开发者：|${command.info.developer}|\n`
			reply += `|权限：|${command.info.level}|\n`
			reply += `|说明：|${command.info.explain}|\n`
			reply += `|用法：|${command.info.usage}|\n`
		}
		bot.whisper(user.nick, reply)
	}
}

module.exports = Command
