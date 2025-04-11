require("dotenv").config();
const express = require("express");
const cors = require('cors');
const { errorHandler } = require("./middleware/errorHandler");
const path = require("path");
const app = express();
const connectDB = require("./config/db");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const userRoutes = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");

const port = process.env.PORT || 5000;
// const port = dotenv.env.PORT || 5000;

// connect to database
connectDB();

// setup middlewares
app.use(cookieParser());
// app.use(cors({
//   origin: [
//     "https://tourmaline-pixie-dbc701.netlify.app",
//     "https://spiffy-torte-57b54c.netlify.app"
//   ],
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true,
// }));

// app.use(cors({
//   origin: [
//     "https://tourmaline-pixie-dbc701.netlify.app",
//     "https://spiffy-torte-57b54c.netlify.app"
//   ],
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   // allowedHeaders: [
//   //   'Content-Type',
//   //         'Authorization',
//   //         'Access-Control-Allow-Headers',
//   //         'Access-Control-Allow-Methods',
//   //         'method',
//   //         'X-Requested-With'
//   // ],
//   // exposedHeaders: ['Content-Range', 'X-Content-Range'],
//   credentials: true,
//   // preflightContinue: false,
//   // optionsSuccessStatus: 204
// }));


app.use(cors({
  origin:'*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Methods',
      'method',
      'X-Requested-With'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: false,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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