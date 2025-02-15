import mongoose from 'mongoose';

const RateSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['Free', 'Basic', 'Pro'],
        required: true
    },
    AIModel: {
        type: String,
        default: "Стандартная"
    },
    reasoningMode: {
        type: String,
        default: "Недоступен"
    },
    requestsPerDay: {
        type: Number,
        default: 5
    },
    price: {
        type: Number,
        default: 0
    }
});

export default mongoose.model('Rate', RateSchema);
