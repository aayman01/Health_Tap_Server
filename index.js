const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


// middlewars
app.use(cors())
app.use(express.json());

app.get('/',(req,res)=> {
    res.send("Health tap server is running...")
})

app.listen(port,()=>{
    console.log(`My port is running on ${port}`)
})