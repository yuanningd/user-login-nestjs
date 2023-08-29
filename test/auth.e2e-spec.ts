import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/login (POST) should return JWT token if credentials are correct', () => {
    return request(app.getHttpServer())
      .post('/login')
      .send({ username: 'test-user', password: 'password' })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('accessToken');
      });
  });

  it('/login (POST) should return 401 if credentials are incorrect', () => {
    return request(app.getHttpServer())
      .post('/login')
      .send({ username: 'tes-user', password: 'wrong_password' })
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
