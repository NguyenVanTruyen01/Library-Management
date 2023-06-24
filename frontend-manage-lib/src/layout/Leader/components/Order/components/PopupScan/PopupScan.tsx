import React, { useState } from 'react'
import styles from './styles/popup-scan.module.scss'
import QrReader from 'react-qr-reader'
import { Button } from '@mui/material'
import OderService from 'api/order.api'
import TableBooksReturn from '../TableBooksReturn/TableBooksReturn'
import { convertDateForInput } from '../../../../../../utility/FormatDateShowInput'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const PopupScan = (props: any) => {

    const [scanResultWebCam, setScanResultWebCam] = useState<any>(null)
    const [listBook, setListBook] = useState<any[]>([])

    const resetState = () => {
        setScanResultWebCam(null);
        setListBook([]);
    }

    const handleErrorWebCam = (error: any) => {
        console.log(error);
    }

    const handleScanWebCam = async (result: any) => {
        if (result) {
            let callcard = JSON.parse(result);
            let { _id } = callcard; // quet QR ra ID  callcard

            await OderService.getOderByID(_id)
                .then((res: any) => {
                    console.log("CallCard", res)
                    setScanResultWebCam(res?.data);

                    // Convert list books để hiển thị lên table
                    let arr: any = [];
                    res?.data?.books.map((book: any, index: number) => {
                        book.idBook.stt = index + 1;
                        book.idBook.count = 1;
                        arr.push(book.idBook)
                    })
                    setListBook(arr);
                })
                .catch((err) => {
                    toast.error("Mã QR không hợp lệ. Vui lòng kiểm tra lại !!!", { autoClose: 1000 });
                })
        }
    }

    const returnBooks = async () => {

        if (scanResultWebCam)
            await OderService.returnOderByID(scanResultWebCam._id)
                .then((result) => {
                    setScanResultWebCam((prev: any) => ({ ...prev, active: result?.data?.active }))
                    toast.success("Đã trả sách thành công !!!", { autoClose: 1000 });
                }

                )
                .catch((error) => {
                    toast.error("Không thể trả sách. Vui lòng kiểm tra lại !!!", { autoClose: 1000 });
                });
        else {
            toast.error("Không thể trả sách. Vui lòng kiểm tra lại !!!", { autoClose: 1000 });
        }
    }

    return (
        <div className={styles.detailScan}>

            <div className={styles.mainPopup}>
                <div className={`${styles.headerPopup} w-90 item-btw`}>
                    <div className={styles.title}>
                        TRẢ SÁCH
                    </div>
                    <div className={styles.close} onClick={props?.handleClose}>
                        <i className="fa-sharp fa-solid fa-xmark" />
                    </div>
                </div>
                <div className={`${styles.bodyPopup} w-90`}>
                    <div className={`${styles.camera} w-45`}>
                        <div className={styles.note} >Điều chỉnh mã QR sát với khung hình</div>
                        <QrReader
                            delay={300}
                            style={{ width: '90%', height: '100%' }}
                            onError={handleErrorWebCam}
                            onScan={handleScanWebCam}
                        />
                        <button className={styles.btnReset}
                            type="button"
                            onClick={() => resetState()}
                        >
                            Đặt lại
                        </button>
                    </div>

                    <div className={`${styles.result} w-45`}>
                        <div className={styles.titleResult} >Thẻ mượn sách</div>
                        <div className={styles.main}>
                            <div>
                                <div className={styles.flexItems}>
                                    <div className={styles.loginFormBodyItem}>
                                        <input type={"text"} defaultValue={scanResultWebCam?._id} disabled />
                                        <span>Mã phiếu mượn</span>
                                    </div>
                                    <div className={styles.loginFormBodyItem}>
                                        <input
                                            type={"text"}
                                            disabled
                                            style={{ fontWeight: 700 }}
                                            defaultValue={scanResultWebCam ? (scanResultWebCam?.active ? "Chưa trả" : "Đã trả") : ""} />
                                        <span>Tình trạng</span>
                                    </div>
                                </div>

                                <div className={styles.flexItems}>
                                    <div className={styles.loginFormBodyItem}>
                                        <input type={"text"}
                                            disabled
                                            defaultValue={scanResultWebCam?.borrower?.name}
                                        />
                                        <span>Người mượn </span>
                                    </div>
                                    <div className={styles.loginFormBodyItem}>
                                        <input type={"text"}
                                            disabled
                                            defaultValue={scanResultWebCam?.borrower?.mssv}
                                        />
                                        <span>MSSV</span>
                                    </div>
                                </div>

                                <div className={styles.flexItems}>
                                    <div className={styles.loginFormBodyItem}>
                                        <input type={"date"}
                                            disabled
                                            defaultValue={scanResultWebCam?.issueDate ? convertDateForInput(scanResultWebCam?.issueDate) : ""}
                                        />
                                        <span>Ngày mượn </span>
                                    </div>
                                    <div className={styles.loginFormBodyItem}>
                                        <input type={"date"}
                                            disabled
                                            defaultValue={scanResultWebCam?.issueDate ? convertDateForInput(scanResultWebCam?.dueDate) : ""}
                                        />
                                        <span>Ngày trả</span>
                                    </div>
                                </div>

                                <div className={styles.flexItems}>
                                    <div className={styles.loginFormBodyItem}>
                                        <input type={"text"}
                                            disabled
                                            defaultValue={scanResultWebCam?.libraryClerk?.name}
                                        />
                                        <span>Thủ thư</span>
                                    </div>
                                    <div className={styles.loginFormBodyItem}>
                                        <input type={"text"}
                                            disabled
                                            defaultValue={scanResultWebCam?.fee}
                                        />
                                        <span>Phí mượn sách</span>
                                    </div>
                                </div>

                                <div className={styles.flexItems}>
                                    <TableBooksReturn listBook={listBook} />
                                </div>

                            </div>
                        </div>

                        <div className={styles.btnReturn}>
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={returnBooks}
                            >Trả sách</Button>
                        </div>
                    </div>
                </div>

            </div>
        </div >
    )
}

export default PopupScan