const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const session = require('express-session')

//importa os controllers
const categoriesController = require('./controllers/CategoriesController');
const articlesController = require('./controllers/ArticlesController');
const usersController = require('./controllers/UsersController');

//importa as models
const Article = require('./models/Article');
const Category = require('./models/Category');
const User = require('./models/User');

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

//Sessions
app.use(session({
    secret: "something", cookie: { maxAge: 30000}
}));

//Static
app.use(express.static('public'));

//Usando body-parser para converter dados de requisição de formulário para JSON
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); //leia dados de formulário enviados via JSON

//Rotas
app.use('/', categoriesController); // /prefixo
app.use('/', articlesController);
app.use('/', usersController);

app.get('/', (req, res)=>{
    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render('index', { articles, categories });
        });
    });
});

app.get('/:slug',(req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: { 
            slug
         }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
            res.render('article', { article, categories });
        });
        }else{  
            res.redirect("/");
        }
    }).catch( err => {
        res.redirect("/");
    });
});


app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug
        }, 
         include:[{ model: Article }]
    }).then( category => {
        if(category != undefined){

            Category.findAll().then(categories => {
                res.render("index", { articles: category.articles, categories: categories })
            });

        }else{
            res.redirect("/");
        }
    }).catch( err => {
        res.redirect("/");
    })
})


//porta do Servidor.
app.listen(3333);