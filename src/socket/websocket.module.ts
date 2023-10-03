import { Module } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';
import { WebsocketGateway } from './websocket.gateway';
import { WebsocketService } from './websocket.service';

@WebSocketGateway()
@Module({
  providers: [WebsocketGateway, WebsocketService],
})
export class WebSocketModule {}
