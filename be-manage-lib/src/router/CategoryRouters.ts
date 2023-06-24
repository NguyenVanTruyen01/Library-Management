import express from 'express'
import { CategoryCtrl } from '../controller/Category/CategoryController';

const CategoryRouters = express.Router()

CategoryRouters.route('/category/')
    .get(CategoryCtrl.getAllCategory)
    .post(CategoryCtrl.createCategory);

CategoryRouters.route('/category/:id')
    .get(CategoryCtrl.getCategoryById)
    .delete(CategoryCtrl.deleteCategory)
    .put(CategoryCtrl.updateCategory);

export default CategoryRouters

