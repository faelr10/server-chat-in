import { Module } from '@nestjs/common';
import { MessageModule } from './message/message.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [MessageModule, ChatModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
