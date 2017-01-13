var express = require('express'),
    http = require('http'),
    path = require('path'),
    Post = require('./Post'),
    crc32 = require('lighter-crc32');

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

// Render home page with all blog posts
app.get('/', function (request, response) {
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

// Nav to new blog post form
app.get('/newPost', function (request, response) {
    response.render('newPost', {});
});

// Create Post
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

// Read
app.get('/viewPost/:_id', function (request, response) {
    Post.findOne({"_id": request.params._id}, (function (err, post) {
        if (err) {
            response.send(500, {
                success: false
            });
        }
        else {
            response.render('postView', {
                post: post
            });
        }
    }));
});

// TODO: Update
//----

/// Delete
app.get('/delete/:_id', function (request, response) {
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

//generate shortened Url/Id
app.post('/api/shorten/:id', function (request, response) {
    var id = request.params.id;
    console.log("called shorten ID with: " + id)

    // check if url already exists in database
    Post.findOne({_id: id}, function (err, post) {
        //if it does
        if (post.shortId != null) {
            console.log("called shorten ID with: " + id)
        } else {
            //we need to generate a new short ID
            let shortId =  encode(post._id);
            post.shortId = shortId;
            post.shortUrl = 'http://localhost:3000/' + shortId

            // save the shortID
            post.save(function (err) {
                if (err) {
                    console.log(err);
                }

                response.redirect('/');
            });
        }
    });
});

app.get('/:encoded_id', function (request, response) {
    var encodedId = request.params.encoded_id;
    console.log("encoded: " + encodedId)
    // check if url already exists in database
    Post.findOne({shortId: encodedId}, function (err, post) {
        if (post) {
            // found an entry in the DB, redirect the user to their destination
            console.log("found");
            response.render('postView', {
                post: post
            });
        } else {
            console.log("not found");
            response.redirect('http://localhost:3000/');
        }
    });
});

function encode(num) {
    let val = crc32(num);
    console.log("hash is: " + val);
    return val;
}

