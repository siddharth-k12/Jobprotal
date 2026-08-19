const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// Routers
const userRouter = require("../src/routes/user.route");
const candidateRouter = require("../src/routes/candidate.routes");
const companyRouter = require("./routes/company.routes");
const jobRouter = require("./routes/job.routes");
const applicationRouter = require("./routes/application.routes");
const savedRoute = require("./routes/save.routes");

// -------------------------
// CORS
// -------------------------

const allowedOrigins = [
  "http://localhost:5173",
  "https://jobprotal-frontend-tptp.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin header
      // (Postman, server-to-server requests, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Explicit preflight handling
app.options("*", cors());

// -------------------------
// Middlewares
// -------------------------

app.use(express.json());
app.use(cookieParser());

// -------------------------
// Routes
// -------------------------

app.use("/user", userRouter);
app.use("/candidate", candidateRouter);
app.use("/company", companyRouter);
app.use("/job", jobRouter);
app.use("/application", applicationRouter);
app.use("/saved", savedRoute);

// -------------------------
// Global error handler
// -------------------------

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    message: err.message || "Something went wrong",
  });
});

module.exports = app;