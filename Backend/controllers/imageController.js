const axios = require("axios");

const userModel = require('../models/userModel');
const FormData =require('form-data');

const generateImage = async (req, res) => {

    try {
         // Get userId and prompt
        const {prompt} = req.body;
          const userId = req.userId;
        // Find user
        const user = await userModel.findOne({_id:userId});
        
      // Check details
        if(!user|| !prompt){
            return res.json({
                success:false,
                message:"Missing Details"
            });
        }
  // Check credits
        //if user is avabialbe then check userbalance f userbalcne is less 
        // than zero or not  have then not genrate the image
        if(user.creditBalance === 0  || user.creditBalance <= 0){
            return res.json({
                success:false,
                message:"No Credit Balance",
                creditBalance:user.creditBalance
            })
        }

        //if balance is greater then zero then do
        //from clipdrop
        //create multipart form-data
       // Create form data
      const formData = new FormData()
      formData.append('prompt',prompt);
      // Send request to ClipDrop

    const {data} =  await axios.post('https://clipdrop-api.co/text-to-image/v1',formData,{
        headers: {
         'x-api-key': process.env.CLIPDROP_API,
        },
        responseType : 'arraybuffer'
      })
           // Convert image buffer to Base64
      const base64Image = Buffer.from(data, 'binary').toString('base64');
       // Create image data URL
      const resultImage = `data:image/png;base64,${base64Image}`
       // Deduct one credit
      await userModel.findByIdAndUpdate(user._id,{creditBalance:user.creditBalance-1})
      // Send response
      res.json({
        success:true,
        message:"Image Generated",
        creditBalance:user.creditBalance-1,
        resultImage
      })

        
    }catch (error) {
          console.log(error);
        res.json({
            success:false,
            message:error.message
        })
    }
}
module.exports={
    generateImage,
}