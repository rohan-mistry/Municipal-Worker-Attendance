const User = require('../models/User')
const bcrypt = require('bcryptjs')
const sendMail = require('../middleware/nodemailer')
const { validationResult } = require('express-validator')
const { promisify } = require('util')
const { secrets } = require('../config/secrets')
const randomBytesAsync = promisify(require("crypto").randomBytes)

//to verify the correctness of token 
exports.verifyToken = async (req, res) => {
  try {
    const { token, id } = req.params;   
    let user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        message: 'Invalid request or link expired'
      });
    }
    let tokenValidity = await bcrypt.compare(token, user.reset.tokenHash);
    if (!tokenValidity || user.reset.expiration < Date.now()) {
      return res.status(400).json({
        message: 'Invalid request or link expired',
      });
    }
    
    return res.status(200).json({   //This should indicate fron end to render the resetPassword page
      message: 'Valid token'
    });
      
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error')
  }
}

//to reset the password (triggered when Confirm Password is clicked)
exports.resetPassword = async (req, res) => {
  try {
    //check if token is still valid (because user might have stayed idle on the rendered page)
    const { token, id } = req.params;   
    let user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        message: 'Invalid request or link expired'
      });
    }
    
    let tokenValidity = await bcrypt.compare(token, user.reset.tokenHash);
    if (!tokenValidity || user.reset.expiration < Date.now()) {
      return res.status(400).json({
        message: 'Invalid request or link expired'
      });
    }

    let { password } = req.body;    //new password to be set
    const salt = await bcrypt.genSalt(10);  
    password = await bcrypt.hash(password, salt);

    await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          'password': password,
          'reset.expiration': Date.now()  //this will make the emailed url valid only once
        }
      },
      {new: true}
    );
    
    //now mail the user that pw was changed
    let subject = '[Municipal Corporation] Your password was reset';
    const supportUrl = 'xyz.com'; //help support url
    const supportEmail = 'xyz@mail.com'
    let body = `Hey ${user.username},\n\n
    This is to inform you that your account's password was successfully changed.\n\n\n
    If you did not perform this action, please mail us at ${supportEmail}.\n\n
    For further assistance, visit ${supportUrl}\n
    Thank you, \n
    Team Municipal Corporation`;

    const mailInfo = {
      password: secrets.email.password,
      senderEmail: secrets.email.id,
      to: user.email,
      subject,
      body
    }

    let resp = await sendMail(mailInfo);
    console.log(resp.response);
    res.status(200).json({
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error')
  }
}

//to generate token string for reset password
exports.sendResetMail = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).send({
      errors: errors.array()
    })
  }
  const { email } = req.body;
  const expirationTime = 1; //in hours
  function getToken (size) {          //size is the number of bytes
    return randomBytesAsync(size);
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: 'User does not exist'
      })
    }

    let tokenString = await getToken(20);   
    tokenString = tokenString.toString('hex');  //converting bytes to string (unhashed)
    const salt = await bcrypt.genSalt(10);
    const tokenHash = await bcrypt.hash(tokenString, salt);
    const expiration = Date.now() + expirationTime*3600000; //expTime in hours
    const resetDetails = {
        tokenHash: tokenHash,
        expiration: expiration,
    }
    await User.findByIdAndUpdate(
        user._id, {$set: {reset: resetDetails}}, {new: true});
    // hash and expiration set successfully, now mail the user unhashed tokenString url

    let subject = '[Municipal Corporation] Password Reset Instructions';
    const host = 'localhost:3000';
    const url = req.protocol + '://' + host + '/password/reset/' + user._id + '/' + tokenString;    //forget password url
    // url host name is hard coded because: https://portswigger.net/web-security/host-header/exploiting/password-reset-poisoning
    
    let body = `Hey ${user.username},\n\n
  Did you forget your password?\n\n
  Click on the following link to reset your password:\n\n
  ${url} \n\n
  This link will expire in ${expirationTime} hour(s) and can be used only once.\n\n
  Do not share this link with anyone.\n\n
  If you don't want to change your password or didn't request this, please ignore and delete this message.\n\n\n
  Thank you,\n
  Team Municipal Corporation`;

    const mailInfo = {
      password: secrets.email.password,
      senderEmail: secrets.email.id,
      to: email,
      subject,
      body
    }
    
    let resp = await sendMail(mailInfo);
    console.log(resp.response);
    res.status(200).json({
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message:'Server Error'
    })
  }
}