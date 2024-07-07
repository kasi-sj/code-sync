const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const map = new Map();

io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  socket.on("join", (roomId, name, callback) => {
    socket.join((roomId + "").trim());
    socket.to((roomId + "").trim()).emit("newUserJoined",name);
    callback();
  });

  socket.on("create", (data, roomId) => {
    socket.to((roomId + "").trim()).emit("createRequest", data);
  });

  socket.on("offer", (data, roomId) => {
    socket.to((roomId + "").trim()).emit("offerRequest", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });

  socket.on("update" , (data , userId)=>{
    socket.to((userId+"").trim()).emit("updateResponse" , data);
  })

  socket.on("updateStructure" , (data , userId)=>{
    socket.to((userId+"").trim()).emit("updateStructureResponse" , data);
  })

  socket.on("fileStructure" , (data , socketId)=>{
    socket.to((socketId+"").trim()).emit("fileStructureResponse" , data);
  })

  socket.on("newUser" , (data , socketId)=>{
    socket.to((socketId+"").trim()).emit("newUserResponse" , data);
  })

  socket.on("rootServer" ,(userId , name ,cb)=>{
    console.log(userId , socket.id)
    map.set((userId+"") , (socket.id+""));
    cb(name+ " is set as root server");
  })

  socket.on("joinRemote",(remoteId , cb)=>{
    socket.join((remoteId+"").trim());
    cb("joined remote");
  })

  socket.on("joinFile",(remoteId)=>{
    socket.join((remoteId+"").trim());
  })

  socket.on("newUserRequestFiles" ,(remoteId)=>{
    const socketId = map.get((remoteId+"").trim());
    socket.to((socketId+"").trim()).emit("newUserJoined" , socket.id);
  })

  socket.on("openFileRequest",(remoteId,path)=>{
    const socketId = map.get((remoteId+"").trim());
    socket.to((socketId+"").trim()).emit("openFile" , path,  socket.id)
  })
  socket.on("invokeFn" , (type , obj , remoteId)=>{
    console.log(type , obj , remoteId);
    const socketId = map.get((remoteId+"").trim());
    socket.to((socketId+"").trim()).emit("invokeFnRequest" , type , obj);
  })

  socket.on("removeFile" , (data , userId)=>{
    socket.to((userId+"").trim()).emit("removeFileResponse" , data);
  })


  socket.on('clientChange' , (data)=>{
    const path = data.path;
    const remoteId = data.remoteId;
    const socketId = map.get((remoteId+"").trim());
    io.to((socketId+"").trim()).emit(`${path.trim()}-request`.trim() , data);
  })

  socket.on('serverChange' , (data)=>{
    console.log('serverChange' , data)
    const path = data.path;
    const remoteId = data.remoteId;
    io.to((path).trim()).emit(path+"-response" , data);
  })

  socket.on('newUserRequestFileData',(remoteId , path )=>{
    const socketId = map.get((remoteId+"").trim());
    io.to((socketId+"").trim()).emit(`${path}+newUser`  , socket.id );
  })

  socket.on('newUserFileDataResponse',(path,socketId,data)=>{
    io.to((socketId+"").trim()).emit(`${path}-response`  ,data);
  })

  socket.on('initialLoad' , (path,data)=>{
    io.to((path+"").trim()).emit((path).trim()+'-'+'response' , data);
  })
});

server.listen(3002, () => {
  console.log("listening on *:3002");
});
