const jwt = require("jsonwebtoken");

module.exports = (req,res,next)=>{
    const key = req.headers.key;
    console.log(key);
    const user = jwt.verify(key,"booklist");
    if(user){
        console.log(user);
        req.user= user;
    }
    else{
        res.status(400).json({
            msg: "unautherize user"
        })
    }
    return next();
}