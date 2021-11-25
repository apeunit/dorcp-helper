import * as fs from 'fs';
import { AccountData, DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import {calculateFee, StdFee, GasPrice} from "@cosmjs/stargate";
import { SigningCosmWasmClient, UploadResult } from '@cosmjs/cosmwasm-stargate';
import { DORCP, DORNEX, InstantiateDORCP, InstantiateDORNEX, SetTokensDORNEX } from './dorcp-helper';
export const doriumTxFee = calculateFee(10000000, GasPrice.fromString("0.001udor"));

export async function getWalletAndMainAccount(mnemonic: string) {
	const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: "wasm" });
	const [account] = await wallet.getAccounts();

	return {wallet, account};
}

export async function getSigningClient(rpcEndpoint: string, wallet: DirectSecp256k1HdWallet) {
    return await SigningCosmWasmClient.connectWithSigner(rpcEndpoint, wallet, { prefix: "wasm"});
}

export function readContractsJson() {
	var con = JSON.parse(fs.readFileSync("contracts.json").toString());
	return con
}

export function writeContractsJson(obj: any) {
	fs.writeFileSync("contracts.json", JSON.stringify(obj, null, "\t"))
}


export async function uploadContractsSaveResult(cw20WasmPath: string, dorcpWasmPath: string, dornexPath: string, client: SigningCosmWasmClient, senderAddress: string) {
	const cw20Contract = fs.readFileSync(cw20WasmPath);
 	const dorcpContract = fs.readFileSync(dorcpWasmPath);
	const dornexContract = fs.readFileSync(dornexPath);

	console.log("Uploading CW20 Contract");
	const con_cw20 = await client.upload(senderAddress, cw20Contract, doriumTxFee);
	console.log("Uploading DORCP Contract");
	const con_dorcp = await client.upload(senderAddress, dorcpContract, doriumTxFee);
	console.log("Uploading DORNEX Contract");
	const con_dornex = await client.upload(senderAddress, dornexContract, doriumTxFee);
	const contracts = {
		"contracts": {
			cw20: {codeId: con_cw20.codeId, transactionHash: con_cw20.transactionHash},
			dorcp: {codeId: con_dorcp.codeId, transactionHash: con_dorcp.transactionHash},
			dornex: {codeId: con_dornex.codeId, transactionHash: con_dornex.transactionHash},
		},
	}
	return contracts
}

async function instantiateValueToken(contractData: UploadResult, minter: string, account: AccountData, wallet: DirectSecp256k1HdWallet, client: SigningCosmWasmClient) {
	const initMsg = {
		name: 'Dorium Value Token',
		symbol: 'TREE',
		decimals: 2,
		initial_balances: [
			{ address: 'wasm1ryuawewrukex42yh2kpydtpdh90ex096kaajek', amount: '3040000000000' }, // number of trees in the world according to Google
		],
		mint: {
			minter,
		},
	};

	const instanceData = await client.instantiate(account.address, contractData.codeId, initMsg, "instantiating the DORCP contract", doriumTxFee);
	return instanceData
}

async function instantiateSobzToken(contractData: UploadResult, minter: string, account: AccountData, wallet: DirectSecp256k1HdWallet, client: SigningCosmWasmClient) {
	const initMsg = {
		name: 'Dorium Social Business Token',
		symbol: 'SOBZ',
		decimals: 2,
		initial_balances: [
			// whatever, we can mint more later?
		],
		mint: {
			minter,
		},
	};

	const instanceData = await client.instantiate(account.address, contractData.codeId, initMsg, "instantiating the DORCP contract", doriumTxFee);
	return instanceData
}

export async function deploy(con: any, client: SigningCosmWasmClient, wallet: DirectSecp256k1HdWallet, account: AccountData) {
	try {
		const inst_dornex = await InstantiateDORNEX(account.address, client, con.contracts.dornex.codeId)
		console.log("DORNEX Instantiated", inst_dornex);
		console.dir(inst_dornex, {depth:null});

		const inst_cw20_value = await instantiateValueToken(con.contracts.cw20, inst_dornex.contractAddress, account, wallet, client);
		console.log("CW20 (Value) Instantiated", inst_cw20_value);
		const inst_cw20_sobz = await instantiateSobzToken(con.contracts.cw20, inst_dornex.contractAddress, account, wallet, client);
		console.log("CW20 (Sobz) Instantiated", inst_cw20_sobz);

		const inst_dorcp = await InstantiateDORCP(account.address, client, con.contracts.dorcp.codeId)
		console.log("DORCP Instantiated", inst_dorcp);

		console.log("DORNEX: Telling It About Value/SoBz Tokens");
		const dornex = DORNEX(client).use(inst_dornex.contractAddress);
		const settokens_dornex = await dornex.set_tokens(account.address, inst_cw20_value.contractAddress, inst_cw20_sobz.contractAddress)
		console.dir(settokens_dornex, {depth:null});

		const output = {
			"valuetoken": inst_cw20_value.contractAddress,
			"sobztoken": inst_cw20_sobz.contractAddress,
			"dorcp": inst_dorcp.contractAddress,
			"dornex": inst_dornex.contractAddress,
		}
		con.deployed_contracts = output;
		return con
	} catch (e) {
		throw e;
	}
}

const generateRandomString = (length=6)=>Math.random().toString(20).substr(2, length)
