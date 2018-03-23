import mongoose from '../database';

export default mongoose.model('Message', {
  text: String,
  date: { type: Date, default: Date.now },
  user: Number
});
