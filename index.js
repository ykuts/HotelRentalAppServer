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
// const cookieParser = require("cookie-parser");

const port = process.env.PORT || 5000;
// const port = dotenv.env.PORT || 5000;

// connect to database
connectDB();

// setup middlewares

app.use(cors({
  origin: 'https://hotel-rental-app-admin-sk5u.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true, // Only if using cookies/auth
}));

app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://hotel-rental-app-admin-sk5u.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(204).send();
});

// app.use(cors({
//   origin: '*', // or replace with your frontend URL
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type, Authorization, Access-Control-Allow-Headers, Access-Control-Allow-Methods, method, X-Requested-With'],
//   exposedHeaders: ['Content-Range', 'X-Content-Range'],
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


// app.use(cookieParser());


// app.use(cors({
//   origin:'*',
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: [
//       'Content-Type',
//       'Authorization',
//       'Access-Control-Allow-Headers',
//       'Access-Control-Allow-Methods',
//       'method',
//       'X-Requested-With'
//   ],
//   exposedHeaders: ['Content-Range', 'X-Content-Range'],
//   credentials: true,
//   preflightContinue: false,
//   optionsSuccessStatus: 204
// }));


// setup routes
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);

// setup production
if (process.env.NODE_ENV === "production") {
  const publicpath = path.join(__dirname, ".", "build");
  const filePath = path.resolve(__dirname, ".", "build", "index.html");
  app.use(express.static(publicpath));
 


  app.get("*", (req, res) => {
    return res.sendFile(filePath);
  });
}

app.use(errorHandler);

app.listen(port, () => console.log(`listening on on port ${port}`));