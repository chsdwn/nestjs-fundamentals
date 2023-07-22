import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Protocol, Public } from 'src/common/decorators';
import { ParseIntPipe } from 'src/common/pipes';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto, PaginationQueryDto, UpdateCoffeeDto } from './dto';

@ApiTags('coffees')
@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  // @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Public()
  @Get()
  findAll(
    @Protocol('https') protocol: string,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    console.log('[CoffeesController:findAll]: protocol', protocol);
    return this.coffeesService.findAll(paginationQueryDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coffeesService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.GONE)
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeesService.create(createCoffeeDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeesService.update(id, updateCoffeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.coffeesService.remove(id);
  }
}
