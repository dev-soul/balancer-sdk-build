import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import {
    BatchSwapStep,
    FetchPoolsInput,
    FundManagement,
    SwapType,
} from '@/modules/swaps/types';
import { ExitPoolRequest, JoinPoolRequest } from '@/types';
import { SubgraphPoolBase } from '@balancer-labs/sor';

export type OutputReference = {
    index: number;
    key: BigNumber;
};

export interface EncodeBatchSwapInput {
    swapType: SwapType;
    swaps: BatchSwapStep[];
    assets: string[];
    funds: FundManagement;
    limits: string[];
    deadline: BigNumberish;
    value: BigNumberish;
    outputReferences: OutputReference[];
}

export interface EncodeExitPoolInput {
    poolId: string;
    poolKind: number;
    sender: string;
    recipient: string;
    outputReferences: OutputReference[];
    exitPoolRequest: ExitPoolRequest;
}

export interface EncodeJoinPoolInput {
    poolId: string;
    poolKind: number;
    sender: string;
    recipient: string;
    joinPoolRequest: JoinPoolRequest;
    value: BigNumberish;
    outputReference: BigNumber;
}

export interface EncodeUnwrapAaveStaticTokenInput {
    staticToken: string;
    sender: string;
    recipient: string;
    amount: BigNumberish;
    toUnderlying: boolean;
    outputReferences: BigNumberish;
}

export interface EncodeUnwrapYearnVaultTokenInput {
    vaultToken: string;
    sender: string;
    recipient: string;
    amount: BigNumberish;
    outputReference: BigNumberish;
}

export interface ExitStablePhantomInput {
    account: string;
    poolId: string;
    exits: {
        bptAmountIn: string;
        tokenOut: string;
        unwrap?: boolean;
    }[];
    slippage: string;
}

export interface ExitAndBatchSwapInput {
    exiter: string;
    swapRecipient: string;
    poolId: string;
    exits: ExitAndBatchSwapExitItemInput[];
    userData: string;
    slippage: string;
    fetchPools: FetchPoolsInput;
    unwrap?: boolean;
}

export interface ExitAndBatchSwapExitItemInput {
    exitToken: string;
    exitExpectedAmountOut: string;
    batchSwapTokenOut?: string;
}

export type ExitPoolData = ExitPoolRequest & EncodeExitPoolInput;

export interface NestedLinearPool {
    pool: SubgraphPoolBase;
    mainToken: string;
    poolTokenAddress: string;
    wrappedToken: string;
}

export interface BatchRelayerJoinPool {
    poolId: string;
    tokens: {
        address: string;
        amount: string;
    }[];
    bptOut: string;
    slippage: string;
    funds: FundManagement;
    fetchPools: FetchPoolsInput;
    farmId?: number;
    mintFBeets?: boolean;
}

export interface EncodeBooMirrorWorldEnterInput {
    sender: string;
    recipient: string;
    amount: BigNumberish;
    outputReference: BigNumberish;
}

export interface EncodeBooMirrorWorldLeaveInput {
    sender: string;
    recipient: string;
    amount: BigNumberish;
    outputReference: BigNumberish;
}

export interface EncodeFBeetsBarEnterInput {
    sender: string;
    recipient: string;
    amount: BigNumberish;
    outputReference: BigNumberish;
}

export interface EncodeFBeetsBarLeaveInput {
    sender: string;
    recipient: string;
    amount: BigNumberish;
    outputReference: BigNumberish;
}

export interface EncodeMasterChefDepositInput {
    sender: string;
    recipient: string;
    token: string;
    pid: number;
    amount: BigNumberish;
    outputReference: BigNumberish;
}

export interface EncodeMasterChefWithdrawInput {
    recipient: string;
    pid: number;
    amount: BigNumberish;
    outputReference: BigNumberish;
}
