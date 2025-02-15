import { Telegraf, Scenes, session } from 'telegraf'
import dotenv from 'dotenv'
import is_user_blocked from './bot/middleware/is_user_blocked.js';
// import is_registered from './bot/middleware/is_registered.js';
import startCommand from './bot/commands/start.js';
import onTextRequest from './bot/callbacks/on_text.js';

dotenv.config();

const initBot = (app) => {
  const bot = new Telegraf(process.env.TOKEN);

  bot.use(session())

  const Stage = new Scenes.Stage([
    // ApplyApplication,
    // ApplyExistingApplication
  ])

  // middlewares
  bot.use(Stage.middleware())
  // is_registered(bot)
  is_user_blocked(bot)
  startCommand(bot)
  onTextRequest(bot)
  bot.launch().then(() => {
    console.log('Bot is running');
  }).catch(err => {
    console.error('Failed to launch bot:', err);
  });
}

export default initBot
