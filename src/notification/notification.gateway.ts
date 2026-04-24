import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    console.log(`[WS] Incoming connection request from client: ${client.id}`);
    try {
      // Try to get token from handshake auth or cookies
      let token = client.handshake.auth?.token;
      console.log(`[WS] Token received from auth: ${token ? 'YES' : 'NO'}`);
      
      if (!token) {
        // More robust cookie parsing
        const cookieHeader = client.handshake.headers.cookie;
        console.log(`[WS] Cookie header present: ${cookieHeader ? 'YES' : 'NO'}`);
        if (cookieHeader) {
          const tokenCookie = cookieHeader
            .split(';')
            .find(c => c.trim().startsWith('access_token='));
          
          if (tokenCookie) {
            token = tokenCookie.split('=')[1];
            console.log(`[WS] Token found in cookies: YES`);
          }
        }
      }

      if (!token) {
        console.log(`[WS] WARNING: No token found for client ${client.id}, staying connected for debug.`);
      } else {
        try {
          const payload = await this.jwtService.verifyAsync(token);
          const userId = payload.id;

          const roomName = `user:${userId}`;
          await client.join(roomName);
          console.log(`[WS] SUCCESS: Client ${client.id} joined room ${roomName}`);
        } catch (jwtErr) {
          console.log(`[WS] WARNING: Invalid token for client ${client.id}: ${jwtErr.message}`);
        }
      }
    } catch (err) {
      console.log(`[WS] CRITICAL ERROR during handleConnection: ${err.message}`);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`[WS] DISCONNECT: Client ${client.id}`);
  }

  sendToUser(userId: string, data: any) {
    const roomName = `user:${userId}`;
    this.server.to(roomName).emit('notification', data);
    console.log(`[WS] EMIT: Sent notification to ${roomName}. Data title: ${data.title}`);
  }
}
