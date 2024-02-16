const DBConnection = require("../get_conn");

class Resumes_DAO {
    dbname = "Resumaker"
    collectionName = "resumes";

    async get_all_resume_ids(filter={}) {
        try {
            const client = await DBConnection.get();
            const collection = await client.db(this.dbname).collection(this.collectionName);
            const projection = { code: 0, name:0, tags:0, thumbnail:0}; 
            const result = await collection.find(filter, {projection}).toArray();
            return result;
        } catch (error) {
            throw error;
        }
    }
    async insert(data){
        try {
            const client = await DBConnection.get();
            const collection = await client.db(this.dbname).collection(this.collectionName);
            const result = await collection.insertOne(data);
            return result;
        } catch (error) {
            throw error;
        }
    }
    async get_resumes(filter={}) {
        try {
            const client = await DBConnection.get();
            const collection = await client.db(this.dbname).collection(this.collectionName);
            const projection = { code: 0 }; 
            const result = await collection.find(filter, {projection}).toArray();
            return result;
        } catch (error) {
            throw error;
        }
    }

    async get_resume(filter={}) {
        try {
            const client = await DBConnection.get();
            const collection = await client.db(this.dbname).collection(this.collectionName);
            const projection = { thumbnail: 0 }; 
            const result = await collection.findOne(filter, {projection});
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Resumes_DAO;


