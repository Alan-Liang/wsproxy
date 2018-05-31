/*
@code-style really bad
@author Alan-Liang
*/

var ws=require("ws");
var net=require("net");

var wsLoc="wss://my.proxy.net/",
	port=8888;

var server = net.createServer(function(socket){
	try{
	var msg="";
	var open=false;
	var c=new ws(wsLoc);
	c.addEventListener("open",function(){
 		if(msg)c.send(msg);
 		open=true;
	});
	c.addEventListener("message",function(d){
		try{
 	 	socket.write(d.data);
 	 	console.log("data in",d.data);
 	}catch(e){}
	});
	socket.on('data',function(d){
		try{
			if(open)
				c.send(d);
			else msg+=d;
		}catch(e){}
	});
	c.addEventListener("error",function(e){
		console.log("c",e.stack);
		try{
			socket.close();
			c.close();
		}catch(e){}
	});
	c.addEventListener("close",function(){
		try{
			socket.end();
		}catch(e){}
	});
	socket.on('error',function(e){
		console.log("sock",e.stack);
		try{
			socket.end();
			c.close();
		}catch(e){}
	});
	}catch(e){
		console.log("listener",e.stack);
	}
});
server.on("error",function(e){
	console.log("server",e.stack);
});
server.listen(port, function(){
	console.log("Server OK.");
});
