import Repository from "../congfig/repository/RepositoryConfig"
const url = 'http://localhost:5000/api/v1/book'

const BookService = {
    getAllBook: async (page: number) => {
        return await Repository("GET", url + `/?page=${page}`, { params: {}, payload: {} })
    },
    onCreate: async (data: any) => {
        return await Repository("POST", url, { params: {}, body: data })
    },
    onDelete: async (data: any) => {
        console.log(data)
        return await Repository("DELETE", url + `/${data.id}`, { params: {}, body: {} })
    },
    onUpdate: async ({ data, id }: any) => {
        console.log("data update Sách: ", data)
        return await Repository("PUT", url + `/${id}`, { params: {}, body: data })
    },
    getBookByID: async (id: string) => {
        return await Repository("GET", url + `/${id}`, { params: {}, body: {} })
    },
    searchBookByOption: async (option: any) => {
        return await Repository("POST", url + `/search`, { params: {}, body: option })
    },

}
export default BookService