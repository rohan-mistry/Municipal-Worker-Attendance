const User = require("../models/User");
const worker = require("../models/worker");

exports.getWorkers = async(req,res) => {
  try {
    const { _id } = req.params;
    console.log(req.params);
    const workers = await worker.find({municipal:_id,authenticated:true});
    console.log(workers);
    return res.status(200).json({
      workers
    })

  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Server Error'
    })
  }
}

exports.updatePhone = async(req,res) => {
  try {
    const { _id } = req.params;
    const { phone } = req.body;
    const data = await worker.findByIdAndUpdate(_id,{phone});
    if(!data) {
      return res.status(400).json({
        message:"Worker not found"
      })
    }
    return res.status(200).json({
      message:"OK"
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Server Error'
    })
  }
}

exports.getPhone = async(req,res) => {
  try {
    const { _id } = req.params;
    const data = await worker.findById(_id).select('phone');
    if(!data) {
      return res.status(404).json({
        message:"Worker not found"
      })
    }
    return res.status(200).json({
      worker:data
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Server Error'
    })
  }
}

exports.removeWorker = async(req,res) => {
  try {
    const { _id,municipal } = req.body;
    const data = await worker.findOne({_id,municipal});
    if(!data) {
      return res.status(404).json({
        message:"Worker not found for this municipal"
      })
    }
    await User.findByIdAndUpdate(_id,{
      blocked:true
    });
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