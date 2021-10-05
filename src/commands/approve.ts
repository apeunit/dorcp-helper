import {Command, flags} from '@oclif/command'
import { readContractsJson, getWalletAndMainAccount, getSigningClient} from '../deploy'
import { DORCP } from '../dorcp-helper';

import 'dotenv/config'
const { MNEMONIC_MAIN, RPC_ENDPOINT } = process.env;
export default class Approve extends Command {
  static description = 'Approve a DORCP, releasing its funds to the proposer'

  static flags = {
    help: flags.help({char: 'h'})
  }

  static args = [{name: 'id'}]

  async run() {
    const {args, flags} = this.parse(Approve)

    let {wallet, account} = await getWalletAndMainAccount(MNEMONIC_MAIN);
    const client = await getSigningClient(RPC_ENDPOINT, wallet)

    var c  = readContractsJson();
    const dorcp = DORCP(client).use(c.deployed_contracts.dorcp)
    var result = await dorcp.approve(account.address, args.id)
    console.dir(result)
  }
}
