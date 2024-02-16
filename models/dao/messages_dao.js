const DBConnection = require("../get_conn");

class MessagesDAO {
    dbname = "Resumaker"
    collectionName = "messages";

    async insert(document) {
        try {
            const client = await DBConnection.get();
            const collection = client.db(this.dbname).collection(this.collectionName);
            const result = await collection.insertOne(document);
            return result
        } catch (error) {
            throw error;
        }
    }

    async getAllMessages() {
        try {
            const client = await DBConnection.get();
            const collection = client.db(this.dbname).collection(this.collectionName);
            const result = await collection.find().toArray();
            return result;
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

module.exports = MessagesDAO;


