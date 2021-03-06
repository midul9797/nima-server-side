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
        const reviewCollection = database.collection('reviews');
        const userCollection = database.collection('users');

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
        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews)
        })
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find({});
            const users = await cursor.toArray();
            res.send(users)
        })
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await userCollection.findOne(query);
            let isAdmin = false;
            if(user?.role === 'admin'){
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
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
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.json(result)
        })
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.json(result)
        })
        app.put('/users/admin', async (req, res ) => {
            const user = req.body;
            const filter = { email: user.email};
            const upadateDoc = {$set: {role : 'admin'}}
            const result = await userCollection.updateOne(filter, upadateDoc)
            res.json(result);
        })
        app.delete('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await nimaCollection.deleteOne(query);
            res.json(result);
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
