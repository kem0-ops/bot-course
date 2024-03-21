const TelegramApi = require('node-telegram-bot-api')

const { gameOptions, againOptions } = require('/options')

const token = '6955385468:AAH-1BHuM9j2OB2mVZk06ASkHsIMyaQkCM8'

const bot = new TelegramApi(token, { polling: true })

const chats = {}

const startGame = async chatId => {
	await bot.sendMessage(
		chatId,
		`сейчас я загадаю цифру от 0 до 9, ты должен ее угадать `
	)
	const randomNumber = Math.floor(Math.random() * 10)
	chats[chatId] = randomNumber
	await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
	bot.setMyCommands([
		{ command: '/start', description: 'Начальное приветствие' },
		{ command: '/info', description: 'Получить информацию о пользователе' },
		{ command: '/game', description: 'игра угадай цифру' },
	])

	bot.on('message', async msg => {
		const text = msg.text
		const chatId = msg.chat.id
		if (text === '/start') {
			await bot.sendSticker(
				chatId,
				'https://a127fb2c-de1c-4ae0-af0d-3808559ec217.selcdn.net/img/intro/cards/cloud-based@1x.19062f67.png'
			)
			return bot.sendMessage(chatId, `Добро пожаловать в тестовый бот`)
		}
		if (text === '/info') {
			return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`)
		}
		if (text === '/game') {
			return startGame(chatId)
		}
		return bot.sendMessage(chatId, 'я тебя не понимаю, попробуй еще раз!')
	})
	bot.on('callback_query', async msg => {
		const data = msg.data
		const chatId = msg.message.chat.id
		if (data === '/again') {
			return startGame(chatId)
		}
		if (data === chats[chatId]) {
			return bot.sendMessage(
				chatId,
				`поздравляем ты отгадал загаданную цифру ${chats[chatId]}`,
				againOptions
			)
		} else {
			return bot.sendMessage(
				chatId,
				`К сожелению ты не угадал, бот загадал цифру ${chats[chatId]}`,
				againOptions
			)
		}
	})
}

start()
