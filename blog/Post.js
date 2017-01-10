var mongoose = require('mongoose');

// connection URL
mongoose.connect('mongodb://USER:PASS@hostID.mlab.com:port/dbName');

// create blog schema
var postSchema = mongoose.Schema({
    title:String,
    content:String
});

// create model object constructor
var Post = mongoose.model('Post', postSchema);

// expose model as Post
module.exports = Post;