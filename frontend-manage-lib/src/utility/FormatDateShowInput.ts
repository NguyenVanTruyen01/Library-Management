
export const convertDateForInput = (dateString: string): string => {
    // dateString = "2023-03-27T00:00:00.000Z";
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split("T")[0];
    // console.log(formattedDate); // Output: "2023-03-27"

    return formattedDate;
}
