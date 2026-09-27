const jwt = require('jsonwebtoken');
//Request controller tak pahunchne se pehle jo function
//  beech me check karta hai, woh middleware hai.

// GET /api/user/credits
//         ↓
//       auth.js
//         ↓
// JWT check
//         ↓
// userId nikalo
//         ↓
// userCredits controller
const userAuth = async (req, res , next) => {
   
    const {token} = req.headers;

    if(!token){
        return res.json({
         success:false,
         message:"Not Authorized Login Again",
        });
    }


    try {

        // Verify token

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
         
        // Add user id to request
        if(tokenDecode.id){
            req.userId = tokenDecode.id;

        }else{
        return res.json({
         success:false,
         message:"Not Authorized. Login Again",
        });

        }
        next();

        
    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:error.message
        })
    }
    
}
module.exports={
    userAuth,
}