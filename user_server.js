var express = require('express')
var cors = require('cors')
var bodyparser = require('body-parser')
const { JsonWebTokenError } = require('jsonwebtoken')
var jwt = require('jsonwebtoken')
var app = express()
var mongoclient = require('mongodb').MongoClient
var url = "mongodb://127.0.0.1:27017/"
var database = "sampledb"

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

user_list = []
invalid_suer = [
    {
        username: "abc",
        password: "pass"
    }
]
function main(o) {
    mongoclient.connect(url, function (err, db) {
        var dbo = db.db(database)

        var user = { username: o.username, password: o.password, email: o.email, phone: o.phone, address: o.address }
        dbo.collection('registereduser').insertOne(user, function (err, res) {
            console.log("user added")
        })
        dbo.collection('registereduser').find({}).toArray(function (err, data) {
            console.log(data)
        })


    })
}
function get_token(username, password) {
    return jwt.sign({ 'username': username, 'password': password }, "123")

}
var token = ""//get_token()
//console.log(token)
function validate(t, pass) {
    return jwt.verify(t, pass)
}

// app.get("/",(req,res)=>{
// res.send(coffeelist)
// })
app.post("/login", (req, res) => {
    t = req.body.token
    res.send(validate(t, "123"))
})

app.post("/register", (req, res) => {
    var userinfo = req.body
    console.log(userinfo.username)
    console.log(userinfo.password)
    console.log(userinfo.email)
    console.log(userinfo.phone)
    console.log(userinfo.address)

    if(userinfo.username=="abc") {
        res.send("Invalid User")
        console.log("Invalid User")
    }
    else{
        user_list.push(userinfo)
        token = get_token(userinfo.username, userinfo.password)
        res.send({ 'token': token })
        main(userinfo)
        
    }

})
app.listen(3000, () => {
    console.log("server started")
})

