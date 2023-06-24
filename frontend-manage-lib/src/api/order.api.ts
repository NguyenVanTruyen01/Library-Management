import Repository from "../congfig/repository/RepositoryConfig"
const url = 'http://localhost:5000/api/v1/callcard'

const OderService = {
    getAllOder: async () => {
        return await Repository("GET", url, { params: {}, payload: {} })
    },
    onCreateOder: async (data: any) => {
        return await Repository("POST", url, { params: {}, body: data })
    },
    onDeleteOderByID: async (id: string) => {
        // console.log(data)
        return await Repository("DELETE", url + `/${id}`, { params: {}, body: {} })
    },
    onUpdateOderByID: async ({ data, id }: any) => {
        console.log(data)
        return await Repository("PUT", url + `/${id}`, { params: {}, body: data })
    },
    getOderByID: async (id: string) => {
        return await Repository("GET", url + `/${id}`, { params: {}, body: {} })
    },

    returnOderByID: async (id: string) => {
        return await Repository("PUT", url + `/${id}`, { params: {}, body: {} })
    },
    getOderByUserID: async (id: string) => {
        return await Repository("GET", url + `/${id}/user`, { params: {}, body: {} })
    },
    onUpdateAcceptOderByID: async (id: string) => {
        return await Repository("PUT", url + `/accept/${id}`, { params: {}, body: {} })
    },

}
export default OderService