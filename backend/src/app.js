const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const userRouter = require("../src/routes/user.route");
const candidateRouter = require("../src/routes/candidate.routes");
const companyRouter = require("./routes/company.routes");
const jobRouter = require("./routes/job.routes");
const savedRoute = require("./routes/save.routes");
const resumeRouter = require("./routes/resume.routes");
const atsRoutes = require("./routes/atsRoutes.js");
const jobMatchRoutes =require("./routes/jobMatchRoutes");

const morgan = require('morgan')
const app = express();
app.use(helmet());
app.use(morgan("dev"));
// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://jobprotal-frontend-tptp.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Other middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/user", userRouter);
app.use("/candidate", candidateRouter);
app.use("/company", companyRouter);
app.use("/job", jobRouter);
app.use("/saved", savedRoute);
app.use("/resume", resumeRouter);
app.use("/api/ats",atsRoutes);


// app.use("/api/ats",jobMatchRoutes);
// Error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    message: err || "Something went wrong",
  });
});

module.exports = app;