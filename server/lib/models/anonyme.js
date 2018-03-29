import SillyName from 'sillyname';
import { userSchema } from './user';
import mongoose from '../database';

export const anonymeSchema = new mongoose.Schema({
  user: userSchema,
  admin: { type: Boolean, default: false },
  name: { type: String, default: SillyName() },
  spoiled: { type: Boolean, default: false },
  arrived_at: { type: Date, default: Date.now },
});

export default mongoose.model('Anonyme', anonymeSchema);
