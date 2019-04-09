import { expect, tap } from '@pushrocks/tapbundle';
import * as smartipc from '../ts/index';

import * as smartspawn from '@pushrocks/smartspawn';
import * as smartpromise from '@pushrocks/smartpromise';

let serverIpc: smartipc.SmartIpc;
let clientIpc: smartipc.SmartIpc;

tap.test('should instantiate a valid instance', async () => {
  serverIpc = new smartipc.SmartIpc({
    ipcSpace: 'testSmartIpc',
    type: 'server'
  });
  serverIpc.registerHandler({
    keyword: 'hi',
    handlerFunc: data => {
      console.log(data);
    }
  });
  await serverIpc.start();
});

tap.test('should create a client', async tools => {
  clientIpc = new smartipc.SmartIpc({
    ipcSpace: 'testSmartIpc',
    type: 'client'
  });
  await clientIpc.start();
  clientIpc.sendMessage('hi', { awesome: 'yes' });
});

tap.test('should terminate the smartipc process', async (tools) => {
  await tools.delayFor(1000);
  await clientIpc.stop();
  await serverIpc.stop();
});

tap.start();
