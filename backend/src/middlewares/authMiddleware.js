const jwt = require('jsonwebtoken')

async function authMiddleware(req,res,next){
    try {
        const token = req.cookies.token
    
    if(!token){
        return res.status(401).json({
            message:"token is missing"
        })
    }

    const decode = jwt.verify(token,process.env.JWT_SECRET);

    req.user = decode.id
    next();
    
    } catch (error) {
        res.status(400).json({
            message:"token is invalid"
        })
    }
}

module.exports = authMiddleware