import { DynamicModule, Module } from '@nestjs/common';

const connect = async (dbName = 'Postgres') => {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(console.log(`Connected to the ${dbName} DataBase`)),
      250,
    );
  });
};

@Module({})
export class DatabaseModule {
  static register(dbName: string): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'CONNECTION',
          useValue: connect(dbName),
        },
      ],
    };
  }
}
