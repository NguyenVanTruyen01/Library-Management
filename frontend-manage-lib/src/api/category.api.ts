import Repository from "../congfig/repository/RepositoryConfig"
const url = 'http://localhost:5000/api/v1/category'

const CategoryService = {

    onCreateCategory: async (data: any) => {
        return await Repository("POST", url, { params: {}, body: data })
    },
    getAllCategory: async () => {
        return await Repository("GET", url, { params: {}, payload: {} })
    },
    getAllTopicNoPagination: async () => {
        return await Repository("GET", url + `/no-pagination`, { params: {}, payload: {} })
    },
    onDeleteCategoryById: async (id: string) => {
        return await Repository("DELETE", url + `/${id}`, { params: {}, body: {} })
    },
    onUpdateCategoryById: async ({ data, id }: any) => {
        console.log("data update Sách: ", data)
        return await Repository("PUT", url + `/${id}`, { params: {}, body: data })
    },

}
export default CategoryService