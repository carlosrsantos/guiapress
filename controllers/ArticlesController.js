const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Article = require('../models/Article');
const slugify = require('slugify');

router.get('/admin/articles', (req, res)=> {
    res.send("Rota de artigos");
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

module.exports = router;