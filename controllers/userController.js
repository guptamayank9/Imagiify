const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    try {
        // 1. Frontend se data lo
        const {name, email, password} = req.body;
        

        // 2. Check karo email already registered hai ya nahi
        const existingUser = await userModel.findOne({email})
      
       if(existingUser){
        return res.json({
             success: false,
            message: "User already exists"
        });
       }
         // 3. Password ko hash karo
       const hashedPassword = await bcrypt.hash(password,10);


      
        // 4. User ko database me save karo
       const user = await userModel.create({
        name,
        email,
        password:hashedPassword
       });

       //save the data


       const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
       
        // 6. Frontend ko response bhejo
       res.json({
        success:true,
        token,
        user:{name:user.name}
       })

        
    } catch (error) {
          // Agar koi error aa jaye
        console.log(error);
        res.json({
            success:false,
            message:error.message
        })
    }
}
