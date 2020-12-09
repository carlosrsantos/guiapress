const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Article = require('../models/Article');
const slugify = require('slugify')

router.get("/admin/categories/new", (req, res)=>{
    res.render('admin/categories/new');
});


//Insert Category
router.post("/categories/save", (req, res)=>{
    var title = req.body.title;
    if(title != undefined){

        Category.create({
            title,
            slug: slugify(title.toLowerCase()) 
        }).then(()=>{
            res.redirect("/admin/categories");
        });

    }else{
        res.redirect("/admin/categories/new");
    }
});

//Update Category
router.post("/categories/update", (req, res)=>{
    var id = req.body.id;
    var title = req.body.title;
    
    if(title != undefined){
        Category.update({title: title, slug: slugify(title.toLowerCase()) },{
            where: {
                id: id
            }
        }).then(()=>{
            res.redirect("/admin/categories");
        });
    }
});

//List All Categories
router.get("/admin/categories", (req, res) =>{

    Category.findAll().then(categories => {
        res.render("admin/categories/index", {categories: categories});
    });
});

//Delete Category
router.post("/categories/delete", (req, res)=>{
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
          /*   Article.destroy({
                where: {
                    categoryId: id
                }
            });       */      


            Category.destroy({
                where: {
                    id: id
                }
            }).then(()=>{
                res.redirect("/admin/categories");
            })
        }else{ //not number
            res.redirect("/admin/categories");
        }
    }else{ //NULL
        res.redirect("/admin/categories");
    }
});

//Edit Category
router.get("/admin/categories/edit/:id",(req, res)=>{
    var id = req.params.id;
    
    if(isNaN(id)){
        res.redirect("/admin/categories");
    }

    Category.findByPk(id).then(category => {
        if(category != undefined){

            res.render("admin/categories/edit", {category: category});

        }else{
            res.redirect("/admin/categories");
        }
    }).catch(erro => {
        res.redirect("/admin/categories");
    })

});

module.exports = router;