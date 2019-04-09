import * as plugins from './smartipc.plugins';
import { EventEmitter } from 'events';

export interface ISmartIpcConstructorOptions {
  type: 'server' | 'client';

  /**
   * the name of the message string
   */
  ipcSpace: string;
}

export interface ISmartIpcHandlerPackage {
  keyword: string;
  handlerFunc: (dataArg: string) => void;
}

export class SmartIpc {
  public ipc = new plugins.nodeIpc.IPC();
  public handlers: ISmartIpcHandlerPackage[] = [];

  public options: ISmartIpcConstructorOptions;
  constructor(optionsArg: ISmartIpcConstructorOptions) {
    this.options = optionsArg;
  }

  /**
   * connect to the channel
   */
  public async start() {
    const done = plugins.smartpromise.defer();
    let ipcEventEmitter;
    switch (this.options.type) {
      case 'server':
        this.ipc.config.id = this.options.ipcSpace;
        this.ipc.serve(() => {
          ipcEventEmitter = this.ipc.server;
          done.resolve();
        });
        this.ipc.server.start();
        await plugins.smartdelay.delayFor(1000);
        await done.promise;
        break;
      case 'client':
        this.ipc.connectTo(this.options.ipcSpace, () => {
          ipcEventEmitter = this.ipc.of[this.options.ipcSpace];
          done.resolve();
        });
        await done.promise;
        break;
      default:
        throw new Error('type of ipc is not valid. Must be "server" or "client"');
    }

    for (const handler of this.handlers) {
      ipcEventEmitter.on(handler.keyword, dataArg => {
        handler.handlerFunc(dataArg);
      });
    }
  }

  /**
   * should stop the server
   */
  public async stop() {
    switch (this.options.type) {
      case 'server':
        this.ipc.server.stop();
        break;
      case 'client':
        break;
    }
  }

  /**
   * regsiters a handler
   */
  public registerHandler(handlerPackage: ISmartIpcHandlerPackage) {
    this.handlers.push(handlerPackage);
  }

  /**
   * sends a message
   * @param payloadArg
   */
  public sendMessage(messageIdentifierArg: string, payloadArg: string | any) {
    let payload: string = null;
    if (typeof payloadArg === 'string') {
      payload = payloadArg;
    } else {
      payload = JSON.stringify(payloadArg);
    }
    switch (this.options.type) {
      case 'server':
        this.ipc.server.emit(messageIdentifierArg, payload);
        break;
      case 'client':
        this.ipc.of[this.options.ipcSpace].emit(messageIdentifierArg, payload);
    }
  }
}
