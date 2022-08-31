const express = require('express')
const {  ObjectId } = require('mongodb')
const app = express()
var MongoClient = require('mongodb').MongoClient

app.set('view engine', 'hbs')
app.use(express.urlencoded({extended:true}))

var url = 'mongodb+srv://nguyen128:shinobi123@cluster0.6jzaakt.mongodb.net/test'


app.get('/',async (req,res) => {
    let client= await MongoClient.connect(url);
    let dbo = client.db("Toys");
    let prods = await dbo.collection("product").find().toArray()

    res.render('home',{'toys': prods})
})

app.get('/new',(req,res) => {
    res.render('newProduct')
})

app.get('/update',async (req,res)=>{
    let id = req.query.id
    let objectId = ObjectId(id)
    let client= await MongoClient.connect(url);
    let dbo = client.db("Toys");
    let prod = await dbo.collection("product").findOne({_id:objectId})
    console.log(prod)
    res.render('updateProduct',{'toy':prod})
})

app.get('/delete',async (req,res)=>{
    let id = req.query.id
    console.log(id)
    let objectId = ObjectId(id)
    let client= await MongoClient.connect(url);
    let dbo = client.db("Toys");

    await dbo.collection("product").deleteOne({_id:objectId})
    res.redirect('/')
})

app.post('/doUpdate',async (req,res)=>{
    let id = req.body.id
    let objectId = ObjectId(id)
    const name = req.body.txtName
    const price = Number(req.body.txtPrice)
    const picURL = req.body.txtPic
    let product = {
        'name': name,
        'price': price,
        'picture': picURL
    }
    let client= await MongoClient.connect(url);
    let dbo = client.db("Toys");
    await dbo.collection("product").updateOne({_id:objectId},{$set : product})
    res.redirect('/')
})

app.post('/newProduct', async (req,res) => {
    const name = req.body.txtName
    const price = Number(req.body.txtPrice)
    const picURL = req.body.txtPic

    let product = {
        'name': name,
        'price': price,
        'picture': picURL
    }


    let client= await MongoClient.connect(url);
    let dbo = client.db("Toys");
    await dbo.collection("product").insertOne(product)
    res.redirect('/')
})

app.post("/search", async (req, res) => {
    let name = req.body.txtSearch
    let client= await MongoClient.connect(url);
    let dbo = client.db("Toys");

    let toys = await dbo.collection("product").
            find({'name':new RegExp(name, 'i')}).toArray()
    console.log(prods)
    res.render('home',{'toys': toys})
});

const PORT = process.env.PORT|| 5000

app.listen(PORT)
console.log("Server is running!")
