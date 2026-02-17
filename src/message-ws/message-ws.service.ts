import { Injectable } from '@nestjs/common';
import { ConnectedClient } from './interfaces/client.interface';
import { Socket } from 'node_modules/socket.io/dist/socket';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class MessageWsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  private connectedClients: ConnectedClient = {};

  async registerClient(client: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new Error('User not found');
    if (!user.isActive) throw new Error('User is not active');
    this.checkUserConnection(userId);

    this.connectedClients[client.id] = { socket: client, user: user };
  }

  removeClient(clientId: string) {
    delete this.connectedClients[clientId];
  }

  getNumberOfConnectedClients(): number {
    return Object.keys(this.connectedClients).length;
  }

  getConnectedClients(): string[] {
    return Object.keys(this.connectedClients);
  }

  getUserFullName(clientId: string): string {
    return this.connectedClients[clientId].user.fullName
  };

  private checkUserConnection(userId: string) {
    const connectedClient = Object.values(this.connectedClients)
      .find(client => client.user.id === userId);

    connectedClient?.socket.disconnect();
  }

}
