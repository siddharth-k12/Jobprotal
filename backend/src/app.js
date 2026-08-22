const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");

const userRouter = require("./routes/user.route");
const candidateRouter = require("./routes/candidate.routes");
const companyRouter = require("./routes/company.routes");
const jobRouter = require("./routes/job.routes");
const savedRoute = require("./routes/save.routes");
const resumeRouter = require("./routes/resume.routes");
const atsRoutes = require("./routes/atsRoutes.js");

const app = express();


// =====================================================
// SECURITY / LOGGING
// =====================================================

app.use(helmet());
app.use(morgan("dev"));


// =====================================================
// CORS
// =====================================================

const allowedOrigins = [
    "http://localhost:5173",
    "https://jobprotal-frontend-tptp.onrender.com"
];

const corsOptions = {
    origin: function (origin, callback) {

        // Allow requests without Origin
        // such as Postman/server-to-server requests
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        console.log("Blocked CORS origin:", origin);

        return callback(
            new Error("Not allowed by CORS")
        );
    },

    credentials: true,

    methods: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS"
    ],

    allowedHeaders: [
        "Content-Type",
        "Authorization"
    ]
};


// CORS middleware
app.use(cors(corsOptions));


// Explicit preflight handling
app.options("*", cors(corsOptions));


// =====================================================
// BODY / COOKIE
// =====================================================

app.use(express.json());
app.use(cookieParser());


// =====================================================
// ROUTES
// =====================================================

app.use("/user", userRouter);

app.use(
    "/candidate",
    candidateRouter
);

app.use(
    "/company",
    companyRouter
);

app.use(
    "/job",
    jobRouter
);

app.use(
    "/saved",
    savedRoute
);

app.use(
    "/resume",
    resumeRouter
);

app.use(
    "/api/ats",
    atsRoutes
);


// =====================================================
// ERROR HANDLER
// =====================================================

app.use(
    (err, req, res, next) => {

        console.error(
            "SERVER ERROR:",
            err
        );

        res.status(
            err.status || 500
        ).json({
            message:
                err.message ||
                "Something went wrong"
        });
    }
);


module.exports = app;