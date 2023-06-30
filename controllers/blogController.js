import asyncHandler from 'express-async-handler'
import { Blog, BlogCategory } from "../model/Blog.js";
import slugify from '../utils/slugify.js'


// @desc    Auth category & get token
// @route   POST /api/categorys/login
// @access  Public
const createBlog = asyncHandler(async (req, res) => {
    const { 
        title,
        author,
        category,
        tags,
        content,
     } = req.body

    console.log(req.body)
    console.log(req.file)

    const blog = new Blog({
        title,
        author,
        category,
        tags,
        content,
        photo: req.file.fileUrl,
        slug: slugify(title)
    })

    let newBlog = await blog.save()

    return res.status(201).json({
        success: true,
        count: newBlog.length,
        data: newBlog
    });
})




// @desc    Auth category & get token
// @route   POST /api/categorys/login
// @access  Public
const createBlogCategory = asyncHandler(async (req, res) => {
    const blog = new BlogCategory({
        name: req.body.name
    })

    let newBlog = await blog.save()

    return res.status(201).json({
        success: true,
        count: newBlog.length,
        data: newBlog
    });
})




const updateBlog = asyncHandler(async (req, res) => {

    const { 
        title,
        author,
        category,
        tags,
        content
     } = req.body

    const blog = await Blog.findById(req.params.id)

    if(blog) {

        blog.category = category || blog.category ,
        blog.title = title || blog.title,
        blog.author = author || blog.author,
        blog.tags = tags || blog.tags,
        blog.content = content || blog.content,
        blog.photo = req.file && req.file.fileUrl || blog.photo,
        blog.updatedAt = Date.now() || blog.updatedAt,
        blog.slug = slugify(title) || blog.slug
        
        let updatedBlog = await blog.save()

        return res.status(201).json({
            success: true,
            data: updatedBlog
        });
    }

    res.status(404)
        throw new Error('Blog not found')
})


// @desc    Get all categories
// @route   GET /api/
// @access  Private/category
const getBlogs = asyncHandler(async (req, res) => {
    const blog = await Blog.find({})
    .populate({
        path: "category",
    })
    .sort({createdAt: -1})

    if(blog){
        return res.status(200).json({
            success: true,
            count: blog.length,
            data: blog
        });
    }

    res.status(200).res.json({})
})



const getSingeBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    .populate({
        path: "category",
        select: "_id name photo"
    })

    if(blog){
        return res.status(200).json({
            success: true,
            data: blog
        });
    } 

    res.status(404)
    throw new Error('Blog not found')

})


const getSingeBlogByName = asyncHandler(async (req, res) => {
    const blog = await Blog.find({slug : req.params.slug}).populate({
        path: "category",
        select: "_id name photo"
    })

    if(blog){
        return res.status(200).json({
            success: true,
            data: blog
        });
    } 

    res.status(404)
    throw new Error('Blog not found')

})


// @desc    Get all categories
// @route   GET /api/
// @access  Private/category
const getBlogCategory = asyncHandler(async (req, res) => {

    const blog = await BlogCategory
    .aggregate([
        {$lookup: {
            from: 'blogs', 
            localField: '_id', 
            foreignField: 'category', 
            as: 'blog'
        }}
    ])

    if(blog){
        return res.status(200).json({
            success: true,
            count: blog.length,
            data: blog
        });
    }

    res.status(404)
    throw new Error('No Category Found')
    // res.status(200).res.json({})
})


const deletBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id)

    if (blog) {
        await blog.remove()
        
        return res.status(200).json({
            success: true,
            message: 'blog deleted',
        });

    } 

    res.status(404)
    throw new Error('blog not found')
})


const commentBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id)

    if(blog){
        const newComment = {
            text: req.body.text,
            name: req.admin.name,
            admin: req.admin.id,
        };
    
        blog.comments.unshift(newComment);
    
        await blog.save();
    
        return res.status(201).json({
            success: true,
            data: blog.comments
        });
    }

    res.status(500)
    throw new Error('Server Error')
})


const commentBlogDelete = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id)

    const comment = blog.comments.find(comment => comment.id === req.params.comment_id)

    // Make sure comment exists
    if (!comment) {
        return res.status(404).json({ msg: 'Comment does not exist' });
    }

    // Check user
    if (comment.admin.toString() !== req.admin.id) {
        return res.status(401).json({ msg: 'User not authorized' });
    }


    blog.comments = blog.comments.filter(
        ({ id }) => id !== req.params.comment_id
    );

    await blog.save();
    

    return res.status(200).json({
        success: true,
        message: "Comment deleted",
        data: blog.comments
    });
})



const updateBlogComment = asyncHandler(async (req, res) => {

    const blog = await Blog.findOneAndUpdate(req.params.id)
    const comment = blog.comments.find(comment => comment.id === req.params.comment_id)

     // Make sure comment exists
     if (!comment) {
        return res.status(404).json({ msg: 'Comment does not exist' });
    }

    // Check user
    if (comment.admin.toString() !== req.admin.id) {
        return res.status(401).json({ msg: 'User not authorized' });
    }

    comment.text = req.body.text
    comment.updatedAt = Date.now()
    
    let updatedBlog = await blog.save()
    
    return res.status(200).json({
        success: true,
        message: "Comment Updated",
        data: updatedBlog
    });

})



const approveComment = asyncHandler(async (req, res) => {

    const blog = await Blog.findOneAndUpdate(req.params.id)
    const comment = blog.comments.find(comment => comment.id === req.params.comment_id)

     // Make sure comment exists
     if (!comment) {
        return res.status(404).json({ msg: 'Comment does not exist' });
    }

    // Check user
    if (comment.admin.toString() !== req.admin.id) {
        return res.status(401).json({ msg: 'User not authorized' });
    }

    comment.isApproved = req.body.isApproved
    
    let updatedBlog = await blog.save()

    return res.status(200).json({
        success: true,
        message: "Comment Approved",
        data: updatedBlog
    });
})


export {
    createBlog,
    getBlogs,
    deletBlog,
    commentBlog,
    commentBlogDelete,
    updateBlog,
    updateBlogComment,
    approveComment,
    createBlogCategory,
    getBlogCategory,
    getSingeBlog,
    getSingeBlogByName
}