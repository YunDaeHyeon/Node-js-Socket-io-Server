/*
    ๐ก Event List
    "JOIN_ROOM" : ์ ์ ๊ฐ ๋ฐฉ์ ์ฐธ๊ฐํ์ ๋           -> ์ด๋ฒคํธ ๋ฆฌ์ค๋
    "UPDATE_NICKNAME" : ์ ์ ๊ฐ ๋๋ค์์ ๋ณ๊ฒฝํ์ ๋  -> ์ด๋ฒคํธ ๋ฆฌ์ค๋
    "SEND_MESSAGE" : ์ ์ ๊ฐ ๋ฉ์์ง๋ฅผ ์ ์กํ์ ๋     -> ์ด๋ฒคํธ ๋ฆฌ์ค๋
    "RECEVIE_MESSAGE" : ์ ์ ๊ฐ ๋ฉ์์ง๋ฅผ ๋ฐ์ ๋     -> ํด๋ผ์ด์ธํธ์๊ฒ ๋ณด๋ด๋ ์ฉ๋ (emit)
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
        // ํด๋ผ์ด์ธํธ์ ์ฐ๊ฒฐ์ด ์ฑ๊ณต๋์์ ์
        console.log("socket connection success");

        const roomName = "room 1";
        /*
            1. ํด๋ผ์ด์ธํธ์์ JOIN_ROOM์ด๋ผ๋ ์ด๋ฒคํธ ํ์์ผ๋ก ๋ฐ์ดํฐ๋ฅผ ์์ผ ์๋ฒ๋ก ์ ๋ฌ
            2. ์์ผ ์๋ฒ๋ ๋ฐ์ดํฐ๋ฅผ ๋ฐ์ CallBack ํจ์ ์คํ
            3. ์ฝ๋ฐฑ ํจ์์๋ RECEIVE_MESSAGE ์ด๋ฒคํธ๋ฅผ emit์ํด. (ํด๋ผ์ด์ธํธ์ ์ด๋ฒคํธ ์ ๋ฌ)
            4. ํด๋ผ์ด์ธํธ์์๋ RECEIVE_MESSAGE ์ด๋ฒคํธ ๋ฆฌ์ค๋๋ฅผ ํตํด ์ฝ๋ฐฑํจ์ ์คํ
            ์ฆ, ๋ฐฉ์ ์ฒ์ ์ฐธ๊ฐํ ์ ์ ๋ room 1์ ํ ๋น -> ์ด๋ฒคํธ ํ์๊ณผ ํจ๊ป ๋ฐ์ ๋ฐ์ดํฐ๋ฅผ ๊ฐ๊ณต ํ ์๋ตํด์ค ๋ฐ์ดํฐ ์์ฑ ->
            ํด๋ผ์ด์ธํธ์ RECEIVE ์ด๋ฒคํธ emit -> ํด๋ผ์ด์ธํธ์ ์๋ตํด์ค ์ด๋ฒคํธ์ ๋ฐ์ดํฐ ๋ก๊ทธ์ ๋ฟ๋ฆฌ๊ธฐ
        */

        // ์ ์์ค์ธ ์ฌ์ฉ์ List
        const getJoinUserList = async() => {
            try{
                const sockets = await socketIo.in(roomName).fetchSockets();
                const joinUserList = [];
                for(const socket of sockets){
                    joinUserList.push(socket.data.username);
                }
                return joinUserList;   
            }catch(error){
                return error;
            }
        }

        Object.keys(SOCKET_EVENT).forEach(typeKey => {
            const type = SOCKET_EVENT[typeKey];
            socket.on(type, requestData => {
                const firstVisit = type === SOCKET_EVENT.JOIN_ROOM;
                const updateName = type === SOCKET_EVENT.UPDATE_NICKNAME;
                const sendMessage = type === SOCKET_EVENT.SEND_MESSAGE;
                const roomLeave = type === SOCKET_EVENT.ROOM_EXIT;
                let responseData = {
                    ...requestData,
                    type,
                    time : new Date(),
                };

                // ๋ฐฉ์ ์ฒ์ ์ฐธ๊ฐํ ์ ์ ๋ room 1์ ํ ๋น / socket.nickname ์ค์ 
                if(firstVisit){
                    // ํด๋ผ์ด์ธํธ์์ input์ผ๋ก ๋์ด์จ ๋๋ค์(requestData.nickname)์ ์์ผ์ username์ผ๋ก ์ค์ (socket.data.username)
                    socket.data.username = requestData.nickname;
                    socket.join(roomName);
                } // const sockets = await io.in("room1").fetchSockets();

                // ๋๋ค์ ์๋ฐ์ดํธ
                if(updateName){
                    socket.data.username = requestData.nickname; // socket์ ๊ธฐ์กด ๋๋ค์์ ์๋ก์ด ๋๋ค์์ผ๋ก ๋ณ๊ฒฝ
                }

                // ๋ฐฉ์ ๋ ๋ ์ ์ ๋ leave ์ฒ๋ฆฌ
                if(roomLeave){
                    socket.leave(roomName);
                }

                getJoinUserList().then(value => {
                    // SENDMESSAGE๋ฅผ ์ ์ธํ ๋ชจ๋  ์ด๋ฒคํธ(์์ฅ, ์ด๋ฆ ๋ณ๊ฒฝ, ํด์ฅ)๋ ํ์ฌ room์ ์กด์ฌํ๋ ๋ชจ๋  socket ๋ฐ์ดํฐ๋ฅผ ์ ์กํ๋ค.
                    if(!sendMessage){
                        responseData = {
                            ...requestData,
                            joinUserList : value,
                            type,
                            time : new Date(),
                        };
                    }
                    socketIo.to(roomName).emit(SOCKET_EVENT.RECEIVE_MESSAGE, responseData);
                    console.log(`${type} is fired with data : ${JSON.stringify(responseData)}`);
                });
            });
        });

        // ํด๋ผ์ด์ธํธ์ ์ฐ๊ฒฐ์ด ๋์ด์ง ๋
        socket.on("disconnect", reason => {
            console.log(`disconnect : ${reason}`);
        });
    });
}