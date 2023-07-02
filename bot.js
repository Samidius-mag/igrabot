const TelegramBot = require('node-telegram-bot-api');
const token = '6313272133:AAFrgEoF308LVQVuLNbsT0q_FL4HuEbRFT4'; // замените на свой токен
const bot = new TelegramBot(token, {polling: true});

const channelID = '-1001752956803'; // замените на ID вашего канала
const agents = [];
const group = [];

// Функция для отправки сообщений в ваш канал
function sendToChannel(text) {
  bot.sendMessage(channelID, text);
}

// Функция для рандомного распределения ролей между пользователями
function distributeRoles() {
  const players = bot.getChatMembersCount(channelID);
  const numAgents = Math.floor(players / 2);
  const numGroup = players - numAgents;

  // Заполняем массив агентов
  for (let i = 0; i < numAgents; i++) {
    agents.push(i);
  }

  // Заполняем массив группы
  for (let i = numAgents; i < players; i++) {
    group.push(i);
  }

  // Перемешиваем массивы
  agents.sort(() => Math.random() - 0.4);
  group.sort(() => Math.random() - 0.5);

  // Рассылаем роли пользователям в личном сообщении
  for (let i = 0; i < agents.length; i++) {
    bot.sendMessage(agents[i], `Вы - Секретный агент. Ваш номер: ${agents[i]}`);
  }

  for (let i = 0; i < group.length; i++) {
    bot.sendMessage(group[i], `Вы - Член группы. Ваш номер: ${group[i]}`);
  }
}

// Функция для обработки сообщений от игроков
bot.onText(/(.+)/, (msg, match) => {
  const playerId = msg.from.id;
  const text = match[1];

  // Проверяем, является ли игрок агентом или членом группы
  if (agents.includes(playerId)) {
    // Логика агента
    // ...
    sendToChannel(`Агент ${playerId} говорит: ${text}`);
  } else if (group.includes(playerId)) {
    // Логика группы
    // ...
    sendToChannel(`Член группы ${playerId} говорит: ${text}`);
  }
});

// Функция начала игры
function startGame() {
  distributeRoles();
  sendToChannel('Игра началась! Удачи, игроки!');
}

// Установка команды для начала игры
bot.onText(/\/startgame/, (msg) => {
  const chatId = msg.chat.id;

  // Проверка, что команда отправлена из вашего канала
  if (chatId == channelID) {
    startGame();
  }
});

// Запуск бота
bot.on('polling_error', (error) => {
  console.log(error); // Логирование ошибок
});
