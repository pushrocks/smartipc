import { expect, tap } from '@pushrocks/tapbundle';
import * as smartipc from '../ts/index'

tap.test('first test', async () => {
  console.log(smartipc.standardExport)
})

tap.start()
