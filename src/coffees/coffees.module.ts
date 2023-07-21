import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Event } from 'src/events/entities';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee, Flavor } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Event, Flavor])],
  controllers: [CoffeesController],
  providers: [CoffeesService],
})
export class CoffeesModule {}
