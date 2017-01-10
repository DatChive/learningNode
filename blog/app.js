var express = require('express'),
    http = require('http'),
    path = require('path'),
    Post = require('./Post');

var app = express();

var validator = require('express-validator');

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(validator());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

// Render our home page with all blog posts
app.get('/', function (request, response) {
    //select/find all
    Post.find(function (err, posts) {
        if (err) {
            response.send(500, 'There was an error - tough luck.');
        }
        else {
            response.render('index', {
                posts: posts
            });
        }
    });
});

//make json
app.get('/posts.json', function (request, response) {
    // TODO: How do we get a list of all model objects using a mongoose model?
    Post.find(function (err, posts) {
        if (err) {
            response.send(500, {
                success: false
            });
        }
        else {
            response.send({
                success: true,
                posts: posts
            });
        }
    });
});

// nav to new blog post form
app.get('/new', function (request, response) {
    response.render('new', {});
});

// create a new blog post
app.post('/create', function (request, response) {

    //validation
    request.checkBody("title", "Please enter a non-empty title").notEmpty();
    request.checkBody("content", "Please enter content").notEmpty();

    var errors = request.validationErrors();

    if (errors) {
        response.send({
            errors
        });
    } else {
        var post = new Post({
            title: request.body.title,
            content: request.body.content
        });
        saveBlogPost(post, response);
    }
});

//Only blatantly displaying IDs while I learn.
app.get('/delete/:_id', function (request, response) {
    //create a generic post
    console.log(request.params._id);
    Post.find({"_id": request.params._id}).remove(function (err, post) {
        if (err) {
            response.send(500, {
                success: false
            });
        }
        else {
            response.redirect('/');
        }
    });
});

function saveBlogPost(post, response) {
    post.save(function (err, model) {
        if (err) {
            response.send(500, 'There was an error - tough luck.');
        }
        else {
            response.redirect('/');
        }
    });
}


//future

//create generic data
// app.post('/createGeneric', function (request, response) {
//     //create a generic post
//     var post = new Post({
//         title: "Generic",
//         content: "generic content"
//     });
//     saveBlogPost(post, response);
// });

//security
// var auth = express.basicAuth(function (username, password) {
//     return username === 'foo' && password === 'bar';
// });
