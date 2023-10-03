import { Module } from '@nestjs/common';
import { ConferenceModule } from './controllers/conference/conference.module';
import { WebSocketModule } from './socket/websocket.module';

@Module({
  imports: [WebSocketModule, ConferenceModule],
  providers: [],
})
export class MainModule {}
