const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 80;
const mongoose = require('mongoose');
const bodyparser = require('body-parser')

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.MONGODB_URL ||'mongodb://localhost:27017/contactDance');
}

// Define mongoose schema

const contactSchema = new mongoose.Schema({
    name: String,
    phone: String,
    address: String,
    email: String,
    desc: String
});

const Contact = mongoose.model('Contact', contactSchema);

// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')) // For serving static files
app.use(express.urlencoded())

// PUG SPECIFIC STUFF
app.set('view engine', 'pug') // Set the template engine as pug
app.set('views', path.join(__dirname, 'views')) // Set the views directory

// ENDPOINTS
app.get('/', (req, res) => {
    res.status(200).render('home.pug')
})
app.get('/contact', (req, res) => {
    res.status(200).render('contact.pug')
})
app.post('/contact', (req, res) => {
    var myData = new Contact(req.body);
    myData.save().then(()=>{
        res.send("This item has been saved to the database")
    }).catch(()=>{
        res.status(400).send("Item was not saved to the database")
    })
    
})

// START THE SERVER
app.listen(port, () => {
    console.log(`The application started successfully on port ${port}`);
});
