// import moment from "moment"

export const convertDate = (value: any) => {

    // Tạo một đối tượng Date từ chuỗi ISO 8601
    const date = new Date(value);

    // Lấy giá trị ngày, tháng, năm, giờ, phút, giây từ đối tượng Date
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    // Định dạng chuỗi ngày tháng
    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;


}

export const convertDateLocal = (value: any) => {
    // return moment(value?.toString()).lo
}
// export const convertTimeDate = (value:any) => {
//     return moment(value).format('HH:MM DD/MM/YYYY')
// }
export const CurrentDate = () => {
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    // This arrangement can be altered based on how we want the date's format to appear.
    let currentDate = `${day}-${month}-${year}`;
    return currentDate
}

export const convertDateTime = (time: any) => {
    let hours: string = new Date(time).getHours().toString()
    let minutes: string = new Date(time).getMinutes().toString()
    let date: string = new Date(time).getDate().toString()
    let month: string = (new Date(time).getMonth() + 1).toString()
    const year = new Date(time).getFullYear()
    if (Number(hours) < 10) {
        hours = `0${hours}`
    }
    if (Number(minutes) < 10) {
        minutes = `0${minutes}`
    }
    if (Number(date) < 10) {
        date = `0${date}`
    }
    if (Number(month) < 10) {
        month = `0${month}`
    }
    return `${date}/${month}/${year}  ${hours}:${minutes}`
}
