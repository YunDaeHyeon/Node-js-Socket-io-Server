/*
    💡 Event List
    "JOIN_ROOM" : 유저가 방을 참가했을 떄           -> 이벤트 리스너
    "UPDATE_NICKNAME" : 유저가 닉네임을 변경했을 때  -> 이벤트 리스너
    "SEND_MESSAGE" : 유저가 메시지를 전송했을 때     -> 이벤트 리스너
    "RECEVIE_MESSAGE" : 유저가 메시지를 받을 때     -> 클라이언트에게 보내는 용도 (emit)
*/
const SOCKET_EVENT = {
    JOIN_ROOM : "JOIN_ROOM",
    UPDATE_NICKNAME : "UPDATE_NICKNAME",
    SEND_MESSAGE : "SEND_MESSAGE",
    ROOM_EXIT : "ROOM_EXIT",
    RECEIVE_MESSAGE : "RECEIVE_MESSAGE",
};

module.exports = function(socketIo){
    socketIo.on("connection", function(socket){
        // 클라이언트와 연결이 성공되었을 시
        console.log("socket connection success");

        const roomName = "room 1";
        /*
            1. 클라이언트에서 JOIN_ROOM이라는 이벤트 타입으로 데이터를 소켓 서버로 전달
            2. 소켓 서버는 데이터를 받아 CallBack 함수 실행
            3. 콜백 함수에는 RECEIVE_MESSAGE 이벤트를 emit시킴. (클라이언트에 이벤트 전달)
            4. 클라이언트에서도 RECEIVE_MESSAGE 이벤트 리스너를 통해 콜백함수 실행
            즉, 방에 처음 참가한 유저는 room 1에 할당 -> 이벤트 타입과 함께 받은 데이터를 가공 후 응답해줄 데이터 생성 ->
            클라이언트에 RECEIVE 이벤트 emit -> 클라이언트에 응답해준 이벤트와 데이터 로그에 뿌리기
        */

        console.log(socketIo.of("/").sockets);
        Object.keys(SOCKET_EVENT).forEach(typeKey => {
            const type = SOCKET_EVENT[typeKey];
            socket.on(type, requestData => {
                const firstVisit = type === SOCKET_EVENT.JOIN_ROOM;
                // 방에 처음 참가한 유저는 room 1에 할당 / socket.nickname 설정
                if(firstVisit){
                    socket.nickname = requestData.nickname;
                    console.log("socketIo 객체 : ",socket.id);
                    console.log("socketIo의 socket size : ",socketIo.of("/").sockets.size);
                    console.log("socketIo의 socket id : ",socketIo.of("/").sockets.id);
                    console.log("socketIo의 rooms : ",socketIo.of("/").sockets.rooms);
                    socket.join(roomName);
                }

                console.log("소켓 닉네임 : ", socket.nickname);
    
                const responseData = {
                    ...requestData,
                    type,
                    time : new Date(),
                };
                socketIo.to(roomName).emit(SOCKET_EVENT.RECEIVE_MESSAGE, responseData);
                console.log(`${type} is fired with data : ${JSON.stringify(responseData)}`);
            });
        });

        // 클라이언트와 연결이 끊어질 때
        socket.on("disconnect", reason => {
            console.log(`disconnect : ${reason}`);
        });
    });
}