const municipal = require('../models/municipal');
const User = require('../models/User');
/**
 * ======= Script for creating new Municipal acc for the root admin =======
 * fill the updated information in details.json as as json object
 */
const detail = require('./detail.json');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

db();

const createMuniciapl = async() => {
  try {
    const { name, city, username, password,email } = detail;
    console.log(username);
    let user = await User.findOne({ username });

    if (user) {
      throw new Error('message: User already exists');
    }
    user = new User({
      username,
      password,
      role:'admin',
      email
    })

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    let municipal_acc = await municipal.findOne({name,city});

    if (municipal_acc) {
      throw new Error('Municipal with this name and city exists');
    }
    municipal_acc = new municipal({
      _id:user._id,
      name,
      city
    })
    municipal_acc.save();

    console.log('New Municipal Created Successfully');
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
}

createMuniciapl();