require('dotenv').config();
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import EVENTS from './events';
const PORT = Number(process.env.SOCKET_PORT) || 8000;


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        credentials: true
    }
});

let rooms: string[] = []

let users: object[] = []

io.on("connection", (socket) => {
    console.log(`User connected ${socket.id}`)
    socket.on(EVENTS.CLIENT.CREATE_OR_JOIN_ROOM, ({ roomName, userRole }) => {
        if (!rooms.includes(roomName)) {
            rooms.push(roomName);
        }
        users.push({
            id: socket.id,
            role: userRole
        });
        //привязка к комнате
        socket.join(roomName);
        // пользователь зашел в комнату
        socket.broadcast.to(roomName).emit(EVENTS.SERVER.JOINED_ROOM, `Пользователь ${socket.id} присоеденился к группе ${roomName}`)
    })

    /* Отправка сообщения пользователя в комнату */
    socket.on(EVENTS.CLIENT.SEND_ROOM_MESSAGE, ({ roomName, message }) => {
        socket.to(roomName).emit(EVENTS.SERVER.ROOM_MESSAGE, message)
    })
});

httpServer.listen(PORT, () => {
    console.log('Server is listening');
});