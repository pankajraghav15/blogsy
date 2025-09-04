const { Router } = require ("express");
const multer = require ("multer");
const path = require("path");
const { upload } = require("../config/cloudinary");

const router = Router();
const {
  handleAddBlog,
    handleViewBlog,
    handleCreatedBy,
    handleCreateComment,
    handleCreateBlog,
} = require("../controllers/blog.js");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.resolve('./public/uploads/'));
//   },
//   filename: function (req, file, cb) {
//     const fileName = `${Date.now()}-${file.originalname}`;
//     cb(null, fileName);
//   }
// })

// const upload = multer({ storage: storage });


router.route("/add-new").get(handleAddBlog);

router.route("/viewBlogs").get(handleViewBlog);

router.route('/:id').get(handleCreatedBy);

router.route('/comment/:blogId').post(handleCreateComment);

router.route("/").post(upload.single("coverImage"), handleCreateBlog);



module.exports = router;