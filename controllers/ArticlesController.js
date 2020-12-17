const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Article = require('../models/Article');
const slugify = require('slugify');

router.get('/admin/articles', (req, res)=> {
    Article.findAll({
        include: [{ model: Category }]
    }).then(articles => {
            res.render("admin/articles/index",{ articles: articles });
    });
});

router.get('/admin/articles/new', (req, res)=>{
    Category.findAll().then(categories => {
        res.render('admin/articles/new', {categories});
    });
    
});

router.post('/articles/save', (req, res)=>{
    var title  = req.body.title;
    var body = req.body.body;
    var category  = req.body.category;

    Article.create({
        title,
        slug: slugify(title.toLowerCase()),
        body,
        categoryId: category
    }).then(()=>{
        res.redirect("/admin/articles")
    })
});

//Edit Category
router.get("/admin/articles/edit/:id",(req, res)=>{
    var id = req.params.id;
    
    if(isNaN(id)){
        res.redirect("/admin/articles");
    }

    Article.findByPk(id).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("admin/articles/edit", {article, categories});
            });           

        }else{
            res.redirect("/admin/articles");
        }
    }).catch(erro => {
        res.redirect("/admin/articles");
    })

});

router.post("/articles/update", (req, res)=>{
    var id = req.body.id;    
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;
    
    if(title != undefined){
        Article.update({
            title: title,slug: slugify(title.toLowerCase()),body: body,categoryId: category},
            {
                where: {
                    id: id
                }
            }
        ).then(()=>{
            res.redirect("/admin/articles");
        }).catch(err => {
            res.redirect("/");
        });
    }
});

router.post("/articles/delete", (req, res)=>{
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){

            Article.destroy({
                where: {
                    id: id
                }
            }).then(()=>{
                res.redirect("/admin/articles");
            });
        }else{ //not number
            res.redirect("/admin/articles");
        }
    }else{ //NULL
        res.redirect("/admin/articles");
    }
});

router.get("/articles/page/:num", (req, res)=>{
    var page = req.params.num;
    var offset = 0;

    if(isNaN(page) || page == 1) {
        offset = 0;
    } else{
        offset = 4 * (parseInt(page)-1);
    }

    Article.findAndCountAll({
        limit: 4,
        offset: offset,
        order:[
            ['id','DESC']
        ]
    }).then(articles => {
        var next;
        if(offset + 4  >= articles.count){
            next = false;
        }else{
            next = true;
        }

        var result = {
            page: parseInt(page),
            next:next,
            articles:articles
        }
        Category.findAll().then(categories => {
            res.render("admin/articles/page",{result, categories});
        });
     //   res.json(articles);
    });   
});

module.exports = router;