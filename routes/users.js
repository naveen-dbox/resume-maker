var express = require('express');
var router = express.Router();
var csrf = require('csurf')
const jwt = require('jsonwebtoken');
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const path = require('node:path'); 

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.S3_REGION;
const Bucket = process.env.S3_BUCKET;
const token_secret = process.env.SECRET_TOKEN

const csrfProtect = csrf({cookie: {sameSite: "strict",httpOnly: true}})

const controller = require("../controllers/users.controller");

const verifyToken = (req, res, next) => {
    var token = req.cookies.token;
    if (token) {
      jwt.verify(token, token_secret, function (err, decoded) {
        if (err) {
          if (err.name === "TokenExpiredError") {
            console.log("auth token expired, redirecting to login");
            res.render("login", { csrfToken: req.csrfToken() });
          } else {
            res.status(403).send('Invalid token supplied');
          }
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      console.log("no auth token found, redirecting to login");
      res.render("login", { csrfToken: req.csrfToken() });
    }
};

const s3 = new S3Client({
  credentials: {
      accessKeyId: accessKeyId, // store it in .env file to keep it safe
      secretAccessKey: secretAccessKey
  },
  region: region 
})

const s3Storage =  multerS3({
    s3,
    bucket: Bucket,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read', 
    metadata: (req, file, cb) => {
        cb(null, {fieldname: file.fieldname})
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname);
    }
});

function sanitizeFile(file, cb) {
  const fileExts = [".png", ".jpg", ".jpeg"];

  const isAllowedExt = fileExts.includes(
      path.extname(file.originalname.toLowerCase())
  );

  const isAllowedMimeType = file.mimetype.startsWith("image/");

  if (isAllowedExt && isAllowedMimeType) {
      return cb(null, true);
  } else {
      cb("Error: File type not allowed!");
  }
}

const uploadImage = multer({
  storage: s3Storage,
  fileFilter: (req, file, callback) => {
      sanitizeFile(file, callback)
  },
  limits: {
      fileSize: 1024 * 1024 * 2 // 2mb file size
  }
})


router.get('/', csrfProtect, verifyToken, controller.base);
router.delete('/delete/:id', csrfProtect, verifyToken, controller.delete_id);
router.post('/signup', csrfProtect,verifyToken, controller.signup);
router.post('/upload_template', csrfProtect,verifyToken,uploadImage.single('image'), controller.upload_thumbnail);
router.post('/login', csrfProtect, controller.login);
router.put("/change_password",csrfProtect,verifyToken,controller.change_password);
router.post('/logout', controller.logout);
 
  
module.exports = router;
