import {Command, flags} from '@oclif/command'
import { readContractsJson, getWalletAndMainAccount, getSigningClient} from '../deploy'
import { DORCP } from '../dorium-helper';

import 'dotenv/config'
import { parseCoins } from '@cosmjs/proto-signing';

const { MNEMONIC_MAIN, RPC_ENDPOINT } = process.env;
export default class Create extends Command {
  static description = 'Create a new DORium Community Proposal'

  static flags = {
    help: flags.help({char: 'h'})
  }

  static args = [{name: 'id'}, {name: 'description'}, {name: 'url'}]

  async run() {
    const {args, flags} = this.parse(Create)

    let {wallet, account} = await getWalletAndMainAccount(MNEMONIC_MAIN);
    const client = await getSigningClient(RPC_ENDPOINT, wallet)

    var c  = readContractsJson();
    const dorcp = DORCP(client).use(c.deployed_contracts.dorcp)
    var result = await dorcp.create(account.address, args.id, args.url, args.description, account.address, [account.address], [c.deployed_contracts.valuetoken], parseCoins("1udor")[0])
    console.dir(result)
  }
}
