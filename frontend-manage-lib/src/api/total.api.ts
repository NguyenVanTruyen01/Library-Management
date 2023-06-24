import Repository from "../congfig/repository/RepositoryConfig"
const url = 'http://localhost:5000/api/v1/statistical'

const TotalService = {
    getAllTotal: async () => {
        return await Repository("GET", url, { params: {}, payload: {} })
    }
}
export default TotalService