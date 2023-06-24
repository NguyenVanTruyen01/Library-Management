import React, { useState, useCallback, useEffect } from 'react'
import styles from './styles/popup-edit-book.module.scss'
import { Button } from '@mui/material'
import CategoryService from 'api/category.api'
import BookService from 'api/book.api'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useForm } from "react-hook-form";
import { imageUpload } from 'utility/ImagesUpload'



const PopupEditBook = (props: any) => {

    const [categories, setCategories] = useState<any>([])

    // Hứng detailBook
    const { detailBook, handleClose } = props;

    //Lưu avatar khi thay đổi
    const [imagesBookCover, setImagesBookCover] = useState<File[]>([]);
    const [onChangeBookCover, setOnChangeBookCover] = useState<Boolean>(false)

    let db = useCallback(async () => {
        return await CategoryService.getAllCategory()
    }, [])

    const handleOnChangeBookCover = (e: any) => {
        e.preventDefault()
        const files = [...e.target.files]

        let err = "";

        if (!files[0]) return err = "File does not exist"
        if (files[0].type !== "image/jpeg" && files[0].type !== "image/png" && files[0].type !== "image/jpg")
            return err = "Image format is incorrect"

        if (err) {
            console.log("Error Img", err)
        }

        else {
            setImagesBookCover(files);
            setOnChangeBookCover(true)
        }

        e.target.value = null;

    }

    const handleGetBookCover = async () => {

        try {

            let media: any = []
            media = await imageUpload(imagesBookCover);
            return media;

        } catch (error) {
            console.log(error)
        }

    }



    const { register, handleSubmit } = useForm(
        {
            defaultValues: {
                title: detailBook?.title,
                author: detailBook?.author,
                publisher: detailBook?.publisher,
                category: detailBook?.category?._id,
                price: detailBook?.price,
                quantity: detailBook?.quantity,
                description: detailBook?.description

            }
        }
    );

    // Thực hiện cập nhật thông tin sách
    const onSubmit = async (data: any, e: any) => {

        const id = detailBook._id;

        const updateBook = async (data: any, id: string) => {

            if (imagesBookCover.length > 0) {
                const bookCover = await handleGetBookCover();
                data.bookCover = bookCover[0];
            }

            await BookService.onUpdate({ data, id })
        }

        await toast.promise(
            updateBook(data, id),
            {
                pending: 'Đang cập nhật sách',
                success: 'Cập nhật sách thành công 👌',
                error: 'Cập nhật sách thất bại, sách có thể đã tồn tại 🤯'
            },
            {
                autoClose: 2000
            }
        );
    }

    const handleCloseModal = () => {
        handleClose()
        setImagesBookCover([])
        setOnChangeBookCover(false)
    }

    const onError = (errors: any, e: any) => console.log(errors, e);

    useEffect(() => {
        db().then((result: any) => {
            setCategories(result?.data)
        })
    }, [])

    return (
        <div className={styles.detailScan}>



            <div className={styles.mainPopup}>
                <div className={`${styles.headerPopup} w-90 item-btw`}>
                    <div className={styles.title}>
                        CHI TIẾT SÁCH
                    </div>
                    <div className={styles.close} onClick={props?.handleClose}>
                        <i className="fa-sharp fa-solid fa-xmark" />
                    </div>
                </div>

                <div className={`${styles.bodyPopup} w-90`}>



                    <div className={`${styles.imgBook} w-45`}>

                        <input type="checkbox" className={styles.btnNext} id="c1" />

                        <div className={styles.groupImg}>

                            <div className={styles.front}>
                                <div className={styles.editCoverBook} >
                                    <label>
                                        <i className="fa fa-camera"></i>
                                        <input type="file"
                                            onChange={handleOnChangeBookCover}
                                        />
                                    </label>
                                </div>

                                <img src={onChangeBookCover ? URL.createObjectURL(imagesBookCover[0]) : detailBook?.bookCover?.url}
                                    alt="" />
                                <label htmlFor="c1"> Xem QR <i className="fas fa-long-arrow-alt-right"></i></label>
                            </div>

                            <div className={styles.back}>
                                <img src={detailBook?.QRCode}
                                    alt="" />

                                <a href={detailBook?.QRCode} download >Tải xuống QR</a>

                                <label htmlFor="c1"><i className="fas fa-long-arrow-alt-left"></i> Trở về </label>
                            </div>
                        </div>


                    </div>

                    <div className={`${styles.result} w-45`}>
                        <div className={styles.titleResult} >Thông tin sách</div>
                        <form onSubmit={handleSubmit(onSubmit, onError)}>
                            <div className={styles.main}>

                                <div>
                                    <div className={styles.flexItems}>
                                        <div className={styles.loginFormBodyItem}>
                                            <input type={"text"}
                                                {...register("title")}
                                            />
                                            <span>Tên sách</span>
                                        </div>
                                        <div className={styles.loginFormBodyItem}>
                                            <input
                                                type={"text"}
                                                {...register("author")}
                                            />
                                            <span>Tác giả</span>
                                        </div>
                                    </div>

                                    <div className={styles.flexItems}>
                                        <div className={styles.loginFormBodyItem}>
                                            <input type={"text"}
                                                {...register("publisher")}
                                            />
                                            <span>Nhà xuất bản</span>
                                        </div>
                                        <div className={styles.loginFormBodyItem}>
                                            <select id="category"
                                                {...register("category")}
                                            >

                                                {
                                                    categories ? categories.map((category: any, index: number) =>
                                                        < option key={index}
                                                            selected={detailBook?.category?._id === category._id ? true : false}
                                                            value={category._id} > {category.name}</option>
                                                    ) : ""
                                                }
                                            </select>
                                            <span>Thể lọai</span>
                                        </div>
                                    </div>

                                    <div className={styles.flexItems}>
                                        <div className={styles.loginFormBodyItem}>
                                            <input type={"number"}
                                                min={0}
                                                step={100}
                                                {...register("price")}
                                            />
                                            <span>Giá sách</span>
                                        </div>

                                        <div className={styles.loginFormBodyItem}>
                                            <input type={"number"}
                                                min={0}
                                                step={1}
                                                defaultValue={detailBook?.quantity + detailBook?.borrowCount}
                                                disabled
                                            />
                                            <span>Tổng số sách</span>
                                        </div>

                                    </div>

                                    <div className={styles.flexItems}>
                                        <div className={styles.loginFormBodyItem}>
                                            <input type={"number"}
                                                min={0}
                                                step={1}
                                                {...register("quantity")}
                                            />
                                            <span>Tồn kho</span>
                                        </div>
                                        <div className={styles.loginFormBodyItem}>
                                            <input type={"number"}
                                                defaultValue={detailBook?.borrowCount}
                                                disabled
                                            />
                                            <span>Số sách đã mượn</span>
                                        </div>
                                    </div>


                                    <div className={styles.flexItems}>
                                        <div className={styles.loginFormBodyItem}>
                                            <textarea rows={3}
                                                {...register("description")}
                                            />
                                            <span>Giới thiệu sách</span>
                                        </div>
                                    </div>

                                </div>

                            </div>

                            <div className={styles.groupBtn}>
                                <Button
                                    variant='contained'
                                    color='warning'
                                    onClick={handleCloseModal}
                                >Hủy</Button>
                                <Button
                                    variant='contained'
                                    color='primary'
                                    type='submit'
                                >Cập nhật</Button>
                            </div>

                        </form>

                    </div>
                </div>

            </div >
        </div >
    )
}

export default PopupEditBook