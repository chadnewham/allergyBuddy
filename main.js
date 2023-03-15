const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs')

connectDB().catch(err => console.log(err));
async function connectDB() {
  await mongoose.connect('mongodb://127.0.0.1:27017/ingredients?compressors=none');
}

const port = 3000;



app.get('/', (req, res)=>{	
    res.render(__dirname + '/views/index.ejs')
});

app.get('/upload', (req, res)=>{	
    res.render(__dirname + '/views/upload.ejs')
});

app.post('/upload', (req, res)=>{	
	console.log(req.body)
    res.redierct('/')
});





app.listen(port, ()=>{
    console.log(`app listening on ${port}`)
});