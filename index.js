require("dotenv").config();
const express = require("express");
const cors = require('cors');
const app = express();
const { errorHandler } = require("./middleware/errorHandler");
const path = require("path");
const connectDB = require("./config/db");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const userRoutes = require("./routes/userRoutes");
const port = process.env.PORT || 5000;
// Connect to database
connectDB();
// CORS Configuration
const allowedOrigins = [
  'https://hotel-rental-app-admin-sk5u.vercel.app',
  'http://localhost:3000' // For local development
];
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  optionsSuccessStatus: 200
};
// Apply CORS middleware
app.use(cors(corsOptions));
// Other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);
// Production setup
if (process.env.NODE_ENV === "production") {
  const publicpath = path.join(__dirname, ".", "build");
  const filePath = path.resolve(__dirname, ".", "build", "index.html");
  app.use(express.static(publicpath));
  app.get("*", (req, res) => {
    return res.sendFile(filePath);
  });
}
// Error handler
app.use(errorHandler);
// Start server
app.listen(port, () => console.log(`Server listening on port ${port}`));
