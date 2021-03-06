import {Command, flags} from '@oclif/command'
import { readContractsJson, getWalletAndMainAccount, getSigningClient } from '../deploy';
import { DORCP } from '../dorium-helper';

import 'dotenv/config'
const { MNEMONIC_MAIN, RPC_ENDPOINT } = process.env;
export default class List extends Command {
  static description = 'List all open DORCPs'

  static flags = {
    help: flags.help({char: 'h'}),
    detailed: flags.boolean({char: 'd', default:false})
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(List)

    var c  = readContractsJson();
    let {wallet, account} = await getWalletAndMainAccount(MNEMONIC_MAIN);
    const client = await getSigningClient(RPC_ENDPOINT, wallet);

    const dorcp = DORCP(client).use(c.deployed_contracts.dorcp)

    if(flags.detailed) {
      console.dir(await dorcp.listdetailed(), {depth:null})
    } else {
      console.dir(await dorcp.list())
    }
  }
}
