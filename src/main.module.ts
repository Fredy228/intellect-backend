import { Module } from '@nestjs/common';
import { ConferenceModule } from './controllers/conference/conference.module';

@Module({
  imports: [ConferenceModule],
  providers: [],
})
export class MainModule {}
