import { Response, Request, NextFunction } from "express"
import CategoryModels from "../../model/Category/Category";
import BookModels from "../../model/Book/Book";
const { ObjectId } = require('mongodb');

export const CategoryCtrl = {

    getAllCategory: async (req: Request, res: Response) => {
        try {
            const listCategories = await CategoryModels.find().lean();

            return res.status(200).json({
                msg: "Find all categogries success !!",
                data: listCategories
            })
        } catch (err) {
            return res.status(500).json({ msg: "Server Error", error: err.message })
        }
    },

    createCategory: async (req: Request, res: Response) => {
        try {
            const newCategory = req.body;

            // Kiểm tra xem thể loại sách đã có trong database chưa 
            // Nếu chưa mới được phép tạo mới
            const validatedCategory = await CategoryModels.findOne({ name: newCategory.name })

            // Nếu thể loại sách đã tồn tại
            if (validatedCategory) {
                return res.status(500).json({ msg: "This category is already exist", })
            }

            const data = await CategoryModels.create(newCategory);

            return res.status(200).json({
                msg: "create new category successfully",
                data
            })

        } catch (err) {
            return res.status(500).json({ msg: "Server Error", error: err.message })
        }
    },

    getCategoryById: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;

            const data = await CategoryModels.findById(id);

            //Không tìm thấy thể loại sách theo id
            if (!data) {
                return res.status(404).json({
                    msg: `can't find category with id ${id}`,
                })
            }

            return res.status(200).json({
                msg: "get a category successfully",
                data
            })

        }
        catch (err) {
            return res.status(500).json({ msg: "Server Error", error: err.message })
        }

    },

    deleteCategory: async (req: Request, res: Response) => {

        try {
            const id = req.params.id;

            const data = await CategoryModels.findByIdAndDelete(id);

            // Không tìm thấy thể loại sách để xóa
            if (!data) {
                return res.status(404).json({
                    msg: `can't delete category with id ${id}`,
                })
            }

            // Xóa tất cả sách có trong thể loại sách này
            await BookModels.deleteMany({ _id: { $in: data.books } })

            return res.status(200).json({
                msg: "delete category successfully",
                data
            })

        }
        catch (err) {
            return res.status(500).json({ msg: "Server Error", error: err.message })
        }
    },

    updateCategory: async (req: Request, res: Response) => {

        try {
            const id = req.params.id;
            const updateCategory = req.body;

            // Kiểm tra xem đã có thể loại sách nào trong database có tên 
            // giống như tên cần update không
            const validatedCategory = await CategoryModels.findOne({
                $and: [
                    { _id: { $ne: id } },
                    { name: updateCategory.name }
                ]
            })

            // Không thể update thông tin thể loại sách mà tên 
            // update giống với một tên một thể loại sách khác đã có trong database
            if (validatedCategory && validatedCategory._id !== new ObjectId(id)) {
                return res.status(500).json({ msg: "This category is already exist", })
            }

            const data = await CategoryModels.findByIdAndUpdate(id, updateCategory, { new: true });

            if (!data) {
                return res.status(404).json({
                    msg: `can't update category with id ${id}`,
                })
            }

            return res.status(200).json({
                msg: "update category successfully",
                data

            })

        }
        catch (err) {
            return res.status(500).json({ msg: "Server Error", error: err.message })
        }
    }

}














