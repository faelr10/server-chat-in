import { Inject, Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { MessageService } from 'src/message/message.service';
import { IMessageService } from 'src/message/structure';

export type IMessage = {
  sender: string;
  message: string;
  email: string;
};
export type INewUserConnectData = {
  user: string;
};

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(MessageService) private readonly messageService: IMessageService,
  ) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');

  @SubscribeMessage('returnAllMessages')
  async returnAllMessages(client: Socket, id: string): Promise<void> {
    try {
      const allMessages = await this.messageService.returnAllMessages();
      this.server.emit(`allMsgToClient:${id}`, JSON.stringify(allMessages));
    } catch (error) {
      this.logger.error(`Error retrieving messages: ${error.message}`);
    }
  }

  @SubscribeMessage('newMessage')
  async handleNewMessage(client: Socket, payload: IMessage): Promise<void> {
    try {
      const newMessage = await this.messageService.newMessage(payload);
      this.server.emit('msgToClient', JSON.stringify(newMessage), client.id);
    } catch (error) {
      this.logger.error(`Error handling new message: ${error.message}`);
    }
  }

  // @SubscribeMessage('newUserConnect')
  // handleNewUserConnect(client: Socket, payload: INewUserConnectData): void {
  //   //console.log(`${payload.user}, acabou de se juntar à conversa.`);
  //   this.server.emit(
  //     'msgToClient',
  //     `${payload.user}, acabou de se juntar à conversa.`,
  //   );
  // }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(server: Server): void {
    this.logger.log('Initialized');
  }

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
