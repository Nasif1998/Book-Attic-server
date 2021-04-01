const express = require('express')
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const app = express()
const ObjectID = require('mongodb').ObjectID;
const port = process.env.PORT || 6066;
console.log(process.env.DB_USER);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tzaf0.mongodb.net/bookShop?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const bookCollection = client.db("bookShop").collection("events");
    // perform actions on the collection object
    console.log('db connected');
    //   client.close();
    

    app.get('/books', (req, res) => {
        bookCollection.find()
        .toArray((err, items) => {
            res.send(items)
        })
    })

    app.get('/checkout/:_id', (req, res) => {
        bookCollection.find({_id: ObjectID(req.params._id)})
        .toArray((err, documents) => {
            res.send(documents[0])
        })
    })

    app.delete('/deleteEvent/:id', (req, res) => {
        bookCollection.deleteOne({ _id: ObjectID(req.params.id) })
          .then(result => {
            res.send({ count: result.deletedCount > 0 });
            // res.redirect('/')
          })
    
        //  const id = ObjectID(req.params.id);
        //  eventCollection.findOneAndDelete({_id: id})
        //  .then(documents => res.send(!!documents.value))
      })

    app.post('/addBook', (req, res) => {
        const newBook = req.body;
        console.log(newBook);
        bookCollection.insertOne(newBook)
        .then(result => {
            console.log(result.insertedCount);
            res.send(result.insertedCount > 0)
        })
    })
});

// client.connect(err => {
//     const orderCollection = client.db("bookShop").collection("orders");
//     console.log('db connected');

//     app.post('/addOrder', (req, res) => {
//         const newOrdering = req.body;
//         console.log(newOrdering);
//     })
// });


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})