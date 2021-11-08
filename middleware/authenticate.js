const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = async(req,res,next) =>{
    try{
        // console.log("0");
        const token = req.cookies.jwtoken;
        if(!token){
            res.redirect('/home');
        }
        const verifyToken = jwt.verify(token,"THISISADVANCEURLSHORTNERINPROGRESS");
        const currUser = await User.findOne({_id:verifyToken._id,"tokens.token":token});
        if(!currUser){
            throw new Error("User Not Found");
        }
        res.locals.currUser = currUser;
        // req.token = token; 
        // req.currUser = currUser;
        // req.userId = currUser._id;
        next(); 
    }
    catch(err){
        console.log(err);
    }
};
module.exports = authenticate;