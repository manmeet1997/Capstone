// models/News.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  username: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  author: {
    type: String,
    required: false,
  },
  url: {
    type: String,
    required: false,
  },
  ID: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: false,
  },
  content: {
    type: String,
    required: false,
  },
  summary: {
    type: String,
    required: false,
  },
  urlToImage: {
    type: String, // Assuming the image will be stored as a base64 string
    required: false,
  },
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  comments: [commentSchema], // Array of comments using the commentSchema
});

const News = mongoose.model('News', newsSchema);

module.exports = News;