import mongoose from '../database';
import { messageSchema } from './message';
import { anonymeSchema } from './anonyme';

export default mongoose.model('Room', {
  name: String,
  tags: Array,
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now },
  anonymes: [anonymeSchema],
  maxUsers: Number,
  description: String,
});
