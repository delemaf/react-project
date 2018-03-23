import mongoose from '../database';

export const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  age: Number,
  description: String,
  image: String,
});

export default mongoose.model('User', userSchema);
