// //list all via json
// app.get('/posts.json', function (request, response) {
//     // TODO: How do we get a list of all model objects using a mongoose model?
//     Post.find(function (err, posts) {
//         if (err) {
//             response.send(500, {
//                 success: false
//             });
//         }
//         else {
//             response.send({
//                 success: true,
//                 posts: posts
//             });
//         }
//     });
// });

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