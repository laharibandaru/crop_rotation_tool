require('dotenv').config();
const express = require('express');
const cors = require('cors')
const {MongoClient} = require('mongodb')

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"; // <- make this the cloud connection link
const dbName = "proposedRotationsDB"; // <- make this your db name
let db;

MongoClient.connect(uri)
  .then(client => { 
    db = client.db(dbName);
    console.log('MongoDB connection successful.');
  })
  .catch(err => {
    console.error('MongoDB connection failed: ', err);
  });

app.post('/add', (req, res) => {
  const proposedRot = req.body;
  const collection = db.collection('proposedRotations'); // <- make this your collection name

  collection.insertOne(proposedRot)
    .then(result => {
      res.status(201).send(`Proposed Rotation added: ${result.insertedId}`);
    })
    .catch(err => {
      res.status(500).send("An error occurred");
    });
});

const port = process.env.PORT || 5000; 
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`); // <- make this the web location
});