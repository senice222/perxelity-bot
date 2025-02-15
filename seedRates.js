import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Rate from './schemas/Rate.model.js';

dotenv.config();

const rates = [
  {
    name: 'Free',
    AIModel: 'Стандартная',
    reasoningMode: 'Недоступен',
    requestsPerDay: 5,
    price: 0
  },
  {
    name: 'Basic',
    AIModel: 'Стандартная',
    reasoningMode: 'Недоступен',
    requestsPerDay: 25,
    price: 208
  },
  {
    name: 'Pro',
    AIModel: 'Продвинутая',
    reasoningMode: 'Доступен',
    requestsPerDay: -1, // -1 для безлимитных запросов
    price: 374
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    await Rate.deleteMany();
    await Rate.insertMany(rates);
    console.log('Тарифы успешно засидены!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Ошибка при сидировании:', error);
    mongoose.connection.close();
  }
};

seedDB();
