import * as plugins from './smartipc.plugins';

export interface ISmartIpcConstructorOptions {
  type: 'server' | 'client';

  /**
   * the name of the message string
   */
  ipcSpace: string;
}


export interface ISmartIpcHandlerPackage {
  keyword: string;
  handlerFunc: () => void;
}

export class SmartIpc {
  public handlers: ISmartIpcHandlerPackage[] = [];

  public options: ISmartIpcConstructorOptions;
  constructor(optionsArg: ISmartIpcConstructorOptions) {
    this.options = optionsArg;
  }


  /**
   * connect to the channel
   */
  public async start() {
    switch (this.options.type) {
      case 'server':
        plugins.nodeIpc.config.id = this.options.ipcSpace;
        const done = plugins.smartpromise.defer();
        plugins.nodeIpc.serve(() => {
          done.resolve();
        });
        await done.promise;
        break;
      case 'client':
        plugins.nodeIpc.connectTo(this.options.ipcSpace);
      default:
        throw new Error('type of ipc is not valid. Must be "server" or "client"');
    }
  }

  /**
   * should stop the server
   */
  public async stop() {
    plugins.nodeIpc.server.stop();
  }

  /**
   * regsiters a handler
   */
  registerHandler (handlerPackage: ISmartIpcHandlerPackage) {
    this.handlers.push(handlerPackage);
  }
}
