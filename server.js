//Lets require/import the HTTP module
var http = require('http');
var util = require('util');

//Lets define a port we want to listen to
const PORT=8042;

var winos = [{
    id: 1,
    x:0,
    y:1,
    radius: {4: 3, 5:1.5},
    main: false
},
{
    id: 3,
    x:4,
    y:0,
    radius: {4: 6, 5: 3},
    main: false
},
{
    id: 8,
    x:0,
    y:4,
    radius: {4: 2, 5: 4},
    main: false
},
{
    id: 4,
    x:1,
    y:5,
    radius: {},
    main: true
},
{
    id: 5,
    x:6,
    y:3,
    radius: {},
    main: true
}];

//We need a function which handles requests and send response
function handleRequest(request, response){

	response.writeHead(200, {
		'Access-Control-Allow-Origin': 'http://localhost:8080',
		'Access-Control-Allow-Credentials': 'true'
	});/*
	if(request.url == '/init/'){*/
	response.write(JSON.stringify(winos));
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
		winos[0].radius['4'] -= 0.5;
	}else if(text == "\u001b\[C\n"){
		winos[0].radius['4'] += 0.5;
	}else if(text == "\u001b\[B\n"){
		winos[0].radius['4'] += 0.5;
	}else if(text == "\u001b\[D\n"){
		winos[0].radius['4'] -= 0.5;
	}
});
