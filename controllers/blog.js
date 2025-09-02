const Blog = require("../models/blog");
const Comment = require("../models/comment");

const handleAddBlog = (req,res)=>{
    return res.render("addBlog", {
        user: req.user,
    });
};

const handleViewBlog = async (req,res)=>{
  try {
    const allBlogs = await Blog.find({});
    res.render("viewBlogs", {
      blogs: allBlogs,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).send("Error fetching blogs");
  };
    
};

const handleCreatedBy = async(req, res)=>{
  
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId:req.params.id }).populate("createdBy");
  console.log("comments", comments);
  console.log("blog", blog)
  return res.render("blog", {
    user:req.user,
    blog,
    comments,
  });
};

const handleCreateComment = async (req, res)=>{
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
};


const handleCreateBlog =  async (req,res)=>{
  console.log("req.user in POST /:", req.user)
  const { title, body } = req.body;
  const blog = await Blog.create({
    body,
    title,
    createdBy: req.user._id,
    coverImageURL:`/uploads/${req.file.filename}`,
  });

   return res.redirect(`/blog/${blog._id}`);
};

module.exports = {
    handleAddBlog,
    handleViewBlog,
    handleCreatedBy,
    handleCreateComment,
    handleCreateBlog,
};