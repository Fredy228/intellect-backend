import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { version, validate } from 'uuid';

import { Websocket2Service } from './websocket-2.service';
import { Actions } from '../enums/socket/actions';

@WebSocketGateway()
export class Websocket2Gateway {
  @WebSocketServer() server: Server;
  constructor(private readonly websocketService: Websocket2Service) {}

  handleConnection() {
    // Логика, выполняемая при установлении соединения
    console.log('Socket connected');
  }

  handleDisconnect() {
    // Логика, выполняемая при разрыве соединения

    console.log('Socket disconnect');
  }
}
