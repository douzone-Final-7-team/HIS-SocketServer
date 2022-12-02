const express = require("express");
const app = express();
const http = require("http");
const cors = require('cors');
const { Server } = require("socket.io"); // 소켓 아이오 내용을 담는 역할

app.use(cors());


const server = http.createServer(app);

//io는 코스 에러 해결 하기 위한 변수
const io = new Server(server, {
    cors: {
        //origin: "http://192.168.0.183:3000", // 서버와 통신할 클라인언트 주소
        origin: "http://localhost:3000",
        methods:["GET","POST"]
    }
})

// 소켓 io는 이벤트 감지하면서 반응을 하는데  아래는 connection이라는 id를 가진 이벤트를 감지하는 것
// 연결 될때마다 콜백 함수 를 호출해 콘솔 찍게 한다
io.on("connection", (socket)=>{
    console.log(`user Connected: ${socket.id}`);

    //join_room 이라는 id를 가진 이벤트를 감지해 join 메소드 시행
    socket.on("join_room", (data) => {
        //data 메개변수는 join_room 이벤트 발생시 프론트에서 넘어오는 data로
        //여기서는 방번호를 전달 해준다

        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);

    });

    //send_message라는 id를 가진 이벤트를 감지해 data를 받고
    socket.on("send_message", (data)=>{
       
        let changeStatData = data;
         //call_message id 를 가진 이벤트에 data를 방출
        socket.to(data.room).emit("call_message",changeStatData);
        socket.to(data.admission).emit("admissionOrder",changeStatData);
    })
    
    socket.on("send_emergencyMessage", (data)=>{
        let emergency = data;
        socket.to(data.room).emit("call_emergencyMessage",emergency);
    })   

    //sokect이 disconnect 이벤트를 감지하면 콘솔찍게함
    socket.on("disconnect",()=>{
        console.log("User Disconnected", socket.id);
    });
});




server.listen(3001, ()=> {
    console.log("SERVER RUNNING");
});
