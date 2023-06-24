import React, { useCallback, useEffect, useState } from 'react'
import styles from './styles/add-oder.module.scss'
import QrReader from 'react-qr-reader'
import BookService from 'api/book.api'
import OderService from 'api/order.api'
import User from 'constant/User'
import TableBooks from '../TableBooks/TableBooks'
import { debounce } from "lodash"
import AuthService from '../../../../../../api/auth.api'
import { Response } from '@type/ListResponse'

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface IForm {
    title: string,
    author: string,
    publisher: string,
    category: string,
    quantity: number
}

interface Card {
    borrower?: string,
    libraryClerk?: string,
    issueDate?: string,
    dueDate?: string,
    books?: object[],
    fee?: number,
}

const AddOder = (props: any) => {

    //Lưu thông tin sách để hiển thị
    const [scanResultWebCam, setScanResultWebCam] = useState<any>(null);

    // Nhập mssv để tìm người mượn
    const [mssvBorrower, setMssvBorrower] = useState<string>("");

    // --------------------XỬ LÍ HIỆN THỊ NGÀY NGÀY TRẢ SÁCH----------------------------
    // Tạo một đối tượng Ngày mới và thêm một tháng vào đó
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

    // Định dạng ngày dưới dạng chuỗi ở định dạng YYYY-MM-DD
    const formattedDate = oneMonthFromNow.toISOString().substr(0, 10);

    // Lưu thông tin sách để hiển thị
    const [listBook, setListBook] = useState<any[]>([])

    // ====================== THÔNG TIN THẺ MƯỢN SÁCH =================================

    // Lưu list sách cần mượn
    const [listBookInput, setListBookInput] = useState<any[]>([])

    // Lưu ngày mượn sách
    const [issueDate, setIssueDate] = useState(new Date().toISOString().substr(0, 10));

    // Lưu thông tin ngày trả sách
    const [dueDate, setDueDate] = useState(formattedDate);

    // Lưu phí mượn sách
    const [fee, setFee] = useState<number>(0);

    const [borrower, setBorrower] = useState<string>()

    // ========================================================

    // Lưu danh sách người mượn sách tìm được
    const [listBorrower, setListBorrower] = useState<any[]>([])

    const resetState = () => {
        setScanResultWebCam(null);
        setMssvBorrower("");
        setListBook([]);
        setListBookInput([]);
        setIssueDate(new Date().toISOString().substr(0, 10));
        setDueDate(formattedDate);
        setFee(0);
        setBorrower('');
        setListBorrower([]);
    }

    // Xử lí hiện thị sách sau khi quét QR
    const handleScanWebCam = async (result: any) => {
        if (result) {
            let book = JSON.parse(result);
            let { _id } = book; // quet QR ra ID
            console.log(_id)
            await BookService.getBookByID(_id).then((book: any) => {
                console.log(book?.data)
                setScanResultWebCam(book?.data);

            })

        }
    }

    // Thêm sách vào list sách muốn mượn
    const addBookIntoList = async (e: any) => {
        e.preventDefault()

        try {

            if (listBook.some(book => book._id === scanResultWebCam._id)) {
                toast.warning("Sách này đã được thêm vào phiếu mượn !!!", { autoClose: 1000 });
            }

            else {

                if (scanResultWebCam.title) {

                    if (scanResultWebCam?.quantity > 1) {
                        let book = scanResultWebCam;
                        book.stt = listBook.length + 1;

                        await setListBook((preveState) => [...preveState, book])
                        await setListBookInput((preveState) => [...preveState, {
                            idBook: book._id,
                        }])
                        setScanResultWebCam(null)
                    }
                    else {
                        toast.warning("Sách đã được mượn hết, không thể thêm sách này !!!", { autoClose: 2000 });
                    }

                }
                else {
                    toast.error("Không thể thêm sách !!!", { autoClose: 1000 });
                }
            }



        } catch (e) {
            toast.error("Không thể thêm sách !!!", { autoClose: 1000 });
        }
    };

    // Xóa sách khỏi list sách muốn mượn
    const deleteBook = async (id: string) => {
        await setListBook(listBook => listBook.filter(book => book._id !== id))
    }

    const handleErrorWebCam = (error: any) => {
        console.log(error);
    }

    async function fetchDropdownBorrower(mssv: string) {
        if (mssv) {
            await AuthService.getBorrowerByMSSV(mssv)
                // .then((res: Response | undefined) => console.log(res?.data))
                .then((res: Response | undefined) => setListBorrower(res?.data))
                .catch((err) => setListBorrower([]));
        } else {
            setListBorrower([])
        }
    }

    const debounceDropDown = useCallback(debounce((nextValue) => fetchDropdownBorrower(nextValue), 1000), [])

    function handleInputBorrower(e: React.FocusEvent<HTMLInputElement>) {
        const { value } = e.target;
        setMssvBorrower(value);
        debounceDropDown(value);
    }

    // Tạo phiếu mượn sách mới
    const createNewCallCard = async () => {
        let CallCard: Card = {
            borrower: borrower,
            libraryClerk: User.info_user._id,
            issueDate: issueDate,
            dueDate: dueDate,
            books: listBookInput,
            fee: fee,
        }
        await OderService.onCreateOder(CallCard)
            .then((res) => {
                toast.success("Phiếu mượn sách đã được tạo thành công !!!", { autoClose: 1000 });
                resetState();
            })
            .catch((err) => {
                toast.error("Không thể xuất phiếu mượn. Vui lòng kiểm tra lại thông tin !!!", { autoClose: 1000 });
            });

    }


    return (
        <div className={styles.addOder}>

            <div className={styles.addOderMain}>
                <div className={`${styles.header} w-90 item-btw`}>
                    <div className={styles.title}>
                        MƯỢN SÁCH
                    </div>
                    <div className={styles.close} onClick={props?.handleClose}>
                        <i className="fa-sharp fa-solid fa-xmark" />
                    </div>
                </div>

                <div className={styles.body}>
                    <div className={styles.componentAddBook}>
                        <div className={styles.scan}>
                            <div className={styles.note}>Điều chỉnh mã QR sát với khung hình</div>
                            <QrReader
                                delay={300}
                                style={{ width: '90%', height: '100%' }}
                                onError={handleErrorWebCam}
                                onScan={handleScanWebCam}
                            />
                        </div>
                        <div className={styles.formadd}>
                            <div className={styles.titleResult} >Sách muốn mượn</div>

                            <div className={styles.infoBook}>
                                <div className={styles.imgBookCover}>
                                    <div className={styles.imgCover}>

                                        {/* <img
                                            src={scanResultWebCam ? scanResultWebCam?.bookCover?.url : ""}
                                            alt="Ảnh bìa sách" /> */}
                                        {
                                            scanResultWebCam ?

                                                <img
                                                    src={scanResultWebCam ? scanResultWebCam?.bookCover?.url : ""}
                                                    alt="Ảnh bìa sách" />
                                                :
                                                <div className={styles.addImg}>
                                                    <i className="fas fa-camera"></i>
                                                    <div >
                                                        Ảnh bìa sách
                                                    </div>
                                                </div>

                                        }


                                    </div>
                                    <div className={styles.loginFormBodyItemBtn}>
                                        <button type='submit' onClick={(e) => addBookIntoList(e)}> Thêm</button>
                                        <button type='button'
                                            className={styles.btnReset}
                                            onClick={() => resetState()}> Đặt lại</button>
                                    </div>
                                </div>
                                <form className={styles.formI4Book}>
                                    <div className={styles.main}>
                                        <div>
                                            <div className={styles.loginFormBodyItem}>
                                                <input type={"text"} disabled defaultValue={scanResultWebCam?.title} />
                                                <span>Tên sách </span>
                                            </div>
                                            <div className={styles.loginFormBodyItem}>
                                                <input type={"text"} disabled defaultValue={scanResultWebCam?.author} />
                                                <span>Tác giả</span>
                                            </div>
                                            <div className={styles.loginFormBodyItem}>
                                                <input type={"text"} disabled defaultValue={scanResultWebCam?.publisher} />
                                                <span>Nhà xuất bản </span>
                                            </div>
                                            <div className={styles.loginFormBodyItem}>
                                                <input type={"text"} disabled defaultValue={scanResultWebCam?.category?.name} />
                                                <span>Thể loại </span>
                                            </div>
                                            <div className={styles.loginFormBodyItem}>
                                                <input type={"text"} disabled defaultValue={scanResultWebCam?.quantity} />
                                                <span>Số lượng</span>
                                            </div>

                                        </div>
                                    </div>
                                </form>
                            </div>

                        </div>

                    </div>

                    <div className={styles.callcard}>
                        <h4>Hóa đơn mượn sách</h4>
                        <form className={styles.formCallcard}>
                            <TableBooks listBook={listBook} deleteBook={deleteBook} />

                            <div className={styles.person}>

                                {
                                    listBorrower.length > 0 ?
                                        <div className={styles.dropdownBorrower}>
                                            {
                                                listBorrower.flatMap((borrower, index) => (
                                                    <div className={styles.itemBorrower} key={index}
                                                        onClick={() => {
                                                            setBorrower(borrower._id);
                                                            setListBorrower([]);
                                                            setMssvBorrower(borrower.mssv + " - " + borrower.name)
                                                        }}
                                                    >
                                                        <div className={styles.mssv}> {borrower.mssv}</div>
                                                        <div className={styles.name}> {borrower.name}</div>
                                                    </div>)
                                                )
                                            }
                                        </div> : ""
                                }

                                <div className={styles.personItem}>
                                    <input type="text"
                                        value={mssvBorrower}
                                        placeholder="Nhập MSSV"
                                        onChange={(e: React.FocusEvent<HTMLInputElement>) => handleInputBorrower(e)}
                                    />
                                    <span>Người mượn</span>
                                </div>

                                <div className={styles.personItem}>
                                    <input type="text"
                                        disabled
                                        defaultValue={User.info_user.name}
                                    />
                                    <span>Thủ thư</span>

                                </div>


                            </div>

                            <div className={styles.dayComponent}>
                                <div className={styles.dayInput}>
                                    <input type={"date"}
                                        value={issueDate}
                                        onChange={(event) => setIssueDate(event.target.value)}
                                    />
                                    <span>Ngày mượn</span>
                                </div>

                                <div className={styles.dayInput}>
                                    <input type={"date"}
                                        value={dueDate}
                                        onChange={(event) => setDueDate(event.target.value)}
                                    />
                                    <span>Ngày trả</span>
                                </div>

                            </div>

                            <div className={styles.submit}>
                                <div className={styles.personItem}>
                                    <input
                                        type="number"
                                        step="500"
                                        min="0"
                                        value={fee}
                                        placeholder="VND"
                                        onChange={(event) => { setFee(parseFloat(event.target.value)) }}
                                    />
                                    <span>Phí mượn sách</span>
                                </div>
                                <div className={styles.btnBorrow}>
                                    <button type='button' onClick={createNewCallCard}>Mượn sách</button>
                                </div>

                            </div>

                        </form>
                    </div>

                </div >
            </div >
        </div >
    )
}

export default AddOder