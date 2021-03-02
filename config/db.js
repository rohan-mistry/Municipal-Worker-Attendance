const mongoose = require('mongoose');
const { secrets } = require('./secrets');

const db = `mongodb+srv://${secrets.db.username}:${secrets.db.password}@${secrets.db.url}.mongodb.net/${secrets.db.name}?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log('Mongodb Connected ....');
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;