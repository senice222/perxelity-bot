import RateModel from "../../schemas/Rate.model.js";
import UserModel from "../../schemas/User.model.js";

export default (bot) => {
  bot.use(async (ctx, next) => {
    if (ctx.from) {
      const user = await UserModel.findOne({ id: ctx.from.id });
      const proRate = await RateModel.findOne({ name: 'Pro' });
      const username = ctx.from.username ? ctx.from.username : ctx.from.first_name;

      if (!user) {
        const date = new Date()
        const doc = new UserModel({
          id: ctx.from.id,
          username,
          rate: proRate._id,
          registered: date,
          remainingTrialRequests: 5
        });
        await doc.save();
      }
    }
    next();
  });
};
