const express = require('express');
const app = express();
const cors = require('cors')
const cookieParser = require('cookie-parser')
//routers requrie
const userRouter = require('../src/routes/user.route');
const candidateRouter = require('../src/routes/candidate.routes')
const companyRouter = require('./routes/company.routes')
const jobRouter = require('./routes/job.routes')
const applicationRouter = require('./routes/application.routes')
const savedRoute = require('./routes/save.routes')

//middlewares
app.use(express.json());
app.use(cookieParser())

app.use(cors({
  origin: [
    "https://jobprotal-frontend-tptp.onrender.com";
  ],
  credentials: true
}));


//router handler
app.use('/user',userRouter);
app.use('/candidate',candidateRouter)
app.use('/company',companyRouter)
app.use('/job',jobRouter)
app.use('/application',applicationRouter)
app.use('/saved',savedRoute)

//global erro handle
app.use((err,req,res,next)=>{
    console.log(err);
    
    res.status(err.status || 500).json({
        message:err.message || "something went wrong"
    })
})

module.exports = app