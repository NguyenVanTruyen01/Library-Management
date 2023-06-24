import mongoose from "mongoose"

let bucket;

export const ConnectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://hongduc:12345@managelib.at5x6jq.mongodb.net/?retryWrites=true&w=majority`, (err) => {
            if (err) throw err
            let db = mongoose.connections[0].db;
            bucket = new mongoose.mongo.GridFSBucket(db, {
                bucketName: "newBucket"
            });
            console.log('mongodb connection success!!!')
        })
    } catch (e) {
        console.log('mongodb connection fails')
    }
}