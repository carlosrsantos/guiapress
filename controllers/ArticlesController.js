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
        slug: slugify(title),
        body,
        categoryId: category
    }).then(()=>{
        res.redirect("/admin/articles")
    })
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

module.exports = router;