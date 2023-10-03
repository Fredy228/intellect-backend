import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { version, validate } from 'uuid';

import { WebsocketService } from './websocket.service';
import { Actions } from '../enums/socket/actions';

@WebSocketGateway()
export class WebsocketGateway {
  @WebSocketServer() server: Server;
  constructor(private readonly websocketService: WebsocketService) {}

  getClientRooms(): string[] {
    //Получаем все комнаты
    const { rooms } = this.server.sockets.adapter;
    const roomsFilter = Array.from(rooms.keys()).filter(
      (roomID) => validate(roomID) && version(roomID) === 4,
    );
    console.log('ROOMS:', roomsFilter);
    return roomsFilter;
  }

  shareRoomsInfo(): void {
    //Шарим все комнаты
    this.server.emit(Actions.SHARE_ROOMS, {
      roomsCurr: this.getClientRooms(),
    });
  }

  handleConnection(client: Socket) {
    // Логика, выполняемая при установлении соединения
    console.log('Socket connected');
    this.shareRoomsInfo();

    client.on(Actions.JOIN, (config) => {
      const { room: roomID } = config;
      const { rooms: joinedRooms } = client;

      if (Array.from(joinedRooms).includes(roomID)) {
        return console.warn(`Already joined to ${roomID}`);
      }
      //Если мы не подключены, то получаем всех клиентов в этой комнате
      const clients = Array.from(
        this.server.sockets.adapter.rooms.get(roomID) || [],
      );
      //Event для тех кто уже подключен
      clients.forEach((clientID) => {
        this.server.to(clientID).emit(Actions.ADD_PEER, {
          peerID: client.id,
          createOffer: false,
        });
        //Event для тех кто еще не подключен
        client.emit(Actions.ADD_PEER, {
          peerID: clientID,
          createOffer: true,
        });
      });
      console.log('Join room:', client.id);
      client.join(roomID);
      console.log('Clients in room:', clients);
      this.shareRoomsInfo();
    });

    const leaveRoom = () => {
      const { rooms } = client;

      Array.from(rooms)
        .filter((roomID) => validate(roomID) && version(roomID) === 4)
        .forEach((roomID) => {
          const clients = Array.from(
            this.server.sockets.adapter.rooms.get(roomID) || [],
          );

          clients.forEach((clientID) => {
            this.server.to(clientID).emit(Actions.REMOVE_PEER, {
              peerID: client.id,
            });

            client.emit(Actions.REMOVE_PEER, {
              peerID: clientID,
            });
          });

          console.log(`Leave room client`);
          client.leave(roomID);
        });

      this.shareRoomsInfo();
    };

    client.on(Actions.LEAVE, leaveRoom);
    client.on(Actions.DISCONNECTING, leaveRoom);

    client.on(Actions.RELAY_SDP, ({ peerID, sessionDescription }) => {
      this.server.to(peerID).emit(Actions.SESSION_DESCRIPTION, {
        peerID: client.id,
        sessionDescription,
      });
    });

    client.on(Actions.RELAY_ICE, ({ peerID, iceCandidate }) => {
      this.server.to(peerID).emit(Actions.ICE_CANDIDATE, {
        peerID: client.id,
        iceCandidate,
      });
    });
  }

  handleDisconnect() {
    // Логика, выполняемая при разрыве соединения

    console.log('Socket disconnect');
  }
}
