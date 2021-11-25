import {Command, flags} from '@oclif/command'

import {getSigningClient, getWalletAndMainAccount, readContractsJson} from '../deploy';
import { DORCP } from '../dorium-helper';

import 'dotenv/config'
const { MNEMONIC_MAIN, RPC_ENDPOINT } = process.env;

export default class Refund extends Command {
  static description = 'Mark DORCP as failed, burning its locked funds'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [{name: 'id'}]

  async run() {
    const {args, flags} = this.parse(Refund)

    let {wallet, account} = await getWalletAndMainAccount(MNEMONIC_MAIN);
    const client = await getSigningClient(RPC_ENDPOINT, wallet)

    var c = readContractsJson();
    const dorcp = DORCP(client).use(c.deployed_contracts.dorcp)
    const result = await dorcp.refund(account.address, args.id)
    console.log(result)
  }
}
