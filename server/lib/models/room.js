import mongoose from '../database';
import { messageSchema } from './message';
import { anonymeSchema } from './anonyme';

export default mongoose.model('Room', {
  name: String,
  tags: Array,
  messages: [messageSchema],
  created_at: { type: Date, default: Date.now },
  anonynmes: [anonymeSchema],
  max_users: Number,
  description: String,
});
