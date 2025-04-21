import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { CategoryService } from '../categories/categories.service';

describe('EntriesController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let premiumToken: string;
  let entryId: number;
  let dataSource: DataSource;
  let categoryService: CategoryService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    dataSource = moduleFixture.get(DataSource);
    const authService = moduleFixture.get(AuthService);
    categoryService = moduleFixture.get(CategoryService);

    await authService.register('user@test.com', 'password123');
    const userLogin = await authService.signIn('user@test.com', 'password123');
    accessToken = userLogin.access_token;

    await authService.register('premium@test.com', 'password123');
    await dataSource.query(`UPDATE "user" SET role = 'premium' WHERE email = 'premium@test.com'`);

    const premiumLogin = await authService.signIn('premium@test.com', 'password123');

    premiumToken = premiumLogin.access_token;
  });

  afterAll(async () => {
    await dataSource.query(`DELETE FROM "user" WHERE email = 'premium@test.com'`);
    await dataSource.query(`DELETE FROM "user" WHERE email = 'user@test.com'`);
    await app.close();
  });

  it('POST /entries (create entry) - should create entry for logged in user', async () => {
    const category = await categoryService.create({ title: 'test', description: 'test' });
    const res = await request(app.getHttpServer())
      .post('/entries')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Test Entry',
        amount: 100,
        currency: 'USD',
        date: new Date(),
        picture: 'test.jpg',
        categoryId: category.id,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    entryId = res.body.id;
  });

  it('GET /entries - should fetch all entries (no auth required)', async () => {
    const res = await request(app.getHttpServer()).get('/entries');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /entries/:id - should fetch a single entry by ID (auth required)', async () => {
    const res = await request(app.getHttpServer())
      .get(`/entries/${entryId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', entryId);
  });

  it('PATCH /entries/:id - should fail for non-premium user', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/entries/${entryId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Updated Title' });

    expect(res.status).toBe(403);
  });

  it('PATCH /entries/:id - should update entry for premium user', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/entries/${entryId}`)
      .set('Authorization', `Bearer ${premiumToken}`)
      .send({ title: 'Updated Title' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Title');
  });

  it('DELETE /entries/:id - should delete entry', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/entries/${entryId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
  });

  it('GET /entries/:id - should return 404 after deletion', async () => {
    const res = await request(app.getHttpServer())
      .get(`/entries/${entryId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(404);
  });
});
