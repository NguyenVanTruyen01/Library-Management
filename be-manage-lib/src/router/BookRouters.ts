import express from "express"
import { BookCtrl } from "../controller/Book/BookController"
const BookRouters = express.Router();


BookRouters.route('/book/')
    .get(BookCtrl.getAllBooks)
    .post(BookCtrl.createBooks);


BookRouters.route('/book/search/')
    .post(BookCtrl.searchBookByManyFields)

BookRouters.route('/book/:id')
    .get(BookCtrl.getBookById)
    .delete(BookCtrl.deleteBook)
    .put(BookCtrl.updateBook);

export default BookRouters