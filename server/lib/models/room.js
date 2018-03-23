import mongoose from '../database';

export default mongoose.model('Room', {
  name: String,
  tags: Array,
  messages: Array,
  users: Array
});
