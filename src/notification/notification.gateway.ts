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
    origin: true,
    credentials: true,
  },
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedClients: Map<string, string[]> = new Map(); // userId -> socketIds[]

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      // Try to get token from handshake auth or cookies
      let token = client.handshake.auth?.token;
      
      if (!token) {
        // Fallback to cookies if available
        const cookieStr = client.handshake.headers.cookie;
        if (cookieStr) {
          const cookies = Object.fromEntries(cookieStr.split('; ').map(c => c.split('=')));
          token = cookies['access_token'];
        }
      }

      if (!token) {
        console.log(`Connection rejected: No token provided for client ${client.id}`);
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token);
      const userId = payload.id;

      if (!this.connectedClients.has(userId)) {
        this.connectedClients.set(userId, []);
      }
      this.connectedClients?.get(userId)?.push(client.id);
      
      console.log(`Client connected: ${client.id} (User: ${userId})`);
    } catch (err) {
      console.log(`Connection rejected: Invalid token for client ${client.id}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, sockets] of this.connectedClients.entries()) {
      const index = sockets.indexOf(client.id);
      if (index !== -1) {
        sockets.splice(index, 1);
        if (sockets.length === 0) {
          this.connectedClients.delete(userId);
        }
        break;
      }
    }
    console.log(`Client disconnected: ${client.id}`);
  }

  sendToUser(userId: string, data: any) {
    const socketIds = this.connectedClients.get(userId);
    if (socketIds) {
      socketIds.forEach((socketId) => {
        this.server.to(socketId).emit('notification', data);
      });
    }
  }
}
