const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const port = process.env.PORT || 4000;

// middleware
app.use(cors())
app.use(express.json())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wc0z7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();

        const database = client.db('Nima');
        const nimaCollection = database.collection('toys');
        const orderCollection = database.collection('orders');

        app.get('/toys', async (req, res) => {
            const cursor = nimaCollection.find({});
            const toys = await cursor.toArray();
            res.send(toys)
        })
        app.get('/all_orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders)
        })
        app.post('/toys', async (req, res) => {
            const toy = req.body;
            const result = await nimaCollection.insertOne(toy);
            res.json(result)
        })
        app.post('/all_orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result)
        })
        app.delete('/all_orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        })
    } finally {
        console.log('')
    }
}
run().catch(console.dir)
app.get('/', (req, res) => {
    res.send('hello')
})


app.listen(port, () => {
    console.log('connected')
})
