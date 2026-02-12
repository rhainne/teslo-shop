import { Controller, Get } from '@nestjs/common';

import { SeedService } from './seed.service';
import { Auth } from '../auth/decorators';
import { ValidRole } from 'src/auth/enums/valid-roles.enum';


@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) { }

  @Get()
  @Auth(ValidRole.admin)
  executeSeed() {
    return this.seedService.executeSeed();
  }

}
