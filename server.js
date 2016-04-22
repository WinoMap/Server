//Lets require/import the HTTP module
var http = require('http');
var sleep = require('sleep');
var util = require('util');

//Lets define a port we want to listen to
const PORT=8042;
var value = [0,0];

var winos = [{
    id: 1,
    x:0,
    y:0,
    radius: 4,
    main: true
},
{
    id: 2,
    x:0,
    y:0,
    radius: 2,
    main: false
},
{
    id: 3,
    x:4,
    y:0,
    radius:4,
    main: false
},
{
    id: 4,
    x:0,
    y:4,
    radius: 4,
    main: false
}];

//We need a function which handles requests and send response
function handleRequest(request, response){

	response.writeHead(200, {
		'Access-Control-Allow-Origin': 'http://localhost:8080',
		'Access-Control-Allow-Credentials': 'true'
	});
	if(request.url == '/init/'){
		response.write(JSON.stringify(winos));
	}else{
		response.write('[' + value + ']');
	}
    response.end('');
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (text) {
	console.log('received data:', util.inspect(text));
	if(text == "\u001b\[A\n"){
		value[1] -= 1;
	}else if(text == "\u001b\[C\n"){
		value[0] += 1;
	}else if(text == "\u001b\[B\n"){
		value[1] += 1;
	}else if(text == "\u001b\[D\n"){
		value[0] -= 1;
	}else{
		value = JSON.parse(text);
	}
});
