const Booking = require("../models/bookingModel");

const getBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find().populate("roomId");
        if (bookings.length === 0) {
            // You might want to return a 200 with empty array instead of 400
            // since having no bookings isn't really an error condition
            return res.status(200).json([]);
        }
        return res.status(200).json(bookings);
    } catch (error) {
        next(error);
    }
};
// create new booking
const createBooking = async (req,res,next) => {
   try {
     const booking = await Booking.create(req.body);
     if (!booking){
        res.status(400)
        throw new Error("there was a problem creating booking");
     }

     return res.status(201).json(booking);
   }catch(error) {
    next(error);
}
};

const updateBooking = async (req, res, next) => {
    try {
      const updatedBooking = await Booking.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );
  
      if (!updatedBooking) {
        res.status(400);
        throw new Error("cannot create booking");
      }
      const bookings = await Booking.find();
      return res.status(200).json(bookings);
    } catch (error) {
      next(error);
    }
  };

  const deleteBooking = async (req, res, next) => {
    try {
      const room = await Booking.findByIdAndDelete(req.params.id);
      if (!room) {
        res.status(400);
        throw new Error("cannot delete room");
      }
      return res.status(200).json({ id: req.params.id });
    } catch (error) {
      next(error);
    }
  };

  // get single booking
const getBooking = async (req, res, next) => {
    try {
      const booking = await Booking.findById(req.params.id).populate("roomId");
      if (!booking) {
        res.status(400);
        throw new Error("booking not found");
      }
  
      return res.status(200).json(booking);
    } catch (error) {
      next(error);
    }
  };
  
  module.exports = {
    getBookings,
    createBooking,
    updateBooking,
    deleteBooking,
    getBooking,
  };
