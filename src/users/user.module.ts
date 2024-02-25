import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from 'src/mongoose/schemas';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://faelunanime10:euestoucorrendo@cluster1.hb3arqp.mongodb.net/real-time?retryWrites=true&w=majority&appName=Cluster1',
    ),
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
  ],
  controllers: [],
  providers: [],
})
export class UserModule {}
