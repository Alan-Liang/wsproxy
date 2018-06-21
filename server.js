/*
@code-style really bad
@author Alan-Liang
partly adaped from a script on the internet
*/

var http=require("http");
var net=require("net");
var url=require("url");
var ws=require("ws");

var port=process.env.PORT||80,addr="0.0.0.0";

function request(req,resp){
	var _url=url.parse(req.url);
	var options={
		hostname:_url.hostname,
		port:_url.port||80,
		path:_url.path,
		method:req.method,
		headers:req.headers
	};
	var c=http.request(options, function(data) {
		resp.writeHead(data.statusCode,data.headers);
		data.pipe(resp);
	}).on("error",function(e){
		res.end();
	});
	req.pipe(c);
}

function connect(req,socket){
	var u=url.parse("http://"+req.url);
	var c=net.connect(u.port,u.hostname,function(){
		socket.write("HTTP/1.1 200 Connection Established\r\n\r\n");
		c.pipe(socket);
	}).on("error",function(e){
		socket.end();
	});
	socket.pipe(c);
}

var s=http.createServer();
s.on("request",request);
s.on("connect",connect);
s.listen(port,addr);

var wss=new ws.Server({server:s});
wss.on("connection",function(wsl,req){
	var open,msg="";
	var c=net.createConnection(port,addr,function(){
		open=true;
		if(msg)c.write(msg);
		c.on("data",function(d){
			try{
				wsl.send(d);
			}catch(e){}
		});
		c.on("close",function(){
			try{
				wsl.close(1000,"normal")
			}catch(e){}
		});
	});
	wsl.addEventListener("message",function(d){
		if(open)
			try{
				c.write(d.data);
			}catch(e){}
		else msg+=d.data;
	});
});
