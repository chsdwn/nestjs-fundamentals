import { Injectable, NotFoundException } from '@nestjs/common';

import { Coffee } from './entities';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Shipwreck Roast',
      brand: 'Buddy Brew',
      flavors: ['chocolate', 'vanilla'],
    },
  ];

  findAll() {
    return this.coffees;
  }

  findOne(id: number) {
    const coffee = this.coffees.find((c) => c.id === id);
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  create(createCoffeeDto: any) {
    this.coffees.push(createCoffeeDto);
  }

  update(id: number, updateCoffeeDto: any) {
    const coffee = this.findOne(id);
    if (coffee) Object.assign(coffee, updateCoffeeDto);
  }

  remove(id: number) {
    const index = this.coffees.findIndex((c) => c.id === id);
    if (index > -1) this.coffees.splice(index, 1);
  }
}
