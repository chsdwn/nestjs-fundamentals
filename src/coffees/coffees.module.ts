import { Inject, Injectable, Module, Scope } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Event } from 'src/events/entities';
import { COFFEE_BRANDS } from './coffees.constants';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee, Flavor } from './entities';

class MockCoffeeService {
  constructor(@Inject('COFFEE_BRANDS') coffeeBrands: string[]) {
    console.log('[MockCoffeeService]: coffeeBrands', coffeeBrands);
  }
}

class ConfigService {}
class DevelopmentConfigService {}
class ProductionConfigService {}

@Injectable({ scope: Scope.TRANSIENT })
class CoffeeBrandsFactory {
  constructor() {
    console.log('[CoffeeBrandsFactory:constructor]');
  }

  async create(): Promise<string[]> {
    return new Promise((resolve) =>
      setTimeout(() => resolve(COFFEE_BRANDS.concat('starbucks')), 200),
    );
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Event, Flavor])],
  controllers: [CoffeesController],
  providers: [
    {
      provide: CoffeesService,
      // useValue: new MockCoffeeService(),
      useClass: MockCoffeeService,
    },

    CoffeeBrandsFactory,
    {
      provide: 'COFFEE_BRANDS',
      // useValue: COFFEE_BRANDS,
      useFactory: async (brandsFactory: CoffeeBrandsFactory) =>
        (await brandsFactory.create()).concat('kronotrop'),
      inject: [CoffeeBrandsFactory],
      // scope: Scope.TRANSIENT, // same as @Injectable({ scope: Scope.TRANSIENT })
    },

    {
      provide: ConfigService,
      useClass:
        process.env.NODE_ENV === 'development'
          ? DevelopmentConfigService
          : ProductionConfigService,
    },
  ],
  exports: [CoffeesService],
})
export class CoffeesModule {}
