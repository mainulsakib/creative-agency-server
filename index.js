const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const port = 5000
require('dotenv').config()
const app = express()


app.use(cors())
app.use(bodyParser.json())
app.use( bodyParser.urlencoded({ extended: false }))
const uri = `mongodb+srv://mainulIslam:Sakib3619@cluster0.l9cv1.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
 

const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true});
client.connect(err => {
     console.log(err)
  const courseCollection = client.db("creativeAgency").collection("course");
  const commentCollection=client.db("creativeAgency").collection("comment");
  const adminCollection=client.db("creativeAgency").collection("admin"); 
  app.post('/addCourse',(req, res)=>{
    const course= req.body;
    console.log(course)
 courseCollection.insertOne(course)
    .then(result =>{
        res.send('success')
    })
})
app.get('/courses',(req, res)=>{
    // console.log(req.query.email)
    courseCollection.find({email: req.query.email})
    .toArray((err,documents)=>{
        res.send(documents)
    })
})
app.get('/allCourses',(req, res)=>{
    courseCollection.find({})
    .toArray((err,documents)=>{
        res.send(documents)
    })
})

app.post('/addComment', (req, res) => {
     const review =req.body.review
    const name = req.body.name;
    const email = req.body.email;
    console.log(name, email,review)

    commentCollection.insertOne({ name, email, review})
        .then(result => {
            res.send(result.insertedCount > 0);
        })
})
app.get('/comments', (req, res) => {
  commentCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
});

app.post('/addAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.insertOne({ email})
    .then(result => {
        res.send(result.insertedCount > 0);
    })
})
app.get('/admin', (req, res) => {
   
    adminCollection.find({email: req.query.email})
        .toArray((err, admin) => {
            res.send(admin);
        })
});


});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT ||port)