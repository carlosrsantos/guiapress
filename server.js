const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');

const categoriesController = require('./controllers/CategoriesController');
const articlesController = require('./controllers/ArticlesController');
//Database
connection
    .authenticate()
    .then(() => {
        
    })
    .catch((msgErro)=>{
        console.log(msgErro);
    });

//Usando EJS como view engine para html
app.set('view engine','ejs');
app.use(express.static('public'));

//Usando body-parser para converter dados de requisição de formulário para JSON
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); //leia dados de formulário enviados via JSON

//Rotas
app.use('/', categoriesController); // /prefixo
app.use('/', articlesController);

app.get('/', (req, res)=>{
    res.render('index');
});

//porta do Servidor
app.listen(3333);