const cloudinary = require("../config/cloudinary");
const Blog = require("../models/blog.model");
const Comment = require("../models/comment.model");
const Like = require("../models/like.model");

// Add Blog
const addBlog = async (req, res) => {
  try {
    const user = req.user;
    const { title, description, image } = req.body;

    const url = await cloudinary.uploader.upload(image, {
      folder: "blogs_data",
    });

    const blog = new Blog({
      title,
      description,
      image: url.secure_url,
      userId: user._id,
    });

    await blog.save();
    return res.status(201).json({ msg: "Blog added successfully" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// Edit Blog
const editBlog = async (req, res) => {
  try {
    const user = req.user;
    const { _id, title, description, image } = req.body;

    const blog = await Blog.findById(_id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });
    console.log(blog.userID, user._id);
    if (!blog.userId || blog.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    if (image !== blog.image) {
      const publicId = blog.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`blogs_data/${publicId}`);
      const upload = await cloudinary.uploader.upload(image, {
        folder: "blogs_data",
      });
      blog.image = upload.secure_url;
    }

    blog.title = title;
    blog.description = description;
    await blog.save();

    return res.status(200).json({ msg: "Blog updated successfully" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// Delete Blog
const deleteBlog = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });
    if (!blog.userId.toString() == user._id.toString())
      return res.status(403).json({ msg: "Unauthorized" });

    const publicId = blog.image.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`blogs_data/${publicId}`);

    await Blog.findByIdAndDelete(id);
    await Comment.deleteMany({ blogID: id });
    await Like.deleteMany({ blogID: id });

    return res.status(200).json({ msg: "Blog deleted successfully" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// Get My Blogs
const getMyBlogs = async (req, res) => {
  try {
    // Ensure that req.user is correctly populated with the logged-in user's data
    if (!req.user) {
      return res.status(400).json({ msg: "User not authenticated" });
    }

    const blogs = await Blog.find({ userId: req.user._id });

    if (!blogs.length) {
      return res.status(404).json({ msg: "No blogs found for this user" });
    }

    return res.status(200).json({ blogs });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// Get All Blogs
const allBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    return res.status(200).json({ blogs });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// Blog Details with Comments & Likes
const blogData = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ msg: "No blog found" });

    const comments = await Comment.find({ blogID: id });
    const likes = await Like.find({ blogID: id });

    return res
      .status(200)
      .json({ blogData: { ...blog._doc, comments, likes } });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// Check Ownership
const checkBlogOwnerShip = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      _id: req.params.blogId,
      userID: req.user._id,
    });
    return res.status(200).json({ valid: !!blog });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// Add Comment
const addComment = async (req, res) => {
  try {
    const user = req.user;
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "No blog found" });

    const newComment = new Comment({
      username: user.username,
      comment: req.body.comment,
      blogID: blog._id,
      userID: user._id,
    });

    await newComment.save();
    return res.status(200).json({ msg: "Comment added successfully" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// Total Comments
const totalComment = async (req, res) => {
  try {
    const blogs = await Blog.find({ userId: req.user._id });
    const ids = blogs.map((b) => b._id);
    const totalComments = await Comment.countDocuments({
      blogID: { $in: ids },
    });

    return res.status(200).json({ comments: totalComments });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// Like / Unlike Blog
const like = async (req, res) => {
  try {
    const user = req.user;
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "No blog found" });

    const existingLike = await Like.findOne({
      blogID: blog._id,
      userID: user._id,
    });
    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      return res.status(200).json({ msg: "Disliked" });
    }

    const newLike = new Like({ blogID: blog._id, userID: user._id });
    await newLike.save();
    return res.status(200).json({ msg: "Liked" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// Total Likes
const totalLikes = async (req, res) => {
  try {
    const blogs = await Blog.find({ userId: req.user._id });
    const ids = blogs.map((b) => b._id);
    const likes = await Like.countDocuments({ blogID: { $in: ids } });

    return res.status(200).json({ likes });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// Check if Liked
const checkLiked = async (req, res) => {
  try {
    const liked = await Like.findOne({
      blogID: req.params.id,
      userID: req.user._id,
    });
    return res.status(200).json({ liked: !!liked });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// Search Blogs
const search = async (req, res) => {
  try {
    const blogs = await Blog.find({
      title: { $regex: req.body.search, $options: "i" },
    });
    return res.status(200).json({ blogs });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  addBlog,
  deleteBlog,
  editBlog,
  getMyBlogs,
  allBlogs,
  blogData,
  checkBlogOwnerShip,
  addComment,
  like,
  checkLiked,
  totalComment,
  totalLikes,
  search,
};
