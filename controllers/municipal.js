const locations = require("../models/locations");
const Municipal = require("../models/municipal");
const User = require("../models/User");
const worker = require("../models/worker");
const mongoose = require("mongoose");

exports.addLocation = async(req,res) => {
  try {
    const { name,street,landmark,size,pincode,municipal} = req.body;
    let municipal_acc = await Municipal.findById(municipal);

    if(!municipal_acc) {
      return res.status(400).json({
        message: 'Municipal does not exist'
      })
    }
    const loc = await locations.findOne({
      name,
      street,
      landmark,
      size,
      pincode,
      municipal:municipal_acc._id
    });
    if(loc) {
      return res.status(400).json({
        message: 'City with this details already exists'
      })
    }
    await locations.create(req.body);
    return res.status(200).json({
      message:"success",
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Server Error'
    })
  }
}

exports.allMunicipals = async(req,res) => {
  try {
    const allMunicipals = await Municipal.find({}).select('name');
    return res.json({
      allMunicipals
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Server Error'
    })
  }
}

exports.getLocations = async(req,res) => {
  try {
    const { _id } = req.params;
    console.log(req.params);
    const locs = await locations.find({municipal:_id});
    console.log(locs);
    return res.status(200).json({
      locations:locs
    })

  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Server Error'
    })
  }
}

exports.updateLocation = async(req,res) => {
  try {
    const { _id } = req.params;
    const loc = await locations.findByIdAndUpdate(_id,req.body);
    if(!loc) {
      return res.status(400).json({
        message:"Location not found"
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

exports.getOneLocation = async(req,res) => {
  try {
    const { _id } = req.params;
    const loc = await locations.findById(_id);
    if(!loc) {
      return res.status(404).json({
        message:"Location not found"
      })
    }
    return res.status(200).json({
      location:loc
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Server Error'
    })
  }
}

exports.pendingRequests = async(req,res) => {
  try {
    const { _id } = req.params;
    const pending = await worker.find({municipal:_id,authenticated:false}).sort({_id:-1});
    console.log(pending);
    return res.status(200).json({
      pending
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Server Error'
    })
  }
}

exports.requestStatus = async(req,res) => {
  try {
    const { authenticated,municipal,_id } = req.body;
    const mun = await worker.findOne({_id,municipal});
    if(!mun) {
      res.status(403).json({
        message: 'Forbidden'
      })
    }
    if(authenticated) {
      await worker.findByIdAndUpdate(_id,{authenticated});
      await User.findByIdAndUpdate(_id,{allowed: true});
    } else {
      await worker.deleteOne({_id});
      await User.deleteOne({_id});
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

exports.getAllotment = async(req,res) => {
  try {
    const { _id } = req.params;
    console.log(_id);
    const data = await worker.aggregate([
      { $match : { 
          _id:mongoose.Types.ObjectId(_id)
        }
      },
      {
        $lookup:
          {
            from: "locations",
            localField: "allotment",
            foreignField: "_id",
            as: "list_locations"
          }
      }
    ]);
    console.log(data);
    return res.status(200).json({
      locs:data
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Server Error'
    })
  }
}

exports.newAllotment = async(req,res) => {
  try {
    const {municipal,_id,location} = req.body;
    const check = await worker.findOne({
      _id,
      municipal,
      allotment:{$elemMatch:{$eq:location}}
    })
    console.log(check);
    if(check) {
      return res.status(400).json({
        message:"This location is already alloted to this worker"
      })
    }

    const newallot = await worker.findOneAndUpdate(
      {_id,municipal},
      {$push:{allotment:location}}
    )
    res.status(200).json({
      message: 'OK'
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Server Error'
    })
  }
}

exports.removeAllotment = async(req,res) => {
  try {
    const { _id,municipal,location } = req.body;
    const data = await worker.findOneAndUpdate(
      {_id,municipal},
      {$pull:{allotment:location}}
    )
    return res.status(200).json({
      message: 'OK'
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Server Error'
    })
  }
}