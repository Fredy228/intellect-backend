import { Module } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';
import { Websocket2Gateway } from './websocket-2.gateway';
import { Websocket2Service } from './websocket-2.service';

@WebSocketGateway()
@Module({
  providers: [Websocket2Gateway, Websocket2Service],
})
export class Websocket2Module {}
