const { Router } = require("express");
const User = require("../models/user")
const multer = require ("multer");
const path = require("path");

const router = Router();

const {
    handleUserSignin,
    handleUserSignup,
    handleUserSiginAuth,
    handleUserLogout,
    handleCreateUser,
    handleViewUserProfile,
    handleEditUserForm,
    handleUpdateUserById,
  
} = require("../controllers/user");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('./public/uploads/'));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  }
})

const upload = multer({ storage: storage }); 

router.route("/signin").get(handleUserSignin).post(handleUserSiginAuth);

router.route("/signup").get(handleUserSignup).post(upload.single("profileImage"), handleCreateUser);

router.route("/logout").get(handleUserLogout);

router.route("/:id").get(handleViewUserProfile).patch(upload.single("profileImage"), handleUpdateUserById);
router.route("/:id/edit").get(handleEditUserForm);






module.exports = router;