const Room = require("../models/roomModel");

const getRooms = async (req, res, next) => {
    try{
const rooms = await Room.find();

if(!rooms){
  res.status(400);
  throw new Error("No rooms found");
}
return res.status(200).json(rooms);
    } catch (error) {
      next(error);
}
};

// create room
const createRoom = async (req, res, next) => {
    try {
      

        console.log("Room created, data received:", req.body);
        if (!req.body.name || !req.body.price || !req.body.desc) {
      console.log("Required fields are missing");
      return res.status(400).json({ message: "Not all required fields are filled in" });
    }
        if (!req.user || !req.user.isAdmin) {
      console.log("User is not authorized or not an admin");
      return res.status(403).json({ message: "Insufficient rights" });
    }
        
  // todo validate data from  user with joi
      const room = await Room.create(req.body);

        
      if (!room) {
          console.log("Problem creating room");
        res.status(400);
        throw new Error("there was a problem creating");
      }
      const rooms = await Room.find();
      return res.status(201).json(rooms);
    } catch (error) {
      next(error);
    }
  };

  // get single room
const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
  
    if (!room) {
      res.status(400);
      throw new Error("Room not found");
    }
    return res.status(200).json(room);
  } catch (error) {
    next(error);
  }
};

// update rooms
const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id,{
      $set: req.body
    },
    {new: true}
  );
  
    if (!updatedRoom) {
      res.status(400);
      throw new Error("cannot update room");
    }
    return res.status(200).json(updatedRoom);
  
  } catch (error) {
    next(error);
  }
};

const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      res.status(400);
      throw new Error("room not deleteed");
    }

    return res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};  

module.exports = {
getRooms,
createRoom,
getRoom,
updateRoom,
 deleteRoom,
};
