import UserModel from "../../schemas/User.model.js";
import generateResponse from "../utils/generateRequest.js";

const cleanHtmlTags = (text) => {
  return text.replace(/<\/?think>/g, ""); // Удаляем <think> и </think>
};

const onTextRequest = (bot) => {
  bot.on("text", async (ctx) => {
    const userQuestion = ctx.message.text;
    const user = await UserModel.findOne({ id: ctx.from.id });

    const message = await ctx.reply(`🔍 Ищу информацию по запросу: "${userQuestion}"...`);

    setTimeout(() => {
      ctx.telegram.editMessageText(ctx.chat.id, message.message_id, null,
        `🌐 <b>Продвинутый поиск</b>\n\n🎯 Запрос: "${userQuestion}"\n🔍 Анализирую источники...`,
        { parse_mode: "HTML" }
      );
    }, 2000);

    try {
      const { answer, reasoningSteps, citations } = await generateResponse(userQuestion);

      let responseText = `📌 <b>Ответ:</b>\n\n${cleanHtmlTags(answer)}`;

      if (reasoningSteps.length > 0) {
        responseText += "\n\n🧠 <b>Шаги рассуждения:</b>\n";
        reasoningSteps.forEach((step, index) => {
          responseText += `🔹 ${index + 1}. ${step}\n`;
        });
      }

      if (citations.length > 0) {
        responseText += "\n\n📚 <b>Источники:</b>\n";
        citations.forEach((source, index) => {
          responseText += `🔗 <a href="${source}">${index + 1}. Источник</a>\n`;
        });
      }

      await ctx.telegram.editMessageText(ctx.chat.id, message.message_id, null, responseText, {
        parse_mode: "HTML",
        disable_web_page_preview: true
      });

      await user.checkTrialStatus();
    } catch (error) {
      console.error("Ошибка в обработке запроса:", error);
      ctx.reply("❌ Произошла ошибка при поиске ответа. Попробуйте позже.");
    }
  });
};


export default onTextRequest;
