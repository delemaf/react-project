import mongoose from 'mongoose';

mongoose.connect(
  'mongodb://SirCornflakes:unicorn@ds129780.mlab.com:29780/anonymously',
);

export default mongoose;
