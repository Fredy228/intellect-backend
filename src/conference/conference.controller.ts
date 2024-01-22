import { Controller } from '@nestjs/common';
import { ConferenceService } from './conference.service';

@Controller()
export class ConferenceController {
  constructor(private readonly conferenceService: ConferenceService) {}
}
