const userModel = require('../models/userModel');
const transactionModel = require('../models/transactionModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Razorpay = require("razorpay");


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
const loginUser = async (req,res) => {
    
   try {
       // 1. Get email and password
    const {email, password}  =  req.body;
    
        // 2. Find user by email
    const user = await userModel.findOne({email});

    if(!user){
        return res.json({
            success:false,
            message:"User does not exist"
        })
    }
   
    //compare password

    const isMatch = await bcrypt.compare(password,user.password);

      //agr nhi match hua toh
     if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid credentials"
            });
        }

       //agr match ho gya hai toh
        // 4. Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET
        );


        // 5. Send response
        res.json({
            success: true,
            token
        });


   } catch (error) {

     console.log(error);
        res.json({
            success:false,
            message:error.message
        })
    
   }
}
const userCredits = async (req, res) => {
    try {

        const userId = req.userId;

        const user = await userModel.findOne({_id:userId})
        
        if(!user){
            return res.json({
                success:false,
                message:"User not found"
            });
        }

        res.json({
            success:true,
            credits:user.creditBalance,
            user:{name:user.name}
        })
        
    } catch (error) {

        console.log(error);
        res.json({
            success:false,
            message:error.message
        })
        
    }
}
const razorpayInstance = new Razorpay({

    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET,

});
const paymentRazorpay = async (req, res) => {
    try {

        const userId = req.userId;

        const { planId } = req.body;
        //find user
        const userData = await userModel.findById(userId);

        if(!userData || !planId){
            return res.json({
            success:false,
            message:"Missing Details"
            });
        }

        let credits, plan, amount

        switch (planId) {
            case 'Basic':
                plan='Basic'
                credits=100
                amount=10
                break;

            case 'Advanced':
                plan='Advanced'
                credits=500
                amount=50
                break;    
            case 'Business':
                plan='Business'
                credits=5000
                amount=250
                break;
        
            default:
                return res.json({
                    success:false,
                    message:"Plan not Found"
                });
        }
      const  date = Date.now();

        const transactionData = {
            userId,plan,amount,credits,date,
        }

        const newTransaction = await transactionModel.create(transactionData);
            
        const options ={
            amount:amount * 100,
            currency:process.env.CURRENCY,
            receipt: newTransaction._id,
        }

      const order =  await razorpayInstance.orders.create(options);
            
            res.json({
                success:true,order
            })   
        
        
    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:error.message
        })
    }
}
const verifyRazorpay = async (req,res) => {
    try {
        const {razorpay_order_id}= req.body;

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
        if(orderInfo.status === 'paid'){
            const transactionData = await transactionModel.findById(orderInfo.receipt);
             // Already paid?
            if(transactionData.payments){
                return res.json({
                    success:false,
                    message:"Payment Failed"
                });
            }
            const userData = await userModel.findById(transactionData.userId);
             // Add credits
            const creditBalance = userData.creditBalance+ transactionData.credits;

            await userModel.findByIdAndUpdate(userData._id,{creditBalance});

            //make payment update
            await transactionModel.findByIdAndUpdate(transactionData._id,{payments:true});

            res.json({
                success:true,
                message:"Credit Added"
            })
        }else{
              res.json({
                success:false,
                message:"Payment Failed"
            })
        }

        
    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:error.message
        })
    }
}

module.exports={
    registerUser,loginUser,userCredits,paymentRazorpay,verifyRazorpay,
}
