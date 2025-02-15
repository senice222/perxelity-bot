import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions";
const API_KEY = process.env.PERPLEXITY_API_KEY; // Убедитесь, что API-ключ есть в .env

const generateResponse = async (message) => {
  try {
    const response = await axios.post(
      PERPLEXITY_API_URL,
      {
        model: "sonar-reasoning-pro", // Используем продвинутую модель
        messages: [{ role: "user", content: message }],
        temperature: 0.7, // Регулирует степень креативности
        search_depth: "advanced", // Улучшенный поиск
        reasoning: "enabled" // Включаем объяснение шагов рассуждения
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    if (!data.choices || data.choices.length === 0) {
      throw new Error("API вернул пустой ответ.");
    }

    const answer = data.choices[0].message.content || "⚠️ Ответ не найден.";
    const reasoningSteps = data.choices[0].message.reasoning_steps || [];
    const citations = data.citations || [];
    console.log("data", response.data)
    console.log("choices", response.data.choices)
    return { answer, reasoningSteps, citations };
  } catch (error) {
    console.error("Ошибка запроса к Perplexity AI:", error.response?.data || error.message);
    return { answer: "⚠️ Ошибка генерации ответа. Попробуйте позже.", reasoningSteps: [], citations: [] };
  }
};

export default generateResponse;
