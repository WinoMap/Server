//Lets require/import the HTTP module
var http = require('http');
var util = require('util');
var qs = require('querystring');
var axios = require('axios');

//Lets define a port we want to listen to
const PORT=8079;
const API_URL = 'http://localhost:8042/pushWinos';

//We need a function which handles requests and send response
function handleRequest(request, response){

	response.writeHead(200, {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Credentials': 'true'
	});

    if(request.url == '/getWinos') {
        var options = {
            host: 'localhost',
            port: 8042,
            path: '/getWinos'
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
    } else if (request.url == '/pushWinos') {
        // We send receive then follow the data to the API

        // Receive
        var requestBody = '';
        request.on('data', function(data) {
            requestBody += data;
            if(requestBody.length > 1e7){
                response.writeHead(413, 'Request Entity Too Large', {'Content-Type': 'text/html'});
            }
        });

        request.on('end', function() {
            console.log('data received : '+requestBody);

            // Emit data to the API after reception completes
            // Should be by TCP protocol after testing
            axios.post(API_URL,
                requestBody, {
              headers: { 
                "Content-Type": "application/x-www-form-urlencoded"
              }
            }).then(function(response) {
                console.log(response);
            });

        });
    }
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
