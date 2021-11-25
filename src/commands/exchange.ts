import {Command, flags} from '@oclif/command'
import { readContractsJson, getWalletAndMainAccount, getSigningClient} from '../deploy'
import { CW20 } from '../cw20-helper';
import { doriumOptions } from '../base-helper';
import 'dotenv/config'
import { DORNEX } from '../dorcp-helper';

const { MNEMONIC_MAIN, RPC_ENDPOINT } = process.env;
export default class Exchange extends Command {
  static description = 'Send Value Token to DORNEX'

  static flags = {
    help: flags.help({char: 'h'})
  }

  static args = [{name: 'amount'}]

  async run() {
    const {args} = this.parse(Exchange);

    let {wallet, account} = await getWalletAndMainAccount(MNEMONIC_MAIN);
    const client = await getSigningClient(RPC_ENDPOINT, wallet)

    var c  = readContractsJson();

    const value = CW20(client, doriumOptions).use(c.deployed_contracts.valuetoken);
    const sobz = CW20(client, doriumOptions).use(c.deployed_contracts.sobztoken);
    var value_orig_balance = await value.balance(account.address);
    console.log(account.address, "value token balance:", value_orig_balance);

    console.log("Transferring", args.amount, "value token to", c.deployed_contracts.dornex)
    const transferResult = await value.send(account.address, c.deployed_contracts.dornex, args.amount, {"send": ""})
    console.dir(transferResult, {depth:null})

    var value_new_balance = await value.balance(account.address);
    console.log(account.address, "value token balance:", value_new_balance);

    var sobz_new_balance = await sobz.balance(account.address);
    console.log(account.address, "sobz token balance:", sobz_new_balance);

    const dornex = DORNEX(client).use(c.deployed_contracts.dornex);
    const exc = await dornex.exchanged();
    console.log("DORNEX contract", c.deployed_contracts.dornex, "has exchanged", exc, "value->sobz tokens total");
  }
}
