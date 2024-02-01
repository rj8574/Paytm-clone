const express = require("express");

const cors=require('cors')

const rootRouter=require("./routes/index")

const app = express();
const Port=3000;

app.use(cors())
app.use(express.json())

app.use("/api/v1",rootRouter)


app.listen(Port,(req,res)=>{
   console.log(`App is running on Port :${Port}`)
})

