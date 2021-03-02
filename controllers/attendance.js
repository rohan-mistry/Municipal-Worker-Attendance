const attendance = require("../models/attendance");
const mongoose = require("mongoose");

exports.markAttendance = async(req,res) => {
  try {
    const { municipal, location, worker } = req.body; 
    console.log(req.body);
    const data = await attendance.find(
      {
        municipal,
        location,
        worker,
      }
    ).sort({createdAt:-1}).limit(1);

    console.log(data);
    if(data && data[0]) {
      console.log(data[0].createdAt);
      let present = new Date().toDateString();
      let found = new Date(data[0].createdAt * 1000).toDateString();
      console.log(present);
      console.log(found);
      if(present === found) {
        return res.status(409).json({
          message:"Already Marked for this location today"
        })
      }
    }
    await attendance.create(req.body);
    return res.status(200).json({
      message:"OK"
    })
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: 'Server Error'
    })
  }
}

exports.getWorkerAttendance = async(req,res) => {
  try {
    const { worker } = req.params;
    const { page,limit,search,start,end } = req.query;
    console.log('fome');
    console.log(req.query);
    const data = await attendance.aggregate([
      {
        $match: {
          worker:mongoose.Types.ObjectId(worker)
        }
      },
      {
        $lookup:
          {
            from: "locations",
            localField: "location",
            foreignField: "_id",
            as: "location_detail"
          }
      },
      { $sort : { createdAt : -1 } },
      { $match: {
          location_detail:{
            $elemMatch: {
              name:{
                $regex:search
              }
            }
          },
          createdAt: {
            $gte:new Date(Number(start)).setHours(0,0,0,0)/1000,
            $lte:new Date(Number(end)).setHours(23,59,59,999)/1000
          } 
        }
      },
      {
        $facet: {
          metadata: [
            { $count: "total" }
          ],
          attendance: [
            { $skip : Number(page) * Number(limit) },
            { $limit: Number(limit) }
          ]
        }
      }
      
    ])
    return res.status(200).json(data[0])

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: 'Server Error'
    })
  }
}

exports.municipalAttendanceList = async(req,res) => {
  try {
    const { municipal } = req.params;
    console.log(req.params);
    const { page,limit,search,start,end } = req.query;
    console.log('fome');
    console.log(req.query);
    const data = await attendance.aggregate([
      {
        $match: {
          municipal:mongoose.Types.ObjectId(municipal)
        }
      },
      {
        $lookup:
          {
            from: "locations",
            localField: "location",
            foreignField: "_id",
            as: "location_detail"
          }
      },
      {
        $lookup:
          {
            from: "workers",
            localField: "worker",
            foreignField: "_id",
            as: "worker_detail"
          }
      },
      { $sort : { createdAt : -1 } },
      { $match: {
          $or:[
            {
              location_detail:{
                $elemMatch: {
                  name:{
                    $regex:search
                  }
                }
              }
            },
            {
              worker_detail:{
                $elemMatch: {
                  name:{
                    $regex:search
                  }
                }
              }
            }
          ],
          createdAt: {
            $gte:new Date(Number(start)).setHours(0,0,0,0)/1000,
            $lte:new Date(Number(end)).setHours(23,59,59,999)/1000
          } 
        }
      },
      {
        $facet: {
          metadata: [
            { $count: "total" }
          ],
          attendance: [
            { $skip : Number(page) * Number(limit) },
            { $limit: Number(limit) },
            { $project : {
                lat : 1 ,
                long : 1,
                createdAt:1,
                "location_detail.name":1,
                "worker_detail.name":1,
              } 
            }
          ]
        }
      }
      
    ])
    return res.status(200).json(data[0])
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: 'Server Error'
    })
  }
}