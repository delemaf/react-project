import mongoose from '../database';

export default mongoose.model('User', {
  email: String,
  password: String,
  name: String,
  age: Number,
  description: String,
  image: String
});
