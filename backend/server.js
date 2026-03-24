const express=require("express")

const app=express()

const PORT=5002

app.get("/",(req,res)=>{
    res.send("server of smartshop ai")
})


app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`)
})