const { ObjectId } = require("mongodb")
const MessagesDAO = require("../models/dao/messages_dao");
const UsersDAO = require("../models/dao/users_dao");
const SaltsDAO = require("../models/dao/salt_dao");
const Resumes_DAO = require("../models/dao/resumes_dao")
const utils = require("../utils/auth");
const jwt = require('jsonwebtoken');


const messages_dao = new MessagesDAO();
const users_dao = new UsersDAO();
const salts_dao = new SaltsDAO();
const resumes_dao = new Resumes_DAO();

const token_secret = process.env.SECRET_TOKEN

async function delete_message(message_id){
  const response = await messages_dao.delete({"_id":new ObjectId(message_id)});
  return response;
}

async function user_exists(username){
  try {
    const user = await users_dao.read({"username": username});
    return !!user;
  } catch (error) {
    throw error;
  }
}

async function upload_resume_template(request_body, public_url) {
    try {
        const tagsArray = request_body.tags.split(/[,\s]+/);
        const data = {
            name: request_body.name,
            tags: tagsArray,
            code: request_body.code,
            thumbnail: public_url
        };
        const result = await resumes_dao.insert(data);
        if(result.insertedId == null || result.insertedId == undefined){
            return false;
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

exports.base = async (req, res) => {
    const messages = await messages_dao.getAllMessages();
    res.render("admin",{messages: messages, csrfToken: req.csrfToken(),
                    username: req.decoded.username})
}

exports.delete_id = async (req, res) => {
    const response = await delete_message(req.params.id);
    if(response.deletedCount==0){
      res.sendStatus(403);
    }
    res.sendStatus(200);
}

exports.upload_thumbnail = async (req, res) => {
    try{
        await upload_resume_template(req.body , req.file.location)
        res.sendStatus(200);
    }
    catch(e){
        res.sendStatus(401);
    }
}

exports.signup = async (req, res) => {
  let {username, email, password} = req.body;
  try {
      if(await user_exists(username)) {
          return res.status(409).send('User already exists!');
      }
      
      let new_salt = utils.generateSalt();
      await salts_dao.insert({"username": username, "salt": new_salt});

      let userData = {
          username: username,
          password: await utils.hashPassword(password + new_salt),
          email: email,
          is_admin: true,
          created_by:req.decoded.username
      };

      await users_dao.insert(userData);

      res.status(200).send('User registered successfully!');
  } catch (error) {
      if (new_salt) {
          try {
              await salts_dao.delete({"username": username});
          } catch (deleteError) {
              console.error("Error deleting salt:", deleteError);
          }
      }
      console.error("Error in signup:", error);
      res.status(500).send('Internal Server Error');
  }
};

exports.login = async (req, res) => {
  let { username, password } = req.body;
  try {
      const userData = await users_dao.read({ username: username });
      if (userData) {
          const userSaltData = await salts_dao.read({ username: username });
          if (!userSaltData) {
              return res.status(401).send('User not created properly,create again');
          }
          const salt  = userSaltData.salt;
          let passwordCheck = await utils.compareHash(password+salt,userData.password);
          if (passwordCheck) {
              const payload = {
                  email: userData.email,
                  username: userData.username,
                  id: userData._id
              };
              const expiry_time = "1h";
              let token = jwt.sign(payload, token_secret, {expiresIn: expiry_time});
              res.cookie("token",token, {withCredentials:true, httpOnly: true, sameSite:"strict"})
              res.status(200).send()
              return;
          } else {
              res.status(401).send('Incorrect password');
              return;
          }
      } else {
          res.status(401).send('Invalid login credentials');
          return;
      }
  } catch (error) {
      console.error("Error in login:", error);
      res.status(500).send('Internal Server Error');
  }
};


exports.change_password = async (req, res) => {
    try {
        let { password } = req.body;
        const username = req.decoded.username;

        const userSaltData = await salts_dao.read({ username: username });
        const salt  = userSaltData.salt;
        password = await utils.hashPassword(password + salt);

        const filter = { username: username };
        const new_user = { $set: { password: password } };
        const result = await users_dao.update(filter, new_user);
        if (result.modifiedCount === 1) {
            res.status(200).json({ message: 'Password changed successfully.' });
        } else {
            res.status(404).json({ message: 'User not found. Please try again after some time' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.clearCookie('_csrf');
    res.sendStatus(200);
}