import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import * as request from 'supertest';

import { CoffeesModule } from 'src/coffees/coffees.module';

const dbOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'postgrespassword',
  database: 'postgres',
  autoLoadEntities: true,
  synchronize: true,
};

describe('[Feature] Coffees - /coffees', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(dbOptions as TypeOrmModuleOptions),
        CoffeesModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    const entityManager = app.get<EntityManager>(EntityManager);
    const tableNames = entityManager.connection.entityMetadatas
      .map((entity) => entity.tableName)
      .join(', ');
    await entityManager.query(`TRUNCATE ${tableNames}`);
  });

  afterAll(async () => {
    await app.close();
  });

  const coffee = {
    name: 'Shipwreck Roast',
    brand: 'Buddy Brew',
    flavors: ['chocolate', 'vanilla'],
  };

  it('Get all [GET /]', async () => {
    await request(app.getHttpServer()).post('/coffees').send(coffee);

    return request(app.getHttpServer())
      .get('/coffees')
      .expect(HttpStatus.OK)
      .then(({ body: coffees }) => {
        expect(coffees).toHaveLength(1);
        expect(coffees[0].name).toEqual(coffee.name);
        expect(coffees[0].brand).toEqual(coffee.brand);
      });
  });

  it('Get one [GET /:id]', async () => {
    let id = -1;
    await request(app.getHttpServer())
      .post('/coffees')
      .send(coffee)
      .then(({ body }) => {
        id = body.id;
      });

    return request(app.getHttpServer())
      .get(`/coffees/${id}`)
      .expect(HttpStatus.OK)
      .then(({ body: coffee }) => {
        expect(coffee.name).toEqual(coffee.name);
        expect(coffee.brand).toEqual(coffee.brand);
      });
  });

  it('Create [POST /]', () => {
    return request(app.getHttpServer())
      .post('/coffees')
      .send(coffee)
      .expect(HttpStatus.GONE)
      .then(({ body }) => {
        const expectedCoffee = jasmine.objectContaining({
          ...coffee,
          flavors: jasmine.arrayContaining(
            coffee.flavors.map((flavor) =>
              jasmine.objectContaining({ name: flavor }),
            ),
          ),
        });
        expect(body).toEqual(expectedCoffee);
      });
  });

  it('Update one [PATCH /:id]', async () => {
    let id = -1;
    await request(app.getHttpServer())
      .post('/coffees')
      .send(coffee)
      .then(({ body }) => {
        id = body.id;
      });

    const brand = 'Another brand';
    return request(app.getHttpServer())
      .patch(`/coffees/${id}`)
      .send({ brand })
      .expect(HttpStatus.OK)
      .then(({ body: coffee }) => {
        expect(coffee.brand).toBe(brand);
      });
  });

  it('Delete one [DELETE /:id]', async () => {
    let id = -1;
    await request(app.getHttpServer())
      .post('/coffees')
      .send(coffee)
      .then(({ body }) => {
        id = body.id;
      });

    await request(app.getHttpServer())
      .delete(`/coffees/${id}`)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.name).toBe(coffee.name);
        expect(body.brand).toBe(coffee.brand);
      });

    return request(app.getHttpServer())
      .get(`/coffees/${id}`)
      .expect(HttpStatus.NOT_FOUND);
  });
});
