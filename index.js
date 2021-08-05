const express = require('express')
const app = express();
const {MongoClient}  = require('mongodb');
const port = process.env.PORT || 4400;
const cors = require('cors')
const ObjectID = require('mongodb').ObjectId;
require('dotenv').config();

app.use(express.json());
app.use(cors()); 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qkzne.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION1}`);
    const bookingService = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION2}`);

    app.get('/', (req, res) => {
        res.send('Hello World!')
        console.log("database connected!");
    }) 
    app.post('/addService', (req, res) => {
        const data = req.body;
        collection.insertOne(data)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    }) 

    app.post('/bookingService', (req, res) => {
        const data = req.body;
        console.log(data)
        bookingService.insertOne(data)
            .then(result => {
                res.send(result.insertedCount > 0)
            }) 
    }) 

    app.get('/allService', (req, res) => {
        collection.find({})
        .toArray((err, data) => {
            res.send(data)
        })
    })

    app.get('/myOrderService/:email', (req, res) => {
        console.log(req.params)
        bookingService.find({userEmail: req.params.email})
        .toArray((err, data) => {
            res.send(data)
        })
    }) 
    app.get('/allOrderService', (req, res) => {
        bookingService.find({})
        .toArray((err, data) => {
            res.send(data)
        })
    }) 

    app.get('/updateOrderStatus', (req, res) => {
        bookingService.find({})
        .toArray((err, data) => {
            res.send(data)
        })
    }) 

    app.patch('/updateOrderStatus', (req, res) => {
        const { id, status } = req.body; 
        bookingService.findOneAndUpdate(
            { _id: ObjectID(id) },
            {
                $set: { status },
            }
        ).then(result => res.send(result.lastErrorObject.updatedExisting))
    })

    app.delete('/deleteService/:id', (req, res) => {
        collection.deleteOne({ _id: ObjectID(req.params.id) })
            .then(result => res.send(!!result.deletedCount))
    })
});




app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})