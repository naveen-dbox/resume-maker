const DBConnection = require("../get_conn");

class SaltsDAO {
    dbname = "secrets"
    collectionName = "salts";

    async read(filter) {
        try {
            const client = await DBConnection.get();
            const collection = client.db(this.dbname).collection(this.collectionName);
            const result = await collection.findOne(filter);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async insert(salt) {
        try {
            const client = await DBConnection.get();
            const collection = client.db(this.dbname).collection(this.collectionName);
            const result = await collection.insertOne(salt);
            return result
        } catch (error) {
            throw error;
        }
    }

    async delete(filter) {
        try {
            const client = await DBConnection.get();
            const collection = client.db(this.dbname).collection(this.collectionName);
            const result = await collection.deleteOne(filter);
            return result;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = SaltsDAO;