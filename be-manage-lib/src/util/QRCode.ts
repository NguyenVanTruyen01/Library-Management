import QRCode from "qrcode";

export const generateQrCode = async (id) => {
    try {
        const response = await QRCode.toDataURL(id);
        return response;
    } catch (error) {
        console.log(error);
    }
}
