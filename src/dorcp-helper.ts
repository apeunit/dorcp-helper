import { ExecuteResult, InstantiateResult, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { calculateFee, Coin } from "@cosmjs/stargate";
import { toBase64, toUtf8 } from '@cosmjs/encoding';
import { doriumOptions } from "./base-helper";


interface DORCPContract {
    use: (contractAddress: string) => DORCPInstance
}

interface DORNEXContract {
    use: (contractAddress: string) => DORNEXInstance
}

interface DORCPInstance {
    readonly contractAddress: string

    // actions
    create: (txSigner: string, id: string, url: string, description:string, proposer: string, validators: string[], cw20_whitelist: string[], funds: Coin) => Promise<ExecuteResult>
    topup: (txSigner: string, cw20Address: string, id: string, amountCW20: string) => Promise<ExecuteResult>
    status: (id: string) => Promise<any>
    list: () => Promise<any>
    listdetailed: () => Promise<any>
    approve: (txSigner: string, id: string) => Promise<ExecuteResult>
    refund: (txSigner: string, id: string) => Promise<ExecuteResult>
  }

interface DORNEXInstance {
    readonly contractAddress: string

    set_tokens: (senderAddress: string, value_token_address: string, sobz_token_address: string) => Promise<ExecuteResult>
    exchanged: () => Promise<number>
}

export async function InstantiateDORCP(senderAddress: string, client: SigningCosmWasmClient, codeId: number) {
    const fee = calculateFee(doriumOptions.fees.init, doriumOptions.gasPrice)
    const instantiateData = await client.instantiate(
        senderAddress,
        codeId,
        {},
        'DORCP instantiate()',
        fee
    );
    return instantiateData
}

export async function InstantiateDORNEX(senderAddress: string, client: SigningCosmWasmClient, codeId: number) {
    const fee = calculateFee(doriumOptions.fees.init, doriumOptions.gasPrice)
    const instantiateData = await client.instantiate(
        senderAddress,
        codeId,
        {},
        'DORNEX instantiate()',
        fee
    );
    return instantiateData
}

export const DORNEX =(client: SigningCosmWasmClient): DORNEXContract => {
    const use = (contractAddress: string): DORNEXInstance => {
        const set_tokens = async (senderAddress: string, value_token_address: string, sobz_token_address: string): Promise<ExecuteResult> => {
            const fee = calculateFee(doriumOptions.fees.exec, doriumOptions.gasPrice)
            const result = await client.execute(
                senderAddress,
                contractAddress,
                {set_tokens: {value_token_address, sobz_token_address}},
                fee,
                'DORNEX SetTokens()',
            );
            return result
        }
        const exchanged = async (): Promise<number> => {
            const result = await client.queryContractSmart(
                contractAddress,
                {get_exchanged: {}},
            );
            return result.exchanged
        }
        return { contractAddress, set_tokens, exchanged }
    }
    return {use}
}

export const DORCP = (client: SigningCosmWasmClient): DORCPContract => {
    const use = (contractAddress: string): DORCPInstance => {
        const create = async (senderAddress: string, id: string, url: string, description: string, proposer: string, validators: string[], cw20_whitelist: string[], funds: Coin): Promise<ExecuteResult> => {
            const createMsg = {
                create: {
                    "id": id,
                    "url": url,
                    "description": description,
                    "validators": validators,
                    "proposer": proposer,
                    "source": "unused",
                    "cw20_whitelist": cw20_whitelist,
                }
            }
            const fee = calculateFee(doriumOptions.fees.exec, doriumOptions.gasPrice)

            const result = await client.execute(senderAddress, contractAddress, createMsg, fee, "DORCP.create()", [funds])
            return result
        }

        const topup = async (senderAddress: string, cw20Address: string, id: string, amountCW20: string): Promise<ExecuteResult> => {
            const fee = calculateFee(doriumOptions.fees.exec, doriumOptions.gasPrice)

            // does not actually call the DORCP Escrow contract - this calls the
            // CW20 contract to send CW20 tokens to the Escrow contract, with a
            // message to the Escrow contract that it is for a particular escrow
            // id.
            const topup = {top_up: {id: id}}
            const topupBin = toBase64(toUtf8(JSON.stringify(topup)))
            const result = await client.execute(senderAddress, cw20Address, {send: {contract: contractAddress, amount: amountCW20, msg: topupBin}}, fee);
            return result
        }

        const status = async(id: string): Promise<any> => {
            const result = await client.queryContractSmart(contractAddress, {details: {id: id}})
            return result
        }

        const list = async(): Promise<any> => {
            const result = await client.queryContractSmart(contractAddress, {list: {}})
            return result
        }

        const listdetailed = async(): Promise<any> => {
            const result = await client.queryContractSmart(contractAddress, {list_detailed: {}})
            return result
        }

        const approve = async (senderAddress: string, id: string): Promise<ExecuteResult> => {
            const fee = calculateFee(doriumOptions.fees.exec, doriumOptions.gasPrice)

            const result = await client.execute(senderAddress, contractAddress, {approve: {"id": id}}, fee);
            return result;
        }
        const refund = async (senderAddress: string, id: string): Promise <ExecuteResult> => {
            const fee = calculateFee(doriumOptions.fees.exec, doriumOptions.gasPrice)

            const result = await client.execute(senderAddress, contractAddress, {refund: {"id": id}}, fee);
            return result
        }
        return {
            contractAddress,
            create,
            topup,
            status,
            list,
            listdetailed,
            approve,
            refund,
        };
    }
    return {use};
}