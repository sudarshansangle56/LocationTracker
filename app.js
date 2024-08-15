
const express = require('express');
const app = express();

const http = require('http');
const path = require('path');

// Create server with express 
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

io.on("connection", (socket) => {
    socket.on("send-location", function(data){
           io.emit("receive-location", {id: socket.id, ...data})
    });
    console.log("A user connected");
    socket.on('disconnect', () => {
        io.emit("user-disconnected", socket.id);
        console.log('User disconnected');
    });

 
});

app.get("/", (req, res) => {
    res.render("index");
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
