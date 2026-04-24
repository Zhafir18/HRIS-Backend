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
    origin: (origin, callback) => {
        // Allow all origins to connect with credentials
        callback(null, true);
    },
    credentials: true,
  },
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      // Try to get token from handshake auth or cookies
      let token = client.handshake.auth?.token;
      
      if (!token) {
        // More robust cookie parsing
        const cookieHeader = client.handshake.headers.cookie;
        if (cookieHeader) {
          const tokenCookie = cookieHeader
            .split(';')
            .find(c => c.trim().startsWith('access_token='));
          
          if (tokenCookie) {
            token = tokenCookie.split('=')[1];
          }
        }
      }

      if (!token) {
        console.log(`[WS] Connection rejected: No token for client ${client.id}`);
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token);
      const userId = payload.id;

      // Join a room specific to this user
      const roomName = `user:${userId}`;
      await client.join(roomName);
      
      console.log(`[WS] SUCCESS: Client ${client.id} joined room ${roomName}`);
    } catch (err) {
      console.log(`[WS] ERROR: Connection rejected for client ${client.id}. Reason: ${err.message}`);
      client.disconnect();
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
