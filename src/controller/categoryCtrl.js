const {v4} = require('uuid')
const path = require('path')
const fs = require('fs')
const Category = require('../model/categoryModel')

const uploadDir = path.join(__dirname, "../files")

const categoryCtrl = {
  addCategory: async (req, res) => {
    const {title} = req.body
    try {
      if(req.files && title) {
        const oldCategory = await Category.findOne({title})

        if(oldCategory) {
          return res.status(400).send({message: "This category is already exists"})
        }

        const image = req.files.image
        const imgName = v4() + "." + image.mimetype.split("/")[1]
        image.mv(path.join(uploadDir, imgName), err => {
          if(err){
            res.status(400).send({message: err.message})
          }
        })

        const category = new Category({title, image: imgName})

        await category.save()

        res.status(201).send({message: "Category created!", category})

      } else {
       res.status(403).send("Please fill all fields!") 
      }
    } catch (error) {
      res.status(500).send({message: error.message})
    }
  },

  getCategories: async (req, res) => {
    try {
      const categories = await Category.find()
      res.status(200).send({message: "All categories", categories})
    } catch (error) {
      res.status(500).send({message: error.message})
    }
  },

  deleteCategory: async (req, res) => {
    const {categoryId} = req.params
    try {
      const category = await Category.findByIdAndDelete(categoryId)
      if(category) {
        // delete all books
        fs.unlink(path.join(uploadDir, category.image), err => {
          console.log(err);
        })
        return res.status(200).send({message: "Category deleted!"})
      } else {
        res.status(404).send({message: "Category not found!"})
      }

    } catch (error) {
      res.status(500).send({message: error.message})
    }
  },

  updateCategory: async (req, res) => {
    const {categoryId} = req.params
    const {title, isActive} = req.body

    console.log(title, isActive);
    // const image = req.files.image
    try {
      const category = await Category.findById(categoryId)
      if(category) {
        await Category.findByIdAndUpdate(categoryId, req.body)
      } else {
        res.status(404).send({message: "Category not found!"})
      }
    } catch (error) {
      res.status(500).send({message: error.message})
    }
  }
}

module.exports = categoryCtrl