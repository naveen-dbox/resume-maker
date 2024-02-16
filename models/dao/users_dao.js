const DBConnection = require("../get_conn");

class UsersDAO {
    dbname = "Resumaker"
    collectionName = "users";

    async read(filter={}) {
        try {
            const client = await DBConnection.get();
            const collection = await client.db(this.dbname).collection(this.collectionName);
            const result = await collection.findOne(filter);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async insert(user) {
        try {
            const client = await DBConnection.get();
            const collection = client.db(this.dbname).collection(this.collectionName);
            const result = await collection.insertOne(user);
            return result
        } catch (error) {
            throw error;
        }
    }

    async update(filter,new_user) {
        try {
            const client = await DBConnection.get();
            const collection = client.db(this.dbname).collection(this.collectionName);
            const result = await collection.updateOne(filter,new_user);
            return result
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UsersDAO;


