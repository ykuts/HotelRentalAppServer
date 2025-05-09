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

// Set port to match Railway's expectation
const port = process.env.PORT || 8085;

// Connect to database
connectDB();

// CORS Configuration
const allowedOrigins = [
  'https://nabya-hotel-admin.netlify.app',
  'https://nabya-hotel-client.netlify.app'
  'http://localhost:3000',
  'http://localhost:3001' 
];

// Set up CORS middleware
const corsOptions = {
  origin: function(origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS: ', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Explicitly handle OPTIONS requests
app.options('*', (req, res) => {
  res.status(204).end();
});

// Basic health check endpoint for Railway
app.get("/health", (req, res) => {
  res.status(200).send("Server is running");
});

// Root endpoint for Railway's health checks
app.get("/", (req, res) => {
  res.status(200).send("Hotel Rental API Server");
});

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);

// Production setup
if (process.env.NODE_ENV === "production") {
  const publicPath = path.join(__dirname, "build");
  app.use(express.static(publicPath));
  
  // For all non-API routes, serve the React app
  app.get("*", (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api/') || req.path === '/' || req.path === '/health') {
      return next();
    }
    res.sendFile(path.join(publicPath, "index.html"));
  });
}

// Error handler
app.use(errorHandler);

// Start server
app.listen(port, () => console.log(`Server listening on port ${port}`));
