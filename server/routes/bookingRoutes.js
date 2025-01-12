const { Router } = require("express");
const {getBookings, createBooking, updateBooking, deleteBooking, getBooking
} = require("../controllers/bookingController");
const { auth } = require("../middleware/authMiddleware");

const router = Router();

router.get("/",auth, getBookings);
router.get("/:id", getBooking);
router.post("/", createBooking);
router.put("/:id",auth, updateBooking);
router.delete("/:id",auth, deleteBooking);

module.exports = router;
