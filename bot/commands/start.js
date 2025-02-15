import dotenv from 'dotenv';
import UserModel from '../../schemas/User.model.js';
import RateModel from '../../schemas/Rate.model.js';

dotenv.config();

const startCommand = (bot) => {
  bot.command("start", async (ctx) => {
    const userId = ctx.from.id;
    const proRate = await RateModel.findOne({ name: 'Pro' });
    const username = ctx.from.username ? ctx.from.username : ctx.from.first_name;

    try {
      let user = await UserModel.findOne({ id: userId });

      ctx.reply(`👋 Привет! Я Уми – твой умный помощник в Telegram!
Я помогаю быстро находить точные ответы на любые вопросы, подкрепляя их надёжными источниками. Со мной ты сэкономишь время на поиске и проверке информации.

Вот что я умею:
🏠 Найти рецепт или решить бытовой вопрос
📚 Помочь с учёбой или рабочим проектом
🔍 Проанализировать информацию из разных источников
📝 Объяснить сложные темы простым языком

Попробуй спросить меня:
- "Объясни теорию эволюции Дарвина простыми словами”
- "Как работают нейросети?"
- "Как убрать пятно с дивана?"
-”Реши квадратное уравнение 5x² - 3x - 2 = 0”
- "Спланируй поездку в Стамбул на 5 дней: бюджет, жильё, маршруты"

Для навигации по боту используй меню в левом нижнем углу. Задай свой вопрос прямо сейчас 👇`, {
        parse_mode: "HTML"
      });

      if (!user) {
        user = new UserModel({
          id: ctx.from.id,
          username,
          rate: proRate._id,
          registered: new Date(),
          remainingTrialRequests: 5
        });

        await user.save();
        ctx.reply(
          `🎁 Дарю тебе 5 бесплатных PRO-запросов, чтобы ты мог протестировать все мои возможности без ограничений!`
        );
      }
    } catch (error) {
      console.error("Ошибка при обработке команды /start:", error);
      return ctx.reply("⚠️ Произошла ошибка, попробуй еще раз позже.");
    }
  });
};

export default startCommand;
