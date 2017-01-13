var mongoose = require('mongoose');

// connection URL
mongoose.connect('mongodb:CONNECTION_STRING_HERE');

// create blog schema
var postSchema = mongoose.Schema({
    title:String,
    content:String,
    shortId:String,
    shortUrl:String
});

// create model object constructor
var Post = mongoose.model('Post', postSchema);

// expose model as Post
module.exports = Post;