import { Response, Request, NextFunction } from "express"
import BookModels from "../../model/Book/Book"
import CategoryModels from "../../model/Category/Category";
import { generateQrCode } from "../../util/QRCode";
const { ObjectId } = require('mongodb');
import { FilterQuery } from 'mongoose';

interface IBook {
    title: string
    author: string
    publisher: string
    category: string
}

export const BookCtrl = {

    getAllBooks: async (req: Request, res: Response) => {
        try {
            const allBooks = await BookModels.find()
                .populate("category")
                .sort({ createdAt: -1 })
                .lean();

            return res.status(200).json({
                msg: "Find all books success !!",
                data: allBooks
            })
        } catch (err) {
            return res.status(500).json({ msg: "Server Error", error: err.message })
        }
    },

    createBooks: async (req: Request, res: Response) => {
        try {
            const newBook = req.body;
            console.log(req.body)
            // Kiểm tra xem sách đã có trong database chưa 
            // Nếu chưa mới được phép tạo mới
            const validatedBook = await BookModels.findOne({
                $and: [
                    { title: newBook.title },
                    { author: newBook.author },
                    { publisher: newBook.publisher },
                    { category: newBook.category }
                ]
            })

            // Nếu sách đã tồn tại
            if (validatedBook) {
                return res.status(500).json({ msg: "This book is already exist", })
            }

            const data = await BookModels.create(newBook);

            const dataQR = JSON.stringify({
                _id: data._id,
                title: data.title,
                author: data.author
            })

            // Tạo QRcode
            const QRCode = await generateQrCode(dataQR);

            // Thêm QRcode vào sách
            const book = await BookModels.findByIdAndUpdate({ _id: data._id }, { QRCode: QRCode }, { new: true });

            // Thêm sách mới vào danh sách book có trong thể loại sách
            await CategoryModels.findByIdAndUpdate(
                { _id: data.category },
                { $push: { books: data._id } }
            )

            return res.status(200).json({
                msg: "create book successfully",
                data: book
            })

        } catch (err) {
            return res.status(500).json({ msg: "Server Error", error: err.message })
        }
    },

    getBookById: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;

            const data = await BookModels.findById(id).populate("category").lean();

            //Không tìm thấy sách theo id
            if (!data) {
                return res.status(404).json({
                    msg: `can't find book with id ${id}`,
                })
            }

            return res.status(200).json({
                msg: "get a book successfully",
                data
            })

        }
        catch (err) {
            return res.status(500).json({ msg: "Server Error", error: err.message })
        }

    },

    deleteBook: async (req: Request, res: Response) => {

        try {
            const id = req.params.id;

            const data = await BookModels.findByIdAndDelete(id);

            // Không tìm thấy sách để xóa
            if (!data) {
                return res.status(404).json({
                    msg: `can't delete book with id ${id}`,
                })
            }


            // Xóa sách có trong thể loại sách tương ứng khi xóa một cuốn sách
            const bookCategory = await CategoryModels.findByIdAndUpdate(
                { _id: data.category },
                { $pull: { books: data._id } }
            )

            return res.status(200).json({
                msg: "delete book successfully",
                data
            })

        }
        catch (err) {
            return res.status(500).json({ msg: "Server Error", error: err.message })
        }
    },

    updateBook: async (req: Request, res: Response) => {

        try {
            const id = req.params.id;
            const updateBook = req.body;

            // Kiểm tra xem đã có cuốn sách nào trong database có thông tin 
            // giống như thông tin cần update không
            const validatedBook = await BookModels.findOne({
                $and: [
                    { _id: { $ne: id } },
                    { title: updateBook.title },
                    { author: updateBook.author },
                    { publisher: updateBook.publisher },
                    { category: updateBook.category }
                ]
            })

            // Không thể update thông tin sách mà thông tin update giống với một cuốn sách khác đã có trong database
            if (validatedBook && validatedBook._id !== new ObjectId(id)) {
                return res.status(500).json({ msg: "This book is already exist", })
            }

            const oldBook = await BookModels.findById(id);

            const data = await BookModels
                .findByIdAndUpdate(id, updateBook, { new: true })
                .populate('category');

            if (!data) {
                return res.status(404).json({
                    msg: `can't update book with id ${id}`,
                })
            }

            //Cập nhật sách có trong thể loại nếu thay đổi thể loại sách
            const oldCategogyID = oldBook.category + "";
            const updateCategoryID = updateBook.category;

            if (oldCategogyID !== updateCategoryID) {

                await CategoryModels.findByIdAndUpdate(oldCategogyID,
                    { $pull: { books: id } }
                )

                await CategoryModels.findByIdAndUpdate(updateCategoryID,
                    { $push: { books: id } }
                )

            }

            return res.status(200).json({
                msg: "update book successfully",
                data

            })

        }
        catch (err) {
            return res.status(500).json({ msg: "Server Error", error: err.message })
        }
    },

    searchBookByManyFields: async (req: Request, res: Response) => {
        const { title, author, publisher, category } = req.body;
        console.log(req.body)
        let filters: FilterQuery<IBook> = {};
        if (title) filters.title = new RegExp(title.toString(), 'i');
        if (author) filters.author = new RegExp(author.toString(), 'i');
        if (publisher) filters.publisher = new RegExp(publisher.toString(), 'i');
        if (category) filters.category = category.toString();
        console.log(filters)
        try {
            const books = await BookModels.find(filters);
            return res.status(200).json({
                msg: "Find books by many field success !!",
                data: books
            })
        } catch (error) {
            return res.status(500).json({ msg: "Server Error", error: error.message })
        }
    }

}













