require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const path = require('path');
const fetch = require('node-fetch');

const app = express();

app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

connectDB().catch(err => console.log(err));
async function connectDB() {
  await mongoose.connect('mongodb://127.0.0.1:27017/menuTest?compressors=none');
};

const menuItemSchema = new mongoose.Schema({
    name: String,
    ingredientString: String,
    gluten: Boolean,
    allergy: [String]
});
const MenuItem = new mongoose.model('Menu', menuItemSchema);

const port = 3000;

app.get('/', (req, res)=>{	
    MenuItem.find({})
    .then(result=>{
        res.render(__dirname + '/views/index.ejs', {menuItems: result});
    });
});
app.get('/edit', (req, res)=>{	
    MenuItem.find({})
    .then(result=>{
        res.render(__dirname + '/views/indexEdit.ejs', {menuItems: result});
    });
});
app.get('/delete/:id', (req, res)=>{
    MenuItem.findByIdAndRemove(req.params.id).exec()
    console.log(req.params.id, 'has been reoved...')
    res.redirect('/edit')
});
app.get('/search', (req, res)=>{	
    res.render(__dirname + '/views/searchAPI.ejs')
});

app.get('/upload', (req, res)=>{	
    res.render(__dirname + '/views/upload.ejs');
});
app.post('/upload', (req, res)=>{	
	MenuItem.create(req.body)
    .then(result=>{
        console.log(result)
    })
    res.redirect('/upload');
});

app.get('/listAll', async (req, res)=>{	
    try{
        const result = await MenuItem.find({})    
        res.send(result)
    }catch(err){
        console.log(err)
        res.redirect('/');

    }
});
app.get('/usdaFetch', (req, res)=>{
   
    let searchParams = `?api_key=${process.env.USDA_LABEL_API_KEY}&query=${req.query.search}`
    
    fetch('https://api.nal.usda.gov/fdc/v1/foods/search'+ searchParams)
    .then(response => response.json())
    .then(data =>{
        res.send(data)
    }).catch(err=>{
        console.log(err)
    });
});
app.listen(port, ()=>{
    console.log(`app listening on ${port}`);
});