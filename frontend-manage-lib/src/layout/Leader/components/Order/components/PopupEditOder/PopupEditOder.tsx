import React from 'react'
import styles from './styles/popup-edit-order.module.scss'
import { useState, useEffect } from 'react'
import { Button } from '@mui/material'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OrderService from 'api/order.api'
import User from 'constant/User'
import TableBooksReturn from '../TableBooksReturn/TableBooksReturn';

import { convertDate } from 'utility/ConvertDate'

import OderService from 'api/order.api'

export type CallCard = {
    borrower: object,
    libraryClerk: object,
    issueDate: string,
    dueDate: string,
    books: [],
    fee: number,
    active: boolean,
    QRCode: string,
    waitingOrder: boolean,
};



const PopupEditCallCard = (props: any) => {

    const [isLoading, setIsLoading] = useState<Boolean>(false)
    let user = User.info_user

    // Hứng id detailCallCard
    const { detailCallCard, handleClose } = props;

    const [callcard, setCallCard] = useState<any>(null);

    const [listBook, setListBook] = useState<any[]>([])


    const getCallCardByID = async () => {

        const callcard = await OrderService.getOderByID(detailCallCard);
        await setCallCard(callcard?.data)

        // Convert list books để hiển thị lên table
        let arr: any = [];
        callcard?.data?.books.map((book: any, index: number) => {
            book.idBook.stt = index + 1;
            book.idBook.count = 1;
            arr.push(book.idBook)
        })
        setListBook(arr);

    }

    //   Thực hiện duyệt phiếu mượn
    const acceptCallCard = async () => {

        const id = detailCallCard;

        const accept = async (id: string) => {
            await OrderService.onUpdateAcceptOderByID(id)
            setIsLoading(!isLoading)
        }

        await toast.promise(
            accept(id),
            {
                pending: 'Đang duyệt phiếu mượn',
                success: 'Duyệt phiếu mượn thành công 👌',
                error: 'Duyệt phiếu mượn thất bại🤯'
            },
            {
                autoClose: 3000
            }
        );

    }

    const returnBooks = async (id: string) => {

        await OderService.returnOderByID(id)
            .then((result) => {
                setCallCard((result?.data));
                setIsLoading(!isLoading)
                toast.success("Đã trả sách thành công !!!", { autoClose: 1000 });
            }

            )
            .catch((error) => {
                toast.error("Không thể trả sách. Vui lòng kiểm tra lại !!!", { autoClose: 1000 });
            });
    }

    const handleButton = (active: boolean, waitingOrder: boolean): any => {

        if (!waitingOrder) {
            return <Button
                style={{ minWidth: "110px" }}
                variant='contained'
                size="medium"
                color='success'
                type='button'
                onClick={acceptCallCard}
            >Duyệt phiếu</Button>

        }
        else {
            if (active) {
                return <Button
                    style={{ minWidth: "110px" }}
                    variant='contained'
                    color='primary'
                    size="medium"
                    type='button'
                    onClick={() => returnBooks(detailCallCard)}
                >Trả sách</Button>
            }
            else {
                return "";
            }
        }
    }

    useEffect(() => {
        getCallCardByID();
    }, [isLoading])

    return (
        <div className={styles.detailScan}>
            <div className={styles.mainPopup}>

                <div className={`${styles.headerPopup} w-90 item-btw`}>
                    <div className={styles.title}>
                        CHI TIẾT PHIẾU MƯỢN
                    </div>
                    <div className={styles.close} onClick={props?.handleClose}>
                        <i className="fa-sharp fa-solid fa-xmark" />
                    </div>
                </div>

                <div className={`${styles.bodyPopup} w-90`}>

                    <input type="checkbox" id="popupBooks" className={styles.checkedBooks} />

                    <div className={`${styles.imgBook} w-45`}>

                        <div className={styles.groupImg}>

                            <div className={styles.front}>
                                <img src={callcard?.QRCode}
                                    alt="" />

                                <a href={callcard?.QRCode} download >Tải xuống QR</a>

                                <label htmlFor="popupBooks">
                                    <div className={styles.btnListBooks}>
                                        Sách đã mượn
                                        <i className="fa-solid fa-right-long"></i>
                                    </div>

                                </label>

                            </div>
                        </div>
                    </div>


                    {
                        listBook.length > 0 ?
                            <div className={`${styles.popupBooks} w-45`}>
                                <div className={styles.titleResult} >Sách đã mượn</div>
                                <div className={styles.mainBooks}>
                                    <TableBooksReturn listBook={listBook}></TableBooksReturn>
                                </div>
                            </div>
                            :
                            <></>

                    }


                    <div className={`${styles.result} w-45`}>
                        <div className={styles.titleResult} >Thông tin phiếu mượn</div>
                        <form >
                            <div className={styles.main}>

                                <div>
                                    <div className={styles.flexItems}>
                                        <div className={styles.loginFormBodyItem}>
                                            <input type={"text"}
                                                defaultValue={callcard?.borrower?.name}
                                                disabled
                                            />
                                            <span>Người mượn</span>
                                        </div>
                                        <div className={styles.loginFormBodyItem}>
                                            <input
                                                type={"text"}
                                                defaultValue={callcard?.borrower?.mssv}
                                                disabled
                                            />
                                            <span>MSSV</span>
                                        </div>
                                    </div>

                                    <div className={styles.flexItems}>
                                        <div className={styles.loginFormBodyItem}>
                                            <input type={"text"}
                                                style={{ color: "#fd5a59" }}
                                                // defaultValue={getStatusCallCards(callcard?.active, callcard?.waitingOrder)}
                                                defaultValue={callcard ?
                                                    (!callcard?.waitingOrder
                                                        ? "Đang chờ xét duyệt" : (callcard?.active
                                                            ? "Chưa trả" : "Đã trả")) : ""}
                                                disabled
                                            />
                                            <span>Tình trạng</span>
                                        </div>
                                        <div className={styles.loginFormBodyItem}>
                                            <input type={"text"}
                                                defaultValue={user?.name}
                                                disabled
                                            />
                                            <span>Thủ thư duyệt phiếu</span>
                                        </div>
                                    </div>

                                    <div className={styles.flexItems}>
                                        <div className={styles.loginFormBodyItem}>
                                            <input type={"text"}
                                                defaultValue={callcard?.issueDate ? convertDate(callcard?.issueDate) : ""}
                                                disabled
                                            />
                                            <span>Ngày mượn</span>
                                        </div>

                                        <div className={styles.loginFormBodyItem}>
                                            <input type={"text"}
                                                defaultValue={callcard?.dueDate ? convertDate(callcard?.dueDate) : ""}
                                                disabled
                                            />
                                            <span>Ngày trả</span>
                                        </div>

                                    </div>

                                    <div className={styles.flexItems}>
                                        <div className={styles.loginFormBodyItem}>
                                            <input type={"number"}
                                                min={0}
                                                step={1}
                                                defaultValue={callcard?.fee}
                                                disabled
                                            />
                                            <span>Phí mượn</span>
                                        </div>
                                        <div className={styles.loginFormBodyItem}>
                                            <input type={"number"}
                                                defaultValue={callcard?.books.length}
                                                disabled
                                            />
                                            <span>Số sách đã mượn</span>
                                        </div>
                                    </div>


                                </div>

                            </div>

                            <div className={styles.groupBtn}>
                                <Button
                                    style={{ minWidth: "110px" }}
                                    variant='contained'
                                    color='warning'
                                    size="medium"
                                    onClick={handleClose}
                                >Hủy</Button>

                                {
                                    handleButton(callcard?.active, callcard?.waitingOrder)
                                }

                            </div>

                        </form>

                    </div>
                </div>

            </div >
        </div >
    )
}

export default PopupEditCallCard

