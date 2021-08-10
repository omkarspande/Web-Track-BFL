var express=require('express')
var cors=require('cors')
var bodyparser=require('body-parser')
const { JsonWebTokenError } = require('jsonwebtoken')
var jwt=require('jsonwebtoken')
var app=express()
var mongoclient = require('mongodb').MongoClient
var url = "mongodb://127.0.0.1:27017/"
var database = "sampledb"

app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())

order_list=[]
function main(o) {
    mongoclient.connect(url, function (err, db) {
        var dbo = db.db(database)
       
        var order_set = {name:o.name,price:o.price}
        dbo.collection('shoppingcart').insertOne(order_set,function(err,res){
            console.log("user added")
        })
        dbo.collection('shoppingcart').find({}).toArray(function (err, data) {
            console.log(data)
        })
        

    })
}
// app.get("/list",(req,res){
    
// })

app.post("/cart",(req,res)=>{
    var order = req.body
    console.log(order)
    res.send({'name':order.name,'price':order.price})
    main(order)
})

app.listen(3002,()=>{
    console.log("server started")
})


