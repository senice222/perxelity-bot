import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true
    },
    username: {
      type: String,
      required: true
    },
    registered: {
      type: Date,
      default: Date.now
    },
    rate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rate',
      required: true
    },
    remainingTrialRequests: {
      type: Number,
      default: 5
    }
  }
);

UserSchema.methods.checkTrialStatus = async function () {
  if (this.remainingTrialRequests > 0) {
    await mongoose.model('User').updateOne(
      { id: this.id },
      { $inc: { remainingTrialRequests: -1 } }
    );
  }

  const updatedUser = await mongoose.model('User').findOne({ id: this.id });

  if (updatedUser.remainingTrialRequests === 0) {
    const freeRate = await mongoose.model('Rate').findOne({ name: 'Free' });
    updatedUser.rate = freeRate._id;
    await updatedUser.save();
  }
};

export default mongoose.model('User', UserSchema);
