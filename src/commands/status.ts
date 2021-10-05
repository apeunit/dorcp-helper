import {Command, flags} from '@oclif/command'
import { readContractsJson, getWalletAndMainAccount, getSigningClient } from '../deploy';
import { DORCP } from '../dorcp-helper';

import 'dotenv/config'
const { MNEMONIC_MAIN, RPC_ENDPOINT } = process.env;
export default class Status extends Command {
  static description = 'Show detailed information about an ongoing DORCP'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [{name: 'id'}]

  async run() {
    const {args, flags} = this.parse(Status)

    let {wallet, account} = await getWalletAndMainAccount(MNEMONIC_MAIN)
    const client = await getSigningClient(RPC_ENDPOINT, wallet)

    var c  = readContractsJson();
    const dorcp = DORCP(client).use(c.deployed_contracts.dorcp)
    const result = await dorcp.status(args.id)
    console.dir(result)
  }
}
