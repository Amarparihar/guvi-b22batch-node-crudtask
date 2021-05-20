require("dotenv").config();
const express = require('express');
const mongodb = require('mongodb');

const port = process.env.PORT || 4010;
const app = express();

const mongoClient = mongodb.MongoClient;
const URL = process.env.dbURL || 'mongodb://localhost:27017';
console.log(URL)
const DB = 'productDB';
const objectId = mongodb.ObjectID;

app.use(express.json());

app.get("/", async(req,res)=>{
    try {
        let client = await mongoClient.connect(URL);
       
        let db = client.db(DB);
        let data = await db.collection('products').find().toArray();
        if(data){
            res.status(200).json(data);
        }else{
            res.status(404).json({message:'data not found'})
        }
        res.status(200).json({message:'data updated'})
        client.close();
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Internal Server Error'})
    }
})

app.post("/create", async(req,res)=>{
    try {
        let client  = await mongoClient.connect(URL);
        let db = client.db(DB);
        await db.collection('products').insertOne(req.body);
        res.status(200).json({message:'data added'})
        client.close();
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Internal Server Error'})
    }
})

app.put("/update/:id", async(req,res)=>{
    try {
        let client  = await mongoClient.connect(URL);
        let db = client.db(DB);
        await db.collection('products').findOneAndUpdate({_id: req.params.id}, {$set: req.body});
        res.status(200).json({message:'data updated'})
        client.close();
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Internal Server Error'})
    }
})

app.delete("/delete/:id", async (req,res)=>{
    try {
        let client = await mongoClient.connect(URL);
        let db = client.db(DB);
        await db.collection('products').deleteOne({_id:objectId(req.params.id)});
        res.status(200).json({message:'data deleted'});
        client.close();
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Internal Server Error'})
    }
})

app.listen(port,()=>console.log('app runs with port',+port))