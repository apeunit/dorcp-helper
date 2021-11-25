import {Command, flags} from '@oclif/command'
import { readContractsJson, getWalletAndMainAccount, getSigningClient} from '../deploy'
import { CW20 } from '../cw20-helper';
import { doriumOptions } from '../base-helper';
import 'dotenv/config'
import { DORNEX } from '../dorium-helper';

const { MNEMONIC_MAIN, RPC_ENDPOINT } = process.env;
export default class Balance extends Command {
  static description = 'Query Value and SoBz balances of any address'

  static flags = {
    help: flags.help({char: 'h'})
  }

  static args = [{name: 'address'}]

  async run() {
    const {args} = this.parse(Balance);

    let {wallet, account} = await getWalletAndMainAccount(MNEMONIC_MAIN);
    const client = await getSigningClient(RPC_ENDPOINT, wallet)

    var c  = readContractsJson();

    const value = CW20(client, doriumOptions).use(c.deployed_contracts.valuetoken);
    const sobz = CW20(client, doriumOptions).use(c.deployed_contracts.sobztoken);
    var value_orig_balance = await value.balance(args.address);
    var sobz_orig_balance = await sobz.balance(args.address);
    console.log(args.address, "value token balance:", value_orig_balance);
    console.log(args.address, "sobz token balance:", sobz_orig_balance);
  }
}
