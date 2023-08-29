import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth.module';
import { User, UserSchema } from '../user/user.schema';

describe('AuthController', () => {
  let app: INestApplication;
  let userModel;
  let mongo;
  beforeEach(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        AuthModule,
      ],
    }).compile();

    app = module.createNestApplication();
    userModel = module.get(getModelToken(User.name));
    await app.init();
  });

  afterAll(async () => {
    await mongo.stop();
  });

  describe('/login (POST)', () => {
    it('should return JWT token if credentials are correct', async () => {
      await userModel.create({
        username: 'test-user',
        password: 'password',
        attempts: 0,
        lastAttempt: null,
        isLocked: false,
      });

      const response = await request(app.getHttpServer())
        .post('/login')
        .send({ username: 'test-user', password: 'password' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
    });

    it('should return 401 if credentials are incorrect', async () => {
      const response = await request(app.getHttpServer())
        .post('/login')
        .send({ username: 'test-user', password: 'wrong_password' });

      expect(response.status).toBe(401);
    });
  });
});
