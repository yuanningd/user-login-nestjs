import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI ||
        'mongodb://root:example@localhost:27018/myAppDatabase?authSource=admin',
    ),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
