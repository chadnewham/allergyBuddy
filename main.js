require('dotenv').config();

const express =     require('express');
const bodyParser =  require('body-parser');
const ejs =         require('ejs');
const mongoose =    require('mongoose');
const path =        require('path');
const fetch =       require('node-fetch');
const fakeData =    require('./fakeData');
const app =         express();

const menuItemSchema =  require('./schemas/menuItemSchema');
const ingredientSchema = require('./schemas/ingredientSchema');

app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

connectDB().catch(err => console.log(err));
async function connectDB() {
  await mongoose.connect('mongodb://127.0.0.1:27017/menuTest?compressors=none');
};

const MenuItem = new mongoose.model('Menu', menuItemSchema);
const Ingredient = new mongoose.model('Ingredients', ingredientSchema);

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
    Ingredient.find({})
    .then(ingredients=>{
        res.render(__dirname + '/views/upload.ejs', {ingredients: ingredients});
    }).catch(err=>{
        res.status(500).send(err);
    });
});

app.post('/upload/addIngredient', (req, res)=>{	
    console.log(req.body)
	Ingredient.create(req.body)
    .then(result=>{
        console.log(result)
    })
    res.json('Ingredient Added')
});
app.post('/upload/newGroup', (req, res)=>{	
    console.log(req.body)
	// Ingredient.create(req.body)
    // .then(result=>{
    //     console.log(result)
    // })
    res.json('Group Added')
});
app.get('/upload/getIngredients', (req, res)=>{
    Ingredient.find({})
    .then(docs=>{
        res.json(docs);
    }).catch(err=>{
        res.status(500).send(err);
    })
});


// =====================================================
app.post('/upload/addFakeIngredients', (req, res)=>{	
    console.log(req.body)
    
    Ingredient.insertMany(fakeData.getRandomData(20))
        .then(docs=>{
            console.log('Docs Created!')
            res.send('Docs Created')
        }).catch(err=>{
            res.status(500).send(err)
        })

});

app.get('/listIngredients', async (req, res)=>{	
    try{
        const result = await Ingredient.find({})    
        res.send(result)
    }catch(err){
        console.log(err)
        res.redirect('/');

    }
});
app.get('/dropIngredients', async (req, res)=>{
    try{
        await Ingredient.deleteMany();
        console.log('All ingredients deleted...');
        res.send('success!');
    }catch(err){
        console.log(err)
        res.status(500).send(err)
    }
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
// =====================================================

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