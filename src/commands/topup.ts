import {Command, flags} from '@oclif/command'
import { readContractsJson, getWalletAndMainAccount, getSigningClient} from '../deploy'
import { DORCP } from '../dorium-helper';

import 'dotenv/config'
const { MNEMONIC_MAIN, RPC_ENDPOINT } = process.env;
export default class Topup extends Command {
  static description = 'Send some CW20 tokens to a DORium Community Proposal'

  static flags = {
    help: flags.help({char: 'h'})
  }

  static args = [{name: 'id'}, {name: 'amount'}]

  async run() {
    const {args, flags} = this.parse(Topup)

    let {wallet, account} = await getWalletAndMainAccount(MNEMONIC_MAIN);
    const client = await getSigningClient(RPC_ENDPOINT, wallet)

    var c  = readContractsJson();
    const dorcp = DORCP(client).use(c.deployed_contracts.dorcp)
    this.log("Calling CW20 contract", c.deployed_contracts.valuetoken, "to send", args.amount, "tokens to", args.id)
    var result = await dorcp.topup(account.address, c.deployed_contracts.valuetoken, args.id, args.amount)
    console.dir(result)
  }
}
