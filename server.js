//Lets require/import the HTTP module
var http = require('http');
var util = require('util');

//Lets define a port we want to listen to
const PORT=8079;

//We need a function which handles requests and send response
function handleRequest(request, response){

	response.writeHead(200, {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Credentials': 'true'
	});

    // if(request.url == '/init/'){

    var options = {
        host: 'localhost',
        port: 8042,
        path: '/'
    };
    var callback = function(apiResponse) {
        var str = '';
        apiResponse.on('data', function(chunk) {
            str += chunk;
        });
        apiResponse.on('end', function(){
            response.write(str);
            response.end('');
        });
    }

    http.request(options, callback).end();
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Back-end on: http://localhost:%s", PORT);
});

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (text) {
	console.log('received data:', util.inspect(text));
});
