var app = require('express')();
var mqtt = require('mqtt');
const express=require('express');
const path=require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var client  = mqtt.connect('mqtt://broker.hivemq.com:1883')
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://nebras4db:ab094724385@cluster0.wxkxein.mongodb.net/?retryWrites=true&w=majority";

client.on('connect', function () {
    client.subscribe('presence2121') ;
        //console.log("Client has sub ok");
});
client.on('message', function (topic,message) {
    //console.log(message.toString());
	var toInt = parseInt(message);
	if(toInt!="-1"){io.emit('slider1', toInt);
				      	io.emit('slider2', toInt);
                io.emit('slider3', toInt);
          //
          MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("dbname");
              dbo.collection("cats").insertOne({date_: new Date(), value: toInt }); //creat collection
            });
            //
          }      
});
app.use('/assets', express.static('assets'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
io.on('connection', function(socket){
	
  socket.on('slider1', function(msg){
    if(msg!="")//io.emit('slider1', msg);
    client.publish('presence2121',""+msg);
  });
  socket.on('slider2', function(msg){
    if(msg!=""){
      client.publish('presence2121',""+msg);
      //io.emit('slider2', msg);
  }});
  socket.on('slider3', function(msg){
    if(msg!="")//io.emit('slider3', msg);
    client.publish('presence2121',""+msg);
  });
});
http.listen(port, function(){
  console.log('listening on *:' + port);
});
