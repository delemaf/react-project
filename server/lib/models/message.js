import mongoose from '../database';
import { anonymeSchema } from './anonyme';

export const messageSchema = new mongoose.Schema({
  text: String,
  date: { type: Date, default: Date.now },
  anonyme: anonymeSchema,
});

export default mongoose.model('Message', messageSchema);
