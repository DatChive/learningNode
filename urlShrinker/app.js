var express = require('express'),
    http = require('http'),
    path = require('path'),
    Bitly = require('bitly');

var app = express();

let bitly = new Bitly('Access_Token_Goes_Here');

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

http.createServer(app).listen(app.get('port'), function () {
    console.log("Server listening on " + app.get('port'));
});

// render index
app.get('/', function (request, response) {
    response.render('index', {
        shortUrl: request.body.shortUrl
    });
});

//post SHORTEN to bitly api
app.post('/url', function (request, mainResponse) {
    bitly.shorten(request.body.url)
        .then(function (response) {
            var short_url = response.data.url
            // console.log(short_url);
            mainResponse.render('index', {
                shortUrl: short_url
            });
        }, function (error) {
            throw error;
        });
});