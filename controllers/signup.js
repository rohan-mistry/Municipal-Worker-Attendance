const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Municipal = require("../models/municipal");
const Worker = require("../models/worker");

exports.MunicipalWorker = async(req,res) => {
  try {
    const { name, username, password, municipal_id, phone,email } = req.body;
    let municipal_acc = await Municipal.findById(municipal_id);
    if(!municipal_acc) {
      return res.status(400).json({
        message: 'Municipal does not exist'
      })
    }
    let user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({
        message: 'Please try with a different username'
      })
    }
    user = new User({
      username,
      password,
      email,
      role:'worker'
    })
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    
    let worker = await new Worker({
      _id:user._id,
      name,
      phone,
      municipal:municipal_id
    })
    worker.save();

    return res.status(200).json({
      message:'success'
    })

  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Server Error'
    })
  }
}