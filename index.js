const express = require('express');
const app = express();
const server = require("http").createServer(app); // 서버 생성
const cors = require('cors'); // Cors 지정
const PORT = process.env.PORT || 3000;

const socketIo = require("socket.io")(server, {
    cors: {
        origin: "*",
        method: ["GET","POST"],
    },
});
const socket = require('./src/socket/socket');

app.use(cors()); // cors 미들웨어 지정
socket(socketIo); // socket에 socketIo 모듈 전달

server.listen(PORT, () => {
    console.log("포트 넘버 : "+app.get('port')+ "에서 실행 중");
});