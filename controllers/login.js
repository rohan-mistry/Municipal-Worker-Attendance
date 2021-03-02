const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.SignIn = async(req,res) => {
  try {
    const {username, password} = req.body;
    const user = await User.findOne({username});
    if(!user) {
      res.status(400).json({
        message:'Not Found'
      })
    }

    if (user.allowed === false) {
      return res.status(401).send({
        message: 'Error: Account not activated'
      })
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Incorrect password entered'
      })
    }

    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(payload, 'municipal', {
      expiresIn: '1y'
    }, (err, token) => {
      if (err) throw err;
      res.json({ token, _id:user._id, role:user.role })
    })

  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Server Error'
    })
  }
}