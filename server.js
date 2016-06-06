//Lets require/import the HTTP module
var http = require('http');
var util = require('util');
var qs = require('querystring');
var axios = require('axios');

//Lets define a port we want to listen to
const PORT=8079;

var HOST = '192.168.77.231';
const PORT_API = '8080';
var URL = 'http://' + HOST + ':' + PORT_API;

//We need a function which handles requests and send response
function handleRequest(request, response){

	response.writeHead(200, {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Credentials': 'true'
	});

    if(request.url == '/getWinos') {
        //We send the datas to the client
        var options = {
            host: HOST,
            port: PORT_API,
            path: '/getWinos'
        };
        var callback = function(apiResponse) {
	    	var str = '';
			
			console.log('receiving');
			
			apiResponse.on('data', function(chunk) {
                str += chunk;
            });
            apiResponse.on('end', function(){
                response.write(str);
                response.end('');
            });
        }

	var request = http.request(options, callback);
	request.on('error', function(err) {
		console.log('error ' + URL );	
	});
	request.end();

    } else if (request.url == '/pushWinos') {
        // We receive datas then follow them to the API

        // Receive
        var requestBody = '';
        request.on('data', function(data) {
            requestBody += data;
            if(requestBody.length > 1e7){
                response.writeHead(413, 'Request Entity Too Large', {'Content-Type': 'text/html'});
            }
        });

        request.on('end', function() {
			var date = new Date();	
			var min = date.getMinutes();
			var sec = date.getSeconds();	
			console.log('['+min+']['+sec+']data received : '+requestBody);


			response.writeHead(200);
			response.end();

            // Emit data to the API after reception completes
            // Should be by TCP protocol after testing
		    axios.post(URL+'/pushWinos',
				requestBody, {
        	    	headers: { 
            	    	"Content-Type": "application/x-www-form-urlencoded"
              		}
            	}).then(function(response) {
                console.log(response);
            	});

        });
	} else if (request.url == '/pushState') {
		// We change the Back-End state depending of what we receive
		var requestBody = '';
		request.on('data', function(data) {
			requestBody += data;
			if(requestBody.length > 1e7){
				response.writeHead(413, 'request Entity Too Large', {'Content-Type': 'text/html'});
			}
		});

		request.on('end', function() {
			console.log('data received : '+requestBody);
			var datas = JSON.parse(requestBody);		
			HOST = datas.ip;
			URL = 'http://' + HOST + ':' + PORT_API;
			
			response.writeHead(200);

		});
	response.end();
	}
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Back-end on:"+URL);
});

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (text) {
	console.log('received data:', util.inspect(text));
});
