export const checkImage = (file: File | null): string => {
    let err = ""
    if (!file) return err = "File does not exist."

    if (file.size > 1024 * 1024) // 1mb
        err = "The largest image size is 1mb."

    if (file.type !== 'image/jpeg' && file.type !== 'image/png')
        err = "Image format is incorrect."

    return err;
}


export const imageUpload = async (images: any) => {
    let imgArr = [];

    const url = process.env.REACT_APP_URL_CLOUDINARY_UPLOAD;
    const cloud_name = process.env.REACT_APP_CLOUDINARY_NAME;
    const upload_preset = process.env.REACT_APP_UPLOAD_PRESET;

    console.log("REACT_APP_URL_CLOUDINARY_UPLOAD: ", url)

    for (const item of images) {
        const formData = new FormData()

        if (item.camera) {
            formData.append("file", item.camera)
        } else {
            formData.append("file", item)
        }

        formData.append("upload_preset", upload_preset as string)
        formData.append("cloud_name", cloud_name as string)

        // upload hình ảnh lên cloudinary
        const res = await fetch(url as RequestInfo, {
            method: "POST",
            body: formData
        })

        const data = await res.json();

        imgArr.push(
            {
                public_id: data.public_id,
                url: data.secure_url
            })
    }
    return imgArr;
}