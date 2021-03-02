const User = require("../models/User");

exports.updateDetail = async(req,res) => {
  try {
    const { _id } = req.params;
    const { username,email } = req.body;
    const data = await User.findByIdAndUpdate(_id,{username,email});
    if(!data) {
      return res.status(404).json({
        message:"User Not found"
      })
    }
    return res.status(200).json({
      message:'OK'
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Server Error'
    })
  }
}

exports.getDetail = async(req,res) => {
  try {
    const { _id } = req.params;
    const data = await User.findById(_id).select('username email');
    if(!data) {
      return res.status(404).json({
        message:"User Not found"
      })
    }
    return res.status(200).json({
      user:data
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Server Error'
    })
  }
}

exports.isAccBlocked = async(req,res) => {
  try {
    const { _id } = req.params;
    const data = await User.findById(_id);
    if(data && data.blocked) {
      return res.status(404).json({
        message:'Your account has been blocked'
      })
    }
    return res.status(200).json({
      message:'OK'
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Server Error'
    })
  }
}