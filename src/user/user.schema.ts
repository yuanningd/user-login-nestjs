import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 0 })
  attempts: number;

  @Prop()
  firstAttempt: Date;

  @Prop({ default: false })
  isLocked: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
