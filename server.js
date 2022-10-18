const express = require('express');
const app = express();
const server = require("http").createServer(app); // 서버 생성
const cors = require('cors'); // Cors 지정

const socketIo = require("socket.io")(server, {
    cors: {
        // 모든 도메인을 허락한다.
        origin: "*",
        method: ["GET","POST"],
    },
});
const socket = require('./src/socket');

app.set('port', process.env.PORT); // 포트 지정
app.use(cors({origin: process.env.FRONT_URL, credentials: true})); // cors 미들웨어 지정
socket(socketIo); // socket에 socketIo 모듈 전달

server.listen(app.get('port'), () => {
    console.log("포트 넘버 : "+app.get('port')+ "에서 실행 중");
});