const express = require('express');
const cors = require('cors');
require("dotenv").config();

const PORT = process.env.PORT || 4000
const connectDB = require("./config/mongodb");

const app = express();

app.use(express.json());
app.use(cors());
connectDB();


app.get('/',(req,res)=>{
    res.send("API working fine");
});

app.listen(PORT, () => {
  console.log("Server Running at PORT : " + PORT);
});