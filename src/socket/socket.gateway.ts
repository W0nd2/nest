import { ConnectedSocket, MessageBody, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway(
    8000, 
    { 
        namespace: '/chat',
        cors: {credentials: true}
    }
)
export class SocketGateway implements OnGatewayInit{
    
    @WebSocketServer()
    socket:Server;

    afterInit(server: any) {
        console.log('Started');
    }

    @SubscribeMessage('chatToServer')
    sendMessage(@ConnectedSocket() client: Socket, @MessageBody() message:{roomName:string, message: string}): void {
        this.socket.emit('chatToClient', message.message);
    }

    @SubscribeMessage('joinRoom')
    JoinRoom(@ConnectedSocket() client: Socket, @MessageBody() room:string){
        client.join(room);
        this.socket.emit('joinedRoom', 'Новый пользователь присоеденился к группе');
    }
  
    @SubscribeMessage('leaveRoom')
    leaveRoom(@ConnectedSocket() client: Socket, @MessageBody() room:string){
        client.leave(room);
        client.emit('leftRoom', room);
    }
}