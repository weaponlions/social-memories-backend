import postModel from "../model/postModel.js";
import userModel from "../model/userModel.js";


export const createPost = async (req, res, next) => {
  try { 
    const user = await userModel.findById(req.userId);
    const data = {
      ...req.body,
      tags: req.body?.tags.split(","), 
      creator: user.name,
      owner: user._id,
    }; 
    const newPost = new postModel(data);
    await newPost.save(); 
    return res.status(201).json(newPost);
  } catch (err) { 
    console.log(req.body);
    console.log(err.message);
    return res.status(409).json({ message: err.message });
  }
};

export const updatePost = async (req, res, next) => {
  try { 
      const { postId } = req.params 

      const data = {
        ...req.body,
        tags: req.body["tags"].split(","), 
      };
      
      const newData = await postModel.findByIdAndUpdate({ _id: postId }, data, {
        new: true,
      }); 
      return res.status(203).json(newData); 
  } catch (err) { 
    console.log(req.body);
    console.log(err.message);
    res.status(409).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const id = req.params["id"];
    const newData = await postModel.findByIdAndRemove({ _id: id });
    return res.status(203).json(newData);
  } catch (err) {
    return res.status(409).json({ message: err.message });
  }
};

export const getPageWithSearch = async (req, res) => {
  try {
    // pagination
    const Limit = 6;
    const { page } = req.params ? req.params : 1;
    const start = (page - 1) * Limit;

    // search Query
    const title = req.params?.title ? req.params.title : "null";
    const tags = req.params?.tags ? req.params.tags : "null";
    const creator = req.params?.creator ? req.params.creator : "null";

    if (title != "null" || tags != "null" || creator != "null") {
      const query = new RegExp(title, "i");
      const count = await postModel
        .find({ $or: [{ title: query }, { tags: { $in: tags.split(",") } }, {creator: creator}] })
        .countDocuments();
      const totalPage = Math.ceil(count / Limit);
      const posts = await postModel
        .find({ $or: [{ title: query }, { tags: { $in: tags.split(",") } }, {creator: creator}] })
        .skip(start)
        .limit(Limit);
      if (posts == "")
        return res.status(200).json({ message: "No Record Found" });
      else
        return res
          .status(200)
          .json({
            totalPage: totalPage,
            currentPage: parseInt(page),
            data: posts,
          });
    } else {
      const count = await postModel.countDocuments();
      const totalPage = Math.ceil(count / Limit);
      const posts = await postModel
        .find()
        .sort({ _id: -1 })
        .skip(start)
        .limit(Limit);
      if (posts == "")
        return res.status(200).json({ message: "No Record Found" });
      else
        return res
          .status(200)
          .json({
            totalPage: totalPage,
            currentPage: parseInt(page),
            data: posts,
          });
    }
  } catch (err) {
    console.log(err);
    return res.status(503).json({ message: err });
  }
};

export const getSinglePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postModel.findById(id);
    if (post) {
      return res.status(200).json(post);
    }
    return res.status(400).json({ message: "Data Not Found" });
  } catch (err) {
    console.log(err);
    return res.status(403).json({ message: err.message });
  }
};
