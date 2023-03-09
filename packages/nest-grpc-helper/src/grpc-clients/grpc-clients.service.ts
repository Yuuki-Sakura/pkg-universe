import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { ServiceProxy } from '../service-proxy/index.js';
import { GRPC_CLIENTS_OPTIONS } from './constants/grpc-clients-options.constant.js';
import { GRPC_CLIENTS } from './constants/grpc-clients.constant.js';
import {
  GrpcClientOptions,
  GrpcClientsOptions,
} from './interfaces/grpc-clients-options.interface.js';
import { GrpcClients } from './interfaces/grpc-clients.interface.js';

@Injectable()
export class GrpcClientsService {
  private serviceMap: Map<string, any> = new Map();
  private optionsMap: Map<string, GrpcClientOptions> = new Map();

  constructor(
    @Inject(GRPC_CLIENTS) private clients: GrpcClients,
    @Inject(GRPC_CLIENTS_OPTIONS) private options: GrpcClientsOptions
  ) {
    options.map((o) => {
      this.optionsMap.set(o.packageName, o);
    });
  }

  private getClient(packageName: string) {
    const client = this.clients.get(packageName);

    if (!client) {
      throw new InternalServerErrorException('ERR_CLIENT_NOT_FOUND');
    }

    return client;
  }

  getService(packageName: string, serviceName: string) {
    let service = this.serviceMap.get(packageName);

    if (!service) {
      service = this.getClient(packageName).getService(serviceName);

      this.serviceMap.set(packageName, service);
    }

    const options = this.optionsMap.get(packageName);

    if (!options) {
      throw new InternalServerErrorException('ERR_CLIENT_OPTIONS_NOT_FOUND');
    }

    return new ServiceProxy(service, options);
  }
}
