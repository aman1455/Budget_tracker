const transectionModel = require("../models/transectionModel");
const moment = require("moment");
const getAllTransection = async (req, res) => {
  try {
    const { frequency, selectedDate, type, userid } = req.body;

    

    if (!userid) {
      return res.status(400).json({ error: "User ID is required" });
    }

  
    const filter={
      userid: userid,
    }
    if (type !== "all") {
      filter.type = type;
    }
    console.log(filter);
    if(frequency==="custom") {
      filter.createdAt= {
        $gte: new Date(selectedDate[0]), 
        $lte: new Date(selectedDate[1]), 
      }
    }else if(frequency==="7"){
      filter.createdAt= {
        $gte: moment().subtract(7, 'days').toDate(),
      }
    } else if(frequency==="30"){
      filter.createdAt= {
        $gte: moment().subtract(30, 'days').toDate(),
      }
    } else if(frequency==="365"){
      filter.createdAt= {
        $gte: moment().subtract(365, 'days').toDate(),
      }
    }

    const transactions = await transectionModel.find(filter);
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteTransection = async (req, res) => {
  try {
    await transectionModel.findOneAndDelete({ _id: req.body.transacationId });
    res.status(200).send("Transaction Deleted!");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const editTransection = async (req, res) => {
  try {
    await transectionModel.findOneAndUpdate(
      { _id: req.body.transacationId },
      req.body.payload
    );
    res.status(200).send("Edit SUccessfully");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const addTransection = async (req, res) => {
  try {
    // const newTransection = new transectionModel(req.body);
    const newTransection = new transectionModel(req.body);
    await newTransection.save();
    res.status(201).send("Transection Created");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  getAllTransection,
  addTransection,
  editTransection,
  deleteTransection,
};
