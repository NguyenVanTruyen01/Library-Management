import { Response, Request, NextFunction } from "express"
import AuthModels from "../../model/Auth/Auth";
import BookModels from "../../model/Book/Book"
import CallCardModels from "../../model/CallCard/CallCard";
import { generateQrCode } from "../../util/QRCode";

const { ObjectId } = require('mongodb');

export const CallCardCtrl = {

    getAllCallCards: async (req: Request, res: Response) => {
        try {
            const queryPopulate = [
                { path: 'books.idBook' },
                { path: 'borrower libraryClerk', select: "name email phone" },
            ]
            // .lean() sẽ cho Mongoose bỏ qua việc khởi tạo toàn bộ tài liệu Mongoose và chỉ cung cấp cho bạn POJO.
            // giúp truy vấn nhanh hơn 
            // Tuy nhiên, khi sử dụng lean(), bạn sẽ mất đi một số tính năng của Mongoose như middleware và validation. 
            // Nếu bạn cần sử dụng các tính năng này, bạn nên tránh sử dụng lean() 
            const allCallCards = await CallCardModels.find()
                .populate(queryPopulate)
                .lean()
                .sort({ "createdAt": -1 });

            return res.status(200).json({
                msg: "Find all call card success !!",
                data: allCallCards
            })
        } catch (err) {
            return res.status(500).json({ msg: "Server Error", error: err.message })
        }
    },

    borrowBooks: async (req: Request, res: Response) => {
        try {
            const newBook = req.body;

            console.log(newBook);

            const bookIds = newBook.books.map(book => book.idBook);

            //===== Kiểm tra xem số sách tồn kho có > 0 ======
            // Lấy danh sách sách muốn mượn dưới database
            const books = await BookModels.find({ _id: { $in: bookIds } });
            // Lặp qua danh sách xem  số lượng sách có > 0
            for (const book of books) {

                if (book.quantity < 1) {
                    return res.status(400).json({
                        msg: `Not enough copies of book '${book.title}' available`,
                        bookId: book._id,
                    });
                }
            }


            const data = await CallCardModels.create(newBook);

            const dataQR = JSON.stringify({
                _id: data._id,
                borrower: data.borrower
            })
            // Tạo QRcode
            const QRCode = await generateQrCode(dataQR);
            // Thêm QRcode vào phieu muon
            const newCallcard = await CallCardModels.findByIdAndUpdate({ _id: data._id }, { QRCode: QRCode }, { new: true });

            // Thêm phiếu mượn vào danh sách phiếu mượn của người mượn sách
            await AuthModels.findByIdAndUpdate({
                _id: newCallcard.borrower
            }, {
                $push: { listCallCard: newCallcard._id }
            })

            const queryPopulate = [
                { path: 'books.idBook' },
                { path: 'borrower libraryClerk', select: "name email phone" },
            ]

            await newCallcard.populate(queryPopulate);

            // Tăng số lượng sách đã được mượn trong model Book
            // Và giảm số lượng sách có trong kho
            if (data) {
                const idBooks = await data.books.map(book => book.idBook);
                await BookModels.updateMany(
                    { _id: { $in: idBooks } },
                    { $inc: { borrowCount: 1, quantity: -1 } },
                    { multi: true }
                )

            }

            return res.status(200).json({
                msg: "create call card successfully",
                data: newCallcard
            })

        } catch (err) {
            return res.status(500).json({ msg: "Server Error", error: err.message })
        }
    },

    getCallCardById: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;

            const queryPopulate = [
                { path: 'books.idBook' },
                { path: 'borrower libraryClerk', select: "name email phone mssv" },
            ];

            const data = await CallCardModels.findById(id)
                .populate(queryPopulate).lean()
                .populate({
                    path: "books.idBook",
                    populate: {
                        path: "category",
                        select: "name"
                    }
                });

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

    returnBooks: async (req: Request, res: Response) => {

        try {
            const id = req.params.id;

            const validateCallCard = await CallCardModels.findById(id);

            // Không thể trả sách
            if (!validateCallCard) {
                return res.status(404).json({
                    msg: `can't return books with id ${id}`,
                })
            }

            // Phiếu mượn chưa được duyệt thì không thể trả
            if (validateCallCard && validateCallCard.waitingOrder === false) {
                return res.status(403).json({
                    msg: "Action forbidden. Callcard not approved yet",
                })
            }

            // Đã trả sách rồi thì không được trả nữa
            if (validateCallCard && validateCallCard.active === false) {
                return res.status(403).json({
                    msg: "Action forbidden. Already returned books",
                })
            }


            const queryPopulate = [
                { path: 'books.idBook' },
                { path: 'borrower libraryClerk', select: "name email phone" },
            ];
            //Nếu chưa trả thì thực hiện trả sách
            const data = await CallCardModels.findByIdAndUpdate(id, { active: false }, { new: true })
                .populate(queryPopulate);

            // Giảm số lượng sách đã được mượn trong model Book
            // Và tăng số lượng sách có trong kho
            const idBooks = await data.books.map(book => book.idBook);
            await BookModels.updateMany(
                { _id: { $in: idBooks } },
                { $inc: { borrowCount: -1, quantity: 1 } },
                { multi: true }
            )

            return res.status(200).json({
                msg: "return books successfully",
                data
            })

        }
        catch (err) {
            return res.status(500).json({ msg: "Server Error", error: err.message })
        }
    },

    deleteCallCard: async (req: Request, res: Response) => {

        try {
            const id = req.params.id;

            const deleteCallCard = await CallCardModels.findById(id);

            // Không tìm thấy phiếu mượn sách để xóa
            if (!deleteCallCard) {
                return res.status(404).json({
                    msg: `can't delete book with id ${id}`,
                })
            }


            if (deleteCallCard.active === true) {
                return res.status(403).json({
                    msg: `Action forbidden. Could not delete when not payed book `,
                })
            }

            const data = await CallCardModels.findByIdAndDelete(id);

            // Xóa phiếu mượn trong danh sách phiếu mượn của người mượn sách
            await AuthModels.findByIdAndUpdate({
                _id: data.borrower
            }, {
                $pull: { listCallCard: id }
            })

            return res.status(200).json({
                msg: "delete book successfully",
                data
            })

        }
        catch (err) {
            return res.status(500).json({ msg: "Server Error", error: err.message })
        }
    },

    getCallCardByUserId: async (req: Request, res: Response) => {
        try {
            const idUser = req.params.id;

            const queryPopulate = [
                { path: 'books.idBook' },
                { path: 'borrower libraryClerk', select: "name email phone" },
            ];

            const data = await CallCardModels.find({ borrower: idUser })
                .populate(queryPopulate)
                .lean()
                .sort({ "createdAt": -1 });;

            //Không tìm thấy sách theo userId
            if (!data) {
                return res.status(404).json({
                    msg: `can't find book with user id ${idUser}`,
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

    acceptCallCard: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;

            const validateCallCard = await CallCardModels.findById(id);

            // Không thể duyệt phiếu mượn
            if (!validateCallCard) {
                return res.status(404).json({
                    msg: `can't return books with id ${id}`,
                })
            }

            const queryPopulate = [
                { path: 'books.idBook' },
                { path: 'borrower libraryClerk', select: "name email phone" },
            ];

            //Duyệt phiếu mượn
            const data = await CallCardModels.findByIdAndUpdate(id, { waitingOrder: true }, { new: true })
                .populate(queryPopulate);

            return res.status(200).json({
                msg: "return books successfully",
                data
            })

        }
        catch (err) {
            return res.status(500).json({ msg: "Server Error", error: err.message })
        }
    }

}














