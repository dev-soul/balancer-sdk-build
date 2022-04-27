import { BigNumberish, BigNumber } from '@ethersproject/bignumber';
import { Contract } from '@ethersproject/contracts';
import { TokenPriceService, PoolDataService, SOR, SubgraphPoolBase } from '@balancer-labs/sor';
export { PoolFilter, SOR, SubgraphPoolBase, SwapInfo, SwapOptions, SwapTypes, SwapV2, phantomStableBPTForTokensZeroPriceImpact, queryBatchSwapTokensIn, queryBatchSwapTokensOut, stableBPTForTokensZeroPriceImpact, weightedBPTForTokensZeroPriceImpact } from '@balancer-labs/sor';
import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import { Signer, TypedDataSigner } from '@ethersproject/abstract-signer';
import { JsonRpcProvider } from '@ethersproject/providers';

declare enum StablePoolJoinKind {
    INIT = 0,
    EXACT_TOKENS_IN_FOR_BPT_OUT = 1,
    TOKEN_IN_FOR_EXACT_BPT_OUT = 2
}
declare enum StablePhantomPoolJoinKind {
    INIT = 0,
    COLLECT_PROTOCOL_FEES = 1
}
declare enum StablePoolExitKind {
    EXACT_BPT_IN_FOR_ONE_TOKEN_OUT = 0,
    EXACT_BPT_IN_FOR_TOKENS_OUT = 1,
    BPT_IN_FOR_EXACT_TOKENS_OUT = 2
}
declare class StablePoolEncoder {
    /**
     * Cannot be constructed.
     */
    private constructor();
    /**
     * Encodes the userData parameter for providing the initial liquidity to a StablePool
     * @param initialBalances - the amounts of tokens to send to the pool to form the initial balances
     */
    static joinInit: (amountsIn: BigNumberish[]) => string;
    /**
     * Encodes the userData parameter for collecting protocol fees for StablePhantomPool
     */
    static joinCollectProtocolFees: () => string;
    /**
     * Encodes the userData parameter for joining a StablePool with exact token inputs
     * @param amountsIn - the amounts each of token to deposit in the pool as liquidity
     * @param minimumBPT - the minimum acceptable BPT to receive in return for deposited tokens
     */
    static joinExactTokensInForBPTOut: (amountsIn: BigNumberish[], minimumBPT: BigNumberish) => string;
    /**
     * Encodes the userData parameter for joining a StablePool with to receive an exact amount of BPT
     * @param bptAmountOut - the amount of BPT to be minted
     * @param enterTokenIndex - the index of the token to be provided as liquidity
     */
    static joinTokenInForExactBPTOut: (bptAmountOut: BigNumberish, enterTokenIndex: number) => string;
    /**
     * Encodes the userData parameter for exiting a StablePool by removing a single token in return for an exact amount of BPT
     * @param bptAmountIn - the amount of BPT to be burned
     * @param enterTokenIndex - the index of the token to removed from the pool
     */
    static exitExactBPTInForOneTokenOut: (bptAmountIn: BigNumberish, exitTokenIndex: number) => string;
    /**
     * Encodes the userData parameter for exiting a StablePool by removing tokens in return for an exact amount of BPT
     * @param bptAmountIn - the amount of BPT to be burned
     */
    static exitExactBPTInForTokensOut: (bptAmountIn: BigNumberish) => string;
    /**
     * Encodes the userData parameter for exiting a StablePool by removing exact amounts of tokens
     * @param amountsOut - the amounts of each token to be withdrawn from the pool
     * @param maxBPTAmountIn - the minimum acceptable BPT to burn in return for withdrawn tokens
     */
    static exitBPTInForExactTokensOut: (amountsOut: BigNumberish[], maxBPTAmountIn: BigNumberish) => string;
}

declare enum WeightedPoolJoinKind {
    INIT = 0,
    EXACT_TOKENS_IN_FOR_BPT_OUT = 1,
    TOKEN_IN_FOR_EXACT_BPT_OUT = 2,
    ALL_TOKENS_IN_FOR_EXACT_BPT_OUT = 3
}
declare enum WeightedPoolExitKind {
    EXACT_BPT_IN_FOR_ONE_TOKEN_OUT = 0,
    EXACT_BPT_IN_FOR_TOKENS_OUT = 1,
    BPT_IN_FOR_EXACT_TOKENS_OUT = 2,
    MANAGEMENT_FEE_TOKENS_OUT = 3
}
declare class WeightedPoolEncoder {
    /**
     * Cannot be constructed.
     */
    private constructor();
    /**
     * Encodes the userData parameter for providing the initial liquidity to a WeightedPool
     * @param initialBalances - the amounts of tokens to send to the pool to form the initial balances
     */
    static joinInit: (amountsIn: BigNumberish[]) => string;
    /**
     * Encodes the userData parameter for joining a WeightedPool with exact token inputs
     * @param amountsIn - the amounts each of token to deposit in the pool as liquidity
     * @param minimumBPT - the minimum acceptable BPT to receive in return for deposited tokens
     */
    static joinExactTokensInForBPTOut: (amountsIn: BigNumberish[], minimumBPT: BigNumberish) => string;
    /**
     * Encodes the userData parameter for joining a WeightedPool with a single token to receive an exact amount of BPT
     * @param bptAmountOut - the amount of BPT to be minted
     * @param enterTokenIndex - the index of the token to be provided as liquidity
     */
    static joinTokenInForExactBPTOut: (bptAmountOut: BigNumberish, enterTokenIndex: number) => string;
    /**
     * Encodes the userData parameter for joining a WeightedPool proportionally to receive an exact amount of BPT
     * @param bptAmountOut - the amount of BPT to be minted
     */
    static joinAllTokensInForExactBPTOut: (bptAmountOut: BigNumberish) => string;
    /**
     * Encodes the userData parameter for exiting a WeightedPool by removing a single token in return for an exact amount of BPT
     * @param bptAmountIn - the amount of BPT to be burned
     * @param enterTokenIndex - the index of the token to removed from the pool
     */
    static exitExactBPTInForOneTokenOut: (bptAmountIn: BigNumberish, exitTokenIndex: number) => string;
    /**
     * Encodes the userData parameter for exiting a WeightedPool by removing tokens in return for an exact amount of BPT
     * @param bptAmountIn - the amount of BPT to be burned
     */
    static exitExactBPTInForTokensOut: (bptAmountIn: BigNumberish) => string;
    /**
     * Encodes the userData parameter for exiting a WeightedPool by removing exact amounts of tokens
     * @param amountsOut - the amounts of each token to be withdrawn from the pool
     * @param maxBPTAmountIn - the minimum acceptable BPT to burn in return for withdrawn tokens
     */
    static exitBPTInForExactTokensOut: (amountsOut: BigNumberish[], maxBPTAmountIn: BigNumberish) => string;
}
declare class ManagedPoolEncoder {
    /**
     * Cannot be constructed.
     */
    private constructor();
    /**
     * Encodes the userData parameter for exiting a ManagedPool for withdrawing management fees.
     * This can only be done by the pool owner.
     */
    static exitForManagementFees: () => string;
}

/**
 * Normalize an array of token weights to ensure they sum to `1e18`
 * @param weights - an array of token weights to be normalized
 * @returns an equivalent set of normalized weights
 */
declare function toNormalizedWeights(weights: BigNumber[]): BigNumber[];
/**
 * Check whether a set of weights are normalized
 * @param weights - an array of potentially unnormalized weights
 * @returns a boolean of whether the weights are normalized
 */
declare const isNormalizedWeights: (weights: BigNumberish[]) => boolean;

declare enum Network {
    MAINNET = 1,
    ROPSTEN = 3,
    RINKEBY = 4,
    GÖRLI = 5,
    KOVAN = 42,
    POLYGON = 137,
    ARBITRUM = 42161,
    AVALANCHE = 43114
}

interface BalancerSdkConfig {
    network: Network | BalancerNetworkConfig;
    rpcUrl: string;
    customSubgraphUrl?: string;
    sor?: Partial<BalancerSdkSorConfig>;
}
interface BalancerSdkSorConfig {
    tokenPriceService: 'coingecko' | 'subgraph' | TokenPriceService;
    poolDataService: 'subgraph' | PoolDataService;
    fetchOnChainBalances: boolean;
}
declare type BalancerLinearPoolType = 'aave' | 'yearn' | 'boo';
interface BalancerNetworkConfig {
    chainId: Network;
    addresses: {
        contracts: {
            vault: string;
            multicall: string;
            batchRelayer?: string;
        };
        tokens: {
            wrappedNativeAsset: string;
        };
        linearFactories?: {
            [address: string]: BalancerLinearPoolType;
        };
    };
    urls: {
        subgraph: string;
    };
    pools: {
        staBal3Pool?: PoolReference;
        wethStaBal3?: PoolReference;
    };
    xSonar?: {
        address: string;
        farmId: number;
        poolId: string;
    };
}
declare type PoolReference = {
    id: string;
    address: string;
};
declare enum PoolSpecialization {
    GeneralPool = 0,
    MinimalSwapInfoPool = 1,
    TwoTokenPool = 2
}
declare type JoinPoolRequest = {
    assets: string[];
    maxAmountsIn: BigNumberish[];
    userData: string;
    fromInternalBalance: boolean;
};
declare type ExitPoolRequest = {
    assets: string[];
    minAmountsOut: string[];
    userData: string;
    toInternalBalance: boolean;
};
declare enum UserBalanceOpKind {
    DepositInternal = 0,
    WithdrawInternal = 1,
    TransferInternal = 2,
    TransferExternal = 3
}
declare type UserBalanceOp = {
    kind: UserBalanceOpKind;
    asset: string;
    amount: BigNumberish;
    sender: string;
    recipient: string;
};
declare enum PoolBalanceOpKind {
    Withdraw = 0,
    Deposit = 1,
    Update = 2
}
declare type PoolBalanceOp = {
    kind: PoolBalanceOpKind;
    poolId: string;
    token: string;
    amount: BigNumberish;
};
interface TransactionData {
    contract?: Contract;
    function: string;
    params: string[];
    outputs?: {
        amountsIn?: string[];
        amountsOut?: string[];
    };
}

/**
 * Splits a poolId into its components, i.e. pool address, pool specialization and its nonce
 * @param poolId - a bytes32 string of the pool's ID
 * @returns an object with the decomposed poolId
 */
declare const splitPoolId: (poolId: string) => {
    address: string;
    specialization: PoolSpecialization;
    nonce: BigNumber;
};
/**
 * Extracts a pool's address from its poolId
 * @param poolId - a bytes32 string of the pool's ID
 * @returns the pool's address
 */
declare const getPoolAddress: (poolId: string) => string;
/**
 * Extracts a pool's specialization from its poolId
 * @param poolId - a bytes32 string of the pool's ID
 * @returns the pool's specialization
 */
declare const getPoolSpecialization: (poolId: string) => PoolSpecialization;
/**
 * Extracts a pool's nonce from its poolId
 * @param poolId - a bytes32 string of the pool's ID
 * @returns the pool's nonce
 */
declare const getPoolNonce: (poolId: string) => BigNumber;

declare class BalancerErrors {
    /**
     * Cannot be constructed.
     */
    private constructor();
    static isErrorCode: (error: string) => boolean;
    /**
     * Decodes a Balancer error code into the corresponding reason
     * @param error - a Balancer error code of the form `BAL#000`
     * @returns The decoded error reason
     */
    static parseErrorCode: (error: string) => string;
    /**
     * Decodes a Balancer error code into the corresponding reason
     * @param error - a Balancer error code of the form `BAL#000`
     * @returns The decoded error reason if passed a valid error code, otherwise returns passed input
     */
    static tryParseErrorCode: (error: string) => string;
    /**
     * Tests whether a string is a known Balancer error message
     * @param error - a string to be checked verified as a Balancer error message
     */
    static isBalancerError: (error: string) => boolean;
    /**
     * Encodes an error string into the corresponding error code
     * @param error - a Balancer error message string
     * @returns a Balancer error code of the form `BAL#000`
     */
    static encodeError: (error: string) => string;
}

declare type Account = string | Signer | Contract;
declare function accountToAddress(account: Account): Promise<string>;
declare enum RelayerAction {
    JoinPool = "JoinPool",
    ExitPool = "ExitPool",
    Swap = "Swap",
    BatchSwap = "BatchSwap",
    SetRelayerApproval = "SetRelayerApproval"
}
declare class RelayerAuthorization {
    /**
     * Cannot be constructed.
     */
    private constructor();
    static encodeCalldataAuthorization: (calldata: string, deadline: BigNumberish, signature: string) => string;
    static signJoinAuthorization: (validator: Contract, user: Signer & TypedDataSigner, allowedSender: Account, allowedCalldata: string, deadline?: BigNumberish | undefined, nonce?: BigNumberish | undefined) => Promise<string>;
    static signExitAuthorization: (validator: Contract, user: Signer & TypedDataSigner, allowedSender: Account, allowedCalldata: string, deadline?: BigNumberish | undefined, nonce?: BigNumberish | undefined) => Promise<string>;
    static signSwapAuthorization: (validator: Contract, user: Signer & TypedDataSigner, allowedSender: Account, allowedCalldata: string, deadline?: BigNumberish | undefined, nonce?: BigNumberish | undefined) => Promise<string>;
    static signBatchSwapAuthorization: (validator: Contract, user: Signer & TypedDataSigner, allowedSender: Account, allowedCalldata: string, deadline?: BigNumberish | undefined, nonce?: BigNumberish | undefined) => Promise<string>;
    static signSetRelayerApprovalAuthorization: (validator: Contract, user: Signer & TypedDataSigner, allowedSender: Account, allowedCalldata: string, deadline?: BigNumberish | undefined, nonce?: BigNumberish | undefined) => Promise<string>;
    static signAuthorizationFor: (type: RelayerAction, validator: Contract, user: Signer & TypedDataSigner, allowedSender: Account, allowedCalldata: string, deadline?: BigNumberish, nonce?: BigNumberish | undefined) => Promise<string>;
}

declare const signPermit: (token: Contract, owner: Signer & TypedDataSigner, spender: Account, amount: BigNumberish, deadline?: BigNumberish, nonce?: BigNumberish | undefined) => Promise<{
    v: number;
    r: string;
    s: string;
    deadline: BigNumber;
    nonce: BigNumber;
}>;

declare class AssetHelpers {
    readonly ETH: string;
    readonly WETH: string;
    constructor(wethAddress: string);
    static isEqual: (addressA: string, addressB: string) => boolean;
    /**
     * Tests whether `token` is ETH (represented by `0x0000...0000`).
     *
     * @param token - the address of the asset to be checked
     */
    isETH: (token: string) => boolean;
    /**
     * Tests whether `token` is WETH.
     *
     * @param token - the address of the asset to be checked
     */
    isWETH: (token: string) => boolean;
    /**
     * Converts an asset to the equivalent ERC20 address.
     *
     * For ERC20s this will return the passed address but passing ETH (`0x0000...0000`) will return the WETH address
     * @param token - the address of the asset to be translated to an equivalent ERC20
     * @returns the address of translated ERC20 asset
     */
    translateToERC20: (token: string) => string;
    /**
     * Sorts an array of token addresses into ascending order to match the format expected by the Vault.
     *
     * Passing additional arrays will result in each being sorted to maintain relative ordering to token addresses.
     *
     * The zero address (representing ETH) is sorted as if it were the WETH address.
     * This matches the behaviour expected by the Vault when receiving an array of addresses.
     *
     * @param tokens - an array of token addresses to be sorted in ascending order
     * @param others - a set of arrays to be sorted in the same order as the tokens, e.g. token weights or asset manager addresses
     * @returns an array of the form `[tokens, ...others]` where each subarray has been sorted to maintain its ordering relative to `tokens`
     *
     * @example
     * const [tokens] = sortTokens([tokenB, tokenC, tokenA])
     * const [tokens, weights] = sortTokens([tokenB, tokenC, tokenA], [weightB, weightC, weightA])
     * // where tokens = [tokenA, tokenB, tokenC], weights = [weightA, weightB, weightC]
     */
    sortTokens(tokens: string[], ...others: unknown[][]): [string[], ...unknown[][]];
}

declare class AaveHelpers {
    static getRate(rateProviderAddress: string, provider: JsonRpcProvider): Promise<string>;
}

declare const isSameAddress: (address1: string, address2: string) => boolean;

declare enum SwapType {
    SwapExactIn = 0,
    SwapExactOut = 1
}
declare type FundManagement = {
    sender: string;
    recipient: string;
    fromInternalBalance: boolean;
    toInternalBalance: boolean;
};
declare type SingleSwap = {
    poolId: string;
    kind: SwapType;
    assetIn: string;
    assetOut: string;
    amount: BigNumberish;
    userData: string;
};
declare type Swap = {
    kind: SwapType;
    singleSwap: SingleSwap;
    limit: BigNumberish;
    deadline: BigNumberish;
};
declare type BatchSwapStep = {
    poolId: string;
    assetInIndex: number;
    assetOutIndex: number;
    amount: string;
    userData: string;
};
declare type BatchSwap = {
    kind: SwapType;
    swaps: BatchSwapStep[];
    assets: string[];
    funds: FundManagement;
    limits: BigNumberish[];
    deadline: BigNumberish;
};
interface FetchPoolsInput {
    fetchPools: boolean;
    fetchOnChain: boolean;
}
interface QueryWithSorInput {
    tokensIn: string[];
    tokensOut: string[];
    swapType: SwapType;
    amounts: string[];
    fetchPools: FetchPoolsInput;
}
interface QueryWithSorOutput {
    returnAmounts: string[];
    swaps: BatchSwapStep[];
    assets: string[];
    deltas: string[];
}

/**
 * Helper to create limits using a defined slippage amount.
 * @param tokensIn - Array of token in addresses.
 * @param tokensOut - Array of token out addresses.
 * @param swapType - Type of swap - SwapExactIn or SwapExactOut
 * @param deltas - An array with the net Vault asset balance deltas. Positive amounts represent tokens (or ETH) sent to the Vault, and negative amounts represent tokens (or ETH) sent by the Vault. Each delta corresponds to the asset at the same index in the `assets` array.
 * @param assets - array contains the addresses of all assets involved in the swaps.
 * @param slippage - Slippage to be applied. i.e. 5%=50000000000000000.
 * @returns Returns an array (same length as assets) with limits applied for each asset.
 */
declare function getLimitsForSlippage(tokensIn: string[], tokensOut: string[], swapType: SwapType, deltas: BigNumberish[], assets: string[], slippage: BigNumberish): BigNumberish[];

declare class Swaps {
    private readonly sor;
    constructor(sorOrConfig: SOR | BalancerSdkConfig);
    static getLimitsForSlippage(tokensIn: string[], tokensOut: string[], swapType: SwapType, deltas: string[], assets: string[], slippage: string): string[];
    /**
     * fetchPools saves updated pools data to SOR internal onChainBalanceCache.
     * @param {SubgraphPoolBase[]} [poolsData=[]] If poolsData passed uses this as pools source otherwise fetches from config.subgraphUrl.
     * @param {boolean} [isOnChain=true] If isOnChain is true will retrieve all required onChain data via multicall otherwise uses subgraph values.
     * @returns {boolean} Boolean indicating whether pools data was fetched correctly (true) or not (false).
     */
    fetchPools(): Promise<boolean>;
    getPools(): SubgraphPoolBase[];
    /**
     * queryBatchSwap simulates a call to `batchSwap`, returning an array of Vault asset deltas.
     * @param batchSwap - BatchSwap information used for query.
     * @param {SwapType} batchSwap.kind - either exactIn or exactOut.
     * @param {BatchSwapStep[]} batchSwap.swaps - sequence of swaps.
     * @param {string[]} batchSwap.assets - array contains the addresses of all assets involved in the swaps.
     * @returns {Promise<string[]>} Returns an array with the net Vault asset balance deltas. Positive amounts represent tokens (or ETH) sent to the
     * Vault, and negative amounts represent tokens (or ETH) sent by the Vault. Each delta corresponds to the asset at
     * the same index in the `assets` array.
     */
    queryBatchSwap(batchSwap: Pick<BatchSwap, 'kind' | 'swaps' | 'assets'>): Promise<string[]>;
    /**
     * Uses SOR to create and query a batchSwap.
     * @param {QueryWithSorInput} queryWithSor - Swap information used for querying using SOR.
     * @param {string[]} queryWithSor.tokensIn - Array of addresses of assets in.
     * @param {string[]} queryWithSor.tokensOut - Array of addresses of assets out.
     * @param {SwapType} queryWithSor.swapType - Type of Swap, ExactIn/Out.
     * @param {string[]} queryWithSor.amounts - Array of amounts used in swap.
     * @param {FetchPoolsInput} queryWithSor.fetchPools - Set whether SOR will fetch updated pool info.
     * @returns {Promise<QueryWithSorOutput>} Returns amount of tokens swaps along with swap and asset info that can be submitted to a batchSwap call.
     */
    queryBatchSwapWithSor(queryWithSor: QueryWithSorInput): Promise<QueryWithSorOutput>;
}

declare type OutputReference = {
    index: number;
    key: BigNumber;
};
interface EncodeBatchSwapInput {
    swapType: SwapType;
    swaps: BatchSwapStep[];
    assets: string[];
    funds: FundManagement;
    limits: string[];
    deadline: BigNumberish;
    value: BigNumberish;
    outputReferences: OutputReference[];
}
interface EncodeExitPoolInput {
    poolId: string;
    poolKind: number;
    sender: string;
    recipient: string;
    outputReferences: OutputReference[];
    exitPoolRequest: ExitPoolRequest;
}
interface EncodeJoinPoolInput {
    poolId: string;
    poolKind: number;
    sender: string;
    recipient: string;
    joinPoolRequest: JoinPoolRequest;
    value: BigNumberish;
    outputReference: BigNumber;
}
interface EncodeUnwrapAaveStaticTokenInput {
    staticToken: string;
    sender: string;
    recipient: string;
    amount: BigNumberish;
    toUnderlying: boolean;
    outputReferences: BigNumberish;
}
interface EncodeUnwrapYearnVaultTokenInput {
    vaultToken: string;
    sender: string;
    recipient: string;
    amount: BigNumberish;
    outputReference: BigNumberish;
}
interface ExitStablePhantomInput {
    account: string;
    poolId: string;
    exits: {
        bptAmountIn: string;
        tokenOut: string;
        unwrap?: boolean;
    }[];
    slippage: string;
}
interface ExitAndBatchSwapInput {
    exiter: string;
    swapRecipient: string;
    poolId: string;
    exits: ExitAndBatchSwapExitItemInput[];
    userData: string;
    slippage: string;
    fetchPools: FetchPoolsInput;
    unwrap?: boolean;
}
interface ExitAndBatchSwapExitItemInput {
    exitToken: string;
    exitExpectedAmountOut: string;
    batchSwapTokenOut?: string;
}
declare type ExitPoolData = ExitPoolRequest & EncodeExitPoolInput;
interface NestedLinearPool {
    pool: SubgraphPoolBase;
    mainToken: string;
    poolTokenAddress: string;
    wrappedToken: string;
}
interface BatchRelayerJoinPool {
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
    mintXSonar?: boolean;
}
interface EncodeBooMirrorWorldEnterInput {
    sender: string;
    recipient: string;
    amount: BigNumberish;
    outputReference: BigNumberish;
}
interface EncodeBooMirrorWorldLeaveInput {
    sender: string;
    recipient: string;
    amount: BigNumberish;
    outputReference: BigNumberish;
}
interface EncodeXSonarBarEnterInput {
    sender: string;
    recipient: string;
    amount: BigNumberish;
    outputReference: BigNumberish;
}
interface EncodeXSonarBarLeaveInput {
    sender: string;
    recipient: string;
    amount: BigNumberish;
    outputReference: BigNumberish;
}
interface EncodeMasterChefDepositInput {
    sender: string;
    recipient: string;
    token: string;
    pid: number;
    amount: BigNumberish;
    outputReference: BigNumberish;
}
interface EncodeMasterChefWithdrawInput {
    recipient: string;
    pid: number;
    amount: BigNumberish;
    outputReference: BigNumberish;
}

declare class Relayer {
    private readonly swaps;
    private readonly config;
    static CHAINED_REFERENCE_PREFIX: string;
    private vaultActionsService;
    private aaveWrappingService;
    private booMirrorWorldStaking;
    private xSonarBarStakingService;
    private masterChefStakingService;
    private yearnWrappingService;
    private batchRelayerAddress;
    constructor(swaps: Swaps, config: BalancerNetworkConfig);
    static toChainedReference(key: BigNumberish): BigNumber;
    /**
     * fetchPools saves updated pools data to SOR internal onChainBalanceCache.
     * @param {SubgraphPoolBase[]} [poolsData=[]] If poolsData passed uses this as pools source otherwise fetches from config.subgraphUrl.
     * @param {boolean} [isOnChain=true] If isOnChain is true will retrieve all required onChain data via multicall otherwise uses subgraph values.
     * @returns {boolean} Boolean indicating whether pools data was fetched correctly (true) or not (false).
     */
    fetchPools(): Promise<boolean>;
    getPools(): SubgraphPoolBase[];
    private get poolMap();
    private get linearPoolMap();
    private get linearPoolWrappedTokenMap();
    private get stablePhantomMap();
    /**
     * exitPoolAndBatchSwap Chains poolExit with batchSwap to final tokens.
     * @param {ExitAndBatchSwapInput} params
     * @param {string} params.exiter - Address used to exit pool.
     * @param {string} params.swapRecipient - Address that receives final tokens.
     * @param {string} params.poolId - Id of pool being exited.
     * @param {string[]} params.exitTokens - Array containing addresses of tokens to receive after exiting pool. (must have the same length and order as the array returned by `getPoolTokens`.)
     * @param {string} params.userData - Encoded exitPool data.
     * @param {string[]} params.expectedAmountsOut - Expected amounts of exitTokens to receive when exiting pool.
     * @param {string[]} params.batchSwapTokensIn - Array containing the addresses of the input to the batchSwap.
     * @param {string[]} params.batchSwapTokensOut - Array containing the addresses of the output tokens from the batchSwap.
     * @param {string} params.slippage - Slippage to be applied to swap section. i.e. 5%=50000000000000000.
     * @param {string} params.unwrap - Whether an unrwap should be applied to any wrapped tokens in batchSwapTokensOut
     * @param {FetchPoolsInput} params.fetchPools - Set whether SOR will fetch updated pool info.
     * @returns Transaction data with calldata. Outputs.amountsOut has amounts of batchSwapTokensOut returned.
     */
    exitPoolAndBatchSwap(params: ExitAndBatchSwapInput): Promise<TransactionData>;
    joinPool({ poolId, tokens, bptOut, fetchPools, slippage, funds, farmId, mintXSonar, }: BatchRelayerJoinPool): Promise<TransactionData>;
    private getNestedLinearPools;
    private getRequiredPool;
    private getRequiredLinearPoolForWrappedToken;
    private getTokenAmountScaled;
    private getLinearPoolType;
    /**
     * swapUnwrapExactIn Finds swaps for tokenIn>wrapped tokens and chains with unwrap to underlying stable.
     * @param {string[]} tokensIn - array to token addresses for swapping as tokens in.
     * @param {string[]} wrappedTokens - array contains the addresses of the wrapped tokens that tokenIn will be swapped to. These will be unwrapped.
     * @param {string[]} amountsIn - amounts to be swapped for each token in.
     * @param {string[]} rates - The rate used to convert wrappedToken to underlying.
     * @param {FundManagement} funds - Funding info for swap. Note - recipient should be relayer and sender should be caller.
     * @param {string} slippage - Slippage to be applied to swap section. i.e. 5%=50000000000000000.
     * @param {FetchPoolsInput} fetchPools - Set whether SOR will fetch updated pool info.
     * @returns Transaction data with calldata. Outputs.amountsOut has final amounts out of unwrapped tokens.
     */
    swapUnwrapExactIn(tokensIn: string[], wrappedTokens: string[], amountsIn: string[], rates: string[], funds: FundManagement, slippage: string, fetchPools?: FetchPoolsInput): Promise<TransactionData>;
    swapAndUnwrapStablePhantomPool({ poolId, slippage, exits, account, }: ExitStablePhantomInput): Promise<TransactionData>;
    /**
     * swapUnwrapExactOut Finds swaps for tokenIn>wrapped tokens and chains with unwrap to underlying stable.
     * @param {string[]} tokensIn - array to token addresses for swapping as tokens in.
     * @param {string[]} wrappedTokens - array contains the addresses of the wrapped tokens that tokenIn will be swapped to. These will be unwrapped.
     * @param {string[]} amountsUnwrapped - amounts of unwrapped tokens out.
     * @param {string[]} rates - The rate used to convert wrappedToken to underlying.
     * @param {FundManagement} funds - Funding info for swap. Note - recipient should be relayer and sender should be caller.
     * @param {string} slippage - Slippage to be applied to swap section. i.e. 5%=50000000000000000.
     * @param {FetchPoolsInput} fetchPools - Set whether SOR will fetch updated pool info.
     * @returns Transaction data with calldata. Outputs.amountsIn has the amounts of tokensIn.
     */
    swapUnwrapExactOut(tokensIn: string[], wrappedTokens: string[], amountsUnwrapped: string[], rates: string[], funds: FundManagement, slippage: string, fetchPools?: FetchPoolsInput): Promise<TransactionData>;
    /**
     * Creates encoded multicalls using swap outputs as input amounts for token unwrap.
     * @param wrappedTokens
     * @param swapType
     * @param swaps
     * @param assets
     * @param funds
     * @param limits
     * @returns
     */
    encodeSwapUnwrap(wrappedTokens: string[], swapType: SwapType, swaps: BatchSwapStep[], assets: string[], funds: FundManagement, limits: BigNumberish[]): string[];
    encodeUnwrapCalls(wrappedTokens: string[], assets: string[], funds: FundManagement): {
        unwrapCalls: string[];
        outputReferences: OutputReference[];
    };
}

declare type Maybe<T> = T | null;
declare type InputMaybe<T> = Maybe<T>;
declare type Exact<T extends {
    [key: string]: unknown;
}> = {
    [K in keyof T]: T[K];
};
/** All built-in and custom scalars, mapped to their actual values */
declare type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    BigDecimal: string;
    BigInt: string;
    Bytes: string;
};
declare type Balancer_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    id?: InputMaybe<Scalars['ID']>;
    id_gt?: InputMaybe<Scalars['ID']>;
    id_gte?: InputMaybe<Scalars['ID']>;
    id_in?: InputMaybe<Array<Scalars['ID']>>;
    id_lt?: InputMaybe<Scalars['ID']>;
    id_lte?: InputMaybe<Scalars['ID']>;
    id_not?: InputMaybe<Scalars['ID']>;
    id_not_in?: InputMaybe<Array<Scalars['ID']>>;
    poolCount?: InputMaybe<Scalars['Int']>;
    poolCount_gt?: InputMaybe<Scalars['Int']>;
    poolCount_gte?: InputMaybe<Scalars['Int']>;
    poolCount_in?: InputMaybe<Array<Scalars['Int']>>;
    poolCount_lt?: InputMaybe<Scalars['Int']>;
    poolCount_lte?: InputMaybe<Scalars['Int']>;
    poolCount_not?: InputMaybe<Scalars['Int']>;
    poolCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
    totalLiquidity?: InputMaybe<Scalars['BigDecimal']>;
    totalLiquidity_gt?: InputMaybe<Scalars['BigDecimal']>;
    totalLiquidity_gte?: InputMaybe<Scalars['BigDecimal']>;
    totalLiquidity_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    totalLiquidity_lt?: InputMaybe<Scalars['BigDecimal']>;
    totalLiquidity_lte?: InputMaybe<Scalars['BigDecimal']>;
    totalLiquidity_not?: InputMaybe<Scalars['BigDecimal']>;
    totalLiquidity_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    totalSwapCount?: InputMaybe<Scalars['BigInt']>;
    totalSwapCount_gt?: InputMaybe<Scalars['BigInt']>;
    totalSwapCount_gte?: InputMaybe<Scalars['BigInt']>;
    totalSwapCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
    totalSwapCount_lt?: InputMaybe<Scalars['BigInt']>;
    totalSwapCount_lte?: InputMaybe<Scalars['BigInt']>;
    totalSwapCount_not?: InputMaybe<Scalars['BigInt']>;
    totalSwapCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    totalSwapFee?: InputMaybe<Scalars['BigDecimal']>;
    totalSwapFee_gt?: InputMaybe<Scalars['BigDecimal']>;
    totalSwapFee_gte?: InputMaybe<Scalars['BigDecimal']>;
    totalSwapFee_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    totalSwapFee_lt?: InputMaybe<Scalars['BigDecimal']>;
    totalSwapFee_lte?: InputMaybe<Scalars['BigDecimal']>;
    totalSwapFee_not?: InputMaybe<Scalars['BigDecimal']>;
    totalSwapFee_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    totalSwapVolume?: InputMaybe<Scalars['BigDecimal']>;
    totalSwapVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
    totalSwapVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
    totalSwapVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    totalSwapVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
    totalSwapVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
    totalSwapVolume_not?: InputMaybe<Scalars['BigDecimal']>;
    totalSwapVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
};
declare enum Balancer_OrderBy {
    Id = "id",
    PoolCount = "poolCount",
    Pools = "pools",
    TotalLiquidity = "totalLiquidity",
    TotalSwapCount = "totalSwapCount",
    TotalSwapFee = "totalSwapFee",
    TotalSwapVolume = "totalSwapVolume"
}
declare type BlockChangedFilter = {
    number_gte: Scalars['Int'];
};
declare type Block_Height = {
    hash?: InputMaybe<Scalars['Bytes']>;
    number?: InputMaybe<Scalars['Int']>;
    number_gte?: InputMaybe<Scalars['Int']>;
};
declare enum InvestType {
    Exit = "Exit",
    Join = "Join"
}
declare type JoinExit_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    amounts?: InputMaybe<Array<Scalars['BigDecimal']>>;
    amounts_contains?: InputMaybe<Array<Scalars['BigDecimal']>>;
    amounts_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']>>;
    amounts_not?: InputMaybe<Array<Scalars['BigDecimal']>>;
    amounts_not_contains?: InputMaybe<Array<Scalars['BigDecimal']>>;
    amounts_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']>>;
    id?: InputMaybe<Scalars['ID']>;
    id_gt?: InputMaybe<Scalars['ID']>;
    id_gte?: InputMaybe<Scalars['ID']>;
    id_in?: InputMaybe<Array<Scalars['ID']>>;
    id_lt?: InputMaybe<Scalars['ID']>;
    id_lte?: InputMaybe<Scalars['ID']>;
    id_not?: InputMaybe<Scalars['ID']>;
    id_not_in?: InputMaybe<Array<Scalars['ID']>>;
    pool?: InputMaybe<Scalars['String']>;
    pool_contains?: InputMaybe<Scalars['String']>;
    pool_contains_nocase?: InputMaybe<Scalars['String']>;
    pool_ends_with?: InputMaybe<Scalars['String']>;
    pool_ends_with_nocase?: InputMaybe<Scalars['String']>;
    pool_gt?: InputMaybe<Scalars['String']>;
    pool_gte?: InputMaybe<Scalars['String']>;
    pool_in?: InputMaybe<Array<Scalars['String']>>;
    pool_lt?: InputMaybe<Scalars['String']>;
    pool_lte?: InputMaybe<Scalars['String']>;
    pool_not?: InputMaybe<Scalars['String']>;
    pool_not_contains?: InputMaybe<Scalars['String']>;
    pool_not_contains_nocase?: InputMaybe<Scalars['String']>;
    pool_not_ends_with?: InputMaybe<Scalars['String']>;
    pool_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    pool_not_in?: InputMaybe<Array<Scalars['String']>>;
    pool_not_starts_with?: InputMaybe<Scalars['String']>;
    pool_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    pool_starts_with?: InputMaybe<Scalars['String']>;
    pool_starts_with_nocase?: InputMaybe<Scalars['String']>;
    sender?: InputMaybe<Scalars['Bytes']>;
    sender_contains?: InputMaybe<Scalars['Bytes']>;
    sender_in?: InputMaybe<Array<Scalars['Bytes']>>;
    sender_not?: InputMaybe<Scalars['Bytes']>;
    sender_not_contains?: InputMaybe<Scalars['Bytes']>;
    sender_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
    timestamp?: InputMaybe<Scalars['Int']>;
    timestamp_gt?: InputMaybe<Scalars['Int']>;
    timestamp_gte?: InputMaybe<Scalars['Int']>;
    timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
    timestamp_lt?: InputMaybe<Scalars['Int']>;
    timestamp_lte?: InputMaybe<Scalars['Int']>;
    timestamp_not?: InputMaybe<Scalars['Int']>;
    timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
    tx?: InputMaybe<Scalars['Bytes']>;
    tx_contains?: InputMaybe<Scalars['Bytes']>;
    tx_in?: InputMaybe<Array<Scalars['Bytes']>>;
    tx_not?: InputMaybe<Scalars['Bytes']>;
    tx_not_contains?: InputMaybe<Scalars['Bytes']>;
    tx_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
    type?: InputMaybe<InvestType>;
    type_in?: InputMaybe<Array<InvestType>>;
    type_not?: InputMaybe<InvestType>;
    type_not_in?: InputMaybe<Array<InvestType>>;
    user?: InputMaybe<Scalars['String']>;
    user_contains?: InputMaybe<Scalars['String']>;
    user_contains_nocase?: InputMaybe<Scalars['String']>;
    user_ends_with?: InputMaybe<Scalars['String']>;
    user_ends_with_nocase?: InputMaybe<Scalars['String']>;
    user_gt?: InputMaybe<Scalars['String']>;
    user_gte?: InputMaybe<Scalars['String']>;
    user_in?: InputMaybe<Array<Scalars['String']>>;
    user_lt?: InputMaybe<Scalars['String']>;
    user_lte?: InputMaybe<Scalars['String']>;
    user_not?: InputMaybe<Scalars['String']>;
    user_not_contains?: InputMaybe<Scalars['String']>;
    user_not_contains_nocase?: InputMaybe<Scalars['String']>;
    user_not_ends_with?: InputMaybe<Scalars['String']>;
    user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    user_not_in?: InputMaybe<Array<Scalars['String']>>;
    user_not_starts_with?: InputMaybe<Scalars['String']>;
    user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    user_starts_with?: InputMaybe<Scalars['String']>;
    user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};
declare enum JoinExit_OrderBy {
    Amounts = "amounts",
    Id = "id",
    Pool = "pool",
    Sender = "sender",
    Timestamp = "timestamp",
    Tx = "tx",
    Type = "type",
    User = "user"
}
declare type LatestPrice_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    asset?: InputMaybe<Scalars['Bytes']>;
    asset_contains?: InputMaybe<Scalars['Bytes']>;
    asset_in?: InputMaybe<Array<Scalars['Bytes']>>;
    asset_not?: InputMaybe<Scalars['Bytes']>;
    asset_not_contains?: InputMaybe<Scalars['Bytes']>;
    asset_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
    block?: InputMaybe<Scalars['BigInt']>;
    block_gt?: InputMaybe<Scalars['BigInt']>;
    block_gte?: InputMaybe<Scalars['BigInt']>;
    block_in?: InputMaybe<Array<Scalars['BigInt']>>;
    block_lt?: InputMaybe<Scalars['BigInt']>;
    block_lte?: InputMaybe<Scalars['BigInt']>;
    block_not?: InputMaybe<Scalars['BigInt']>;
    block_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    id?: InputMaybe<Scalars['ID']>;
    id_gt?: InputMaybe<Scalars['ID']>;
    id_gte?: InputMaybe<Scalars['ID']>;
    id_in?: InputMaybe<Array<Scalars['ID']>>;
    id_lt?: InputMaybe<Scalars['ID']>;
    id_lte?: InputMaybe<Scalars['ID']>;
    id_not?: InputMaybe<Scalars['ID']>;
    id_not_in?: InputMaybe<Array<Scalars['ID']>>;
    poolId?: InputMaybe<Scalars['String']>;
    poolId_contains?: InputMaybe<Scalars['String']>;
    poolId_contains_nocase?: InputMaybe<Scalars['String']>;
    poolId_ends_with?: InputMaybe<Scalars['String']>;
    poolId_ends_with_nocase?: InputMaybe<Scalars['String']>;
    poolId_gt?: InputMaybe<Scalars['String']>;
    poolId_gte?: InputMaybe<Scalars['String']>;
    poolId_in?: InputMaybe<Array<Scalars['String']>>;
    poolId_lt?: InputMaybe<Scalars['String']>;
    poolId_lte?: InputMaybe<Scalars['String']>;
    poolId_not?: InputMaybe<Scalars['String']>;
    poolId_not_contains?: InputMaybe<Scalars['String']>;
    poolId_not_contains_nocase?: InputMaybe<Scalars['String']>;
    poolId_not_ends_with?: InputMaybe<Scalars['String']>;
    poolId_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    poolId_not_in?: InputMaybe<Array<Scalars['String']>>;
    poolId_not_starts_with?: InputMaybe<Scalars['String']>;
    poolId_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    poolId_starts_with?: InputMaybe<Scalars['String']>;
    poolId_starts_with_nocase?: InputMaybe<Scalars['String']>;
    price?: InputMaybe<Scalars['BigDecimal']>;
    price_gt?: InputMaybe<Scalars['BigDecimal']>;
    price_gte?: InputMaybe<Scalars['BigDecimal']>;
    price_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    price_lt?: InputMaybe<Scalars['BigDecimal']>;
    price_lte?: InputMaybe<Scalars['BigDecimal']>;
    price_not?: InputMaybe<Scalars['BigDecimal']>;
    price_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    pricingAsset?: InputMaybe<Scalars['Bytes']>;
    pricingAsset_contains?: InputMaybe<Scalars['Bytes']>;
    pricingAsset_in?: InputMaybe<Array<Scalars['Bytes']>>;
    pricingAsset_not?: InputMaybe<Scalars['Bytes']>;
    pricingAsset_not_contains?: InputMaybe<Scalars['Bytes']>;
    pricingAsset_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};
declare enum LatestPrice_OrderBy {
    Asset = "asset",
    Block = "block",
    Id = "id",
    PoolId = "poolId",
    Price = "price",
    PricingAsset = "pricingAsset"
}
/** Defines the order direction, either ascending or descending */
declare enum OrderDirection {
    Asc = "asc",
    Desc = "desc"
}
declare type PoolHistoricalLiquidity_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    block?: InputMaybe<Scalars['BigInt']>;
    block_gt?: InputMaybe<Scalars['BigInt']>;
    block_gte?: InputMaybe<Scalars['BigInt']>;
    block_in?: InputMaybe<Array<Scalars['BigInt']>>;
    block_lt?: InputMaybe<Scalars['BigInt']>;
    block_lte?: InputMaybe<Scalars['BigInt']>;
    block_not?: InputMaybe<Scalars['BigInt']>;
    block_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    id?: InputMaybe<Scalars['ID']>;
    id_gt?: InputMaybe<Scalars['ID']>;
    id_gte?: InputMaybe<Scalars['ID']>;
    id_in?: InputMaybe<Array<Scalars['ID']>>;
    id_lt?: InputMaybe<Scalars['ID']>;
    id_lte?: InputMaybe<Scalars['ID']>;
    id_not?: InputMaybe<Scalars['ID']>;
    id_not_in?: InputMaybe<Array<Scalars['ID']>>;
    poolId?: InputMaybe<Scalars['String']>;
    poolId_contains?: InputMaybe<Scalars['String']>;
    poolId_contains_nocase?: InputMaybe<Scalars['String']>;
    poolId_ends_with?: InputMaybe<Scalars['String']>;
    poolId_ends_with_nocase?: InputMaybe<Scalars['String']>;
    poolId_gt?: InputMaybe<Scalars['String']>;
    poolId_gte?: InputMaybe<Scalars['String']>;
    poolId_in?: InputMaybe<Array<Scalars['String']>>;
    poolId_lt?: InputMaybe<Scalars['String']>;
    poolId_lte?: InputMaybe<Scalars['String']>;
    poolId_not?: InputMaybe<Scalars['String']>;
    poolId_not_contains?: InputMaybe<Scalars['String']>;
    poolId_not_contains_nocase?: InputMaybe<Scalars['String']>;
    poolId_not_ends_with?: InputMaybe<Scalars['String']>;
    poolId_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    poolId_not_in?: InputMaybe<Array<Scalars['String']>>;
    poolId_not_starts_with?: InputMaybe<Scalars['String']>;
    poolId_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    poolId_starts_with?: InputMaybe<Scalars['String']>;
    poolId_starts_with_nocase?: InputMaybe<Scalars['String']>;
    poolLiquidity?: InputMaybe<Scalars['BigDecimal']>;
    poolLiquidity_gt?: InputMaybe<Scalars['BigDecimal']>;
    poolLiquidity_gte?: InputMaybe<Scalars['BigDecimal']>;
    poolLiquidity_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    poolLiquidity_lt?: InputMaybe<Scalars['BigDecimal']>;
    poolLiquidity_lte?: InputMaybe<Scalars['BigDecimal']>;
    poolLiquidity_not?: InputMaybe<Scalars['BigDecimal']>;
    poolLiquidity_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    poolShareValue?: InputMaybe<Scalars['BigDecimal']>;
    poolShareValue_gt?: InputMaybe<Scalars['BigDecimal']>;
    poolShareValue_gte?: InputMaybe<Scalars['BigDecimal']>;
    poolShareValue_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    poolShareValue_lt?: InputMaybe<Scalars['BigDecimal']>;
    poolShareValue_lte?: InputMaybe<Scalars['BigDecimal']>;
    poolShareValue_not?: InputMaybe<Scalars['BigDecimal']>;
    poolShareValue_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    poolTotalShares?: InputMaybe<Scalars['BigDecimal']>;
    poolTotalShares_gt?: InputMaybe<Scalars['BigDecimal']>;
    poolTotalShares_gte?: InputMaybe<Scalars['BigDecimal']>;
    poolTotalShares_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    poolTotalShares_lt?: InputMaybe<Scalars['BigDecimal']>;
    poolTotalShares_lte?: InputMaybe<Scalars['BigDecimal']>;
    poolTotalShares_not?: InputMaybe<Scalars['BigDecimal']>;
    poolTotalShares_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    pricingAsset?: InputMaybe<Scalars['Bytes']>;
    pricingAsset_contains?: InputMaybe<Scalars['Bytes']>;
    pricingAsset_in?: InputMaybe<Array<Scalars['Bytes']>>;
    pricingAsset_not?: InputMaybe<Scalars['Bytes']>;
    pricingAsset_not_contains?: InputMaybe<Scalars['Bytes']>;
    pricingAsset_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};
declare enum PoolHistoricalLiquidity_OrderBy {
    Block = "block",
    Id = "id",
    PoolId = "poolId",
    PoolLiquidity = "poolLiquidity",
    PoolShareValue = "poolShareValue",
    PoolTotalShares = "poolTotalShares",
    PricingAsset = "pricingAsset"
}
declare type PoolSnapshot_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    amounts?: InputMaybe<Array<Scalars['BigDecimal']>>;
    amounts_contains?: InputMaybe<Array<Scalars['BigDecimal']>>;
    amounts_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']>>;
    amounts_not?: InputMaybe<Array<Scalars['BigDecimal']>>;
    amounts_not_contains?: InputMaybe<Array<Scalars['BigDecimal']>>;
    amounts_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']>>;
    id?: InputMaybe<Scalars['ID']>;
    id_gt?: InputMaybe<Scalars['ID']>;
    id_gte?: InputMaybe<Scalars['ID']>;
    id_in?: InputMaybe<Array<Scalars['ID']>>;
    id_lt?: InputMaybe<Scalars['ID']>;
    id_lte?: InputMaybe<Scalars['ID']>;
    id_not?: InputMaybe<Scalars['ID']>;
    id_not_in?: InputMaybe<Array<Scalars['ID']>>;
    liquidity?: InputMaybe<Scalars['BigDecimal']>;
    liquidity_gt?: InputMaybe<Scalars['BigDecimal']>;
    liquidity_gte?: InputMaybe<Scalars['BigDecimal']>;
    liquidity_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    liquidity_lt?: InputMaybe<Scalars['BigDecimal']>;
    liquidity_lte?: InputMaybe<Scalars['BigDecimal']>;
    liquidity_not?: InputMaybe<Scalars['BigDecimal']>;
    liquidity_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    pool?: InputMaybe<Scalars['String']>;
    pool_contains?: InputMaybe<Scalars['String']>;
    pool_contains_nocase?: InputMaybe<Scalars['String']>;
    pool_ends_with?: InputMaybe<Scalars['String']>;
    pool_ends_with_nocase?: InputMaybe<Scalars['String']>;
    pool_gt?: InputMaybe<Scalars['String']>;
    pool_gte?: InputMaybe<Scalars['String']>;
    pool_in?: InputMaybe<Array<Scalars['String']>>;
    pool_lt?: InputMaybe<Scalars['String']>;
    pool_lte?: InputMaybe<Scalars['String']>;
    pool_not?: InputMaybe<Scalars['String']>;
    pool_not_contains?: InputMaybe<Scalars['String']>;
    pool_not_contains_nocase?: InputMaybe<Scalars['String']>;
    pool_not_ends_with?: InputMaybe<Scalars['String']>;
    pool_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    pool_not_in?: InputMaybe<Array<Scalars['String']>>;
    pool_not_starts_with?: InputMaybe<Scalars['String']>;
    pool_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    pool_starts_with?: InputMaybe<Scalars['String']>;
    pool_starts_with_nocase?: InputMaybe<Scalars['String']>;
    swapFees?: InputMaybe<Scalars['BigDecimal']>;
    swapFees_gt?: InputMaybe<Scalars['BigDecimal']>;
    swapFees_gte?: InputMaybe<Scalars['BigDecimal']>;
    swapFees_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    swapFees_lt?: InputMaybe<Scalars['BigDecimal']>;
    swapFees_lte?: InputMaybe<Scalars['BigDecimal']>;
    swapFees_not?: InputMaybe<Scalars['BigDecimal']>;
    swapFees_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    swapVolume?: InputMaybe<Scalars['BigDecimal']>;
    swapVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
    swapVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
    swapVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    swapVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
    swapVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
    swapVolume_not?: InputMaybe<Scalars['BigDecimal']>;
    swapVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    timestamp?: InputMaybe<Scalars['Int']>;
    timestamp_gt?: InputMaybe<Scalars['Int']>;
    timestamp_gte?: InputMaybe<Scalars['Int']>;
    timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
    timestamp_lt?: InputMaybe<Scalars['Int']>;
    timestamp_lte?: InputMaybe<Scalars['Int']>;
    timestamp_not?: InputMaybe<Scalars['Int']>;
    timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
    totalShares?: InputMaybe<Scalars['BigDecimal']>;
    totalShares_gt?: InputMaybe<Scalars['BigDecimal']>;
    totalShares_gte?: InputMaybe<Scalars['BigDecimal']>;
    totalShares_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    totalShares_lt?: InputMaybe<Scalars['BigDecimal']>;
    totalShares_lte?: InputMaybe<Scalars['BigDecimal']>;
    totalShares_not?: InputMaybe<Scalars['BigDecimal']>;
    totalShares_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
};
declare enum PoolSnapshot_OrderBy {
    Amounts = "amounts",
    Id = "id",
    Liquidity = "liquidity",
    Pool = "pool",
    SwapFees = "swapFees",
    SwapVolume = "swapVolume",
    Timestamp = "timestamp",
    TotalShares = "totalShares"
}
declare type Pool_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    address?: InputMaybe<Scalars['Bytes']>;
    address_contains?: InputMaybe<Scalars['Bytes']>;
    address_in?: InputMaybe<Array<Scalars['Bytes']>>;
    address_not?: InputMaybe<Scalars['Bytes']>;
    address_not_contains?: InputMaybe<Scalars['Bytes']>;
    address_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
    amp?: InputMaybe<Scalars['BigInt']>;
    amp_gt?: InputMaybe<Scalars['BigInt']>;
    amp_gte?: InputMaybe<Scalars['BigInt']>;
    amp_in?: InputMaybe<Array<Scalars['BigInt']>>;
    amp_lt?: InputMaybe<Scalars['BigInt']>;
    amp_lte?: InputMaybe<Scalars['BigInt']>;
    amp_not?: InputMaybe<Scalars['BigInt']>;
    amp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    baseToken?: InputMaybe<Scalars['Bytes']>;
    baseToken_contains?: InputMaybe<Scalars['Bytes']>;
    baseToken_in?: InputMaybe<Array<Scalars['Bytes']>>;
    baseToken_not?: InputMaybe<Scalars['Bytes']>;
    baseToken_not_contains?: InputMaybe<Scalars['Bytes']>;
    baseToken_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
    createTime?: InputMaybe<Scalars['Int']>;
    createTime_gt?: InputMaybe<Scalars['Int']>;
    createTime_gte?: InputMaybe<Scalars['Int']>;
    createTime_in?: InputMaybe<Array<Scalars['Int']>>;
    createTime_lt?: InputMaybe<Scalars['Int']>;
    createTime_lte?: InputMaybe<Scalars['Int']>;
    createTime_not?: InputMaybe<Scalars['Int']>;
    createTime_not_in?: InputMaybe<Array<Scalars['Int']>>;
    expiryTime?: InputMaybe<Scalars['BigInt']>;
    expiryTime_gt?: InputMaybe<Scalars['BigInt']>;
    expiryTime_gte?: InputMaybe<Scalars['BigInt']>;
    expiryTime_in?: InputMaybe<Array<Scalars['BigInt']>>;
    expiryTime_lt?: InputMaybe<Scalars['BigInt']>;
    expiryTime_lte?: InputMaybe<Scalars['BigInt']>;
    expiryTime_not?: InputMaybe<Scalars['BigInt']>;
    expiryTime_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    factory?: InputMaybe<Scalars['Bytes']>;
    factory_contains?: InputMaybe<Scalars['Bytes']>;
    factory_in?: InputMaybe<Array<Scalars['Bytes']>>;
    factory_not?: InputMaybe<Scalars['Bytes']>;
    factory_not_contains?: InputMaybe<Scalars['Bytes']>;
    factory_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
    holdersCount?: InputMaybe<Scalars['BigInt']>;
    holdersCount_gt?: InputMaybe<Scalars['BigInt']>;
    holdersCount_gte?: InputMaybe<Scalars['BigInt']>;
    holdersCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
    holdersCount_lt?: InputMaybe<Scalars['BigInt']>;
    holdersCount_lte?: InputMaybe<Scalars['BigInt']>;
    holdersCount_not?: InputMaybe<Scalars['BigInt']>;
    holdersCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    id?: InputMaybe<Scalars['ID']>;
    id_gt?: InputMaybe<Scalars['ID']>;
    id_gte?: InputMaybe<Scalars['ID']>;
    id_in?: InputMaybe<Array<Scalars['ID']>>;
    id_lt?: InputMaybe<Scalars['ID']>;
    id_lte?: InputMaybe<Scalars['ID']>;
    id_not?: InputMaybe<Scalars['ID']>;
    id_not_in?: InputMaybe<Array<Scalars['ID']>>;
    lowerTarget?: InputMaybe<Scalars['BigDecimal']>;
    lowerTarget_gt?: InputMaybe<Scalars['BigDecimal']>;
    lowerTarget_gte?: InputMaybe<Scalars['BigDecimal']>;
    lowerTarget_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    lowerTarget_lt?: InputMaybe<Scalars['BigDecimal']>;
    lowerTarget_lte?: InputMaybe<Scalars['BigDecimal']>;
    lowerTarget_not?: InputMaybe<Scalars['BigDecimal']>;
    lowerTarget_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    mainIndex?: InputMaybe<Scalars['Int']>;
    mainIndex_gt?: InputMaybe<Scalars['Int']>;
    mainIndex_gte?: InputMaybe<Scalars['Int']>;
    mainIndex_in?: InputMaybe<Array<Scalars['Int']>>;
    mainIndex_lt?: InputMaybe<Scalars['Int']>;
    mainIndex_lte?: InputMaybe<Scalars['Int']>;
    mainIndex_not?: InputMaybe<Scalars['Int']>;
    mainIndex_not_in?: InputMaybe<Array<Scalars['Int']>>;
    managementFee?: InputMaybe<Scalars['BigDecimal']>;
    managementFee_gt?: InputMaybe<Scalars['BigDecimal']>;
    managementFee_gte?: InputMaybe<Scalars['BigDecimal']>;
    managementFee_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    managementFee_lt?: InputMaybe<Scalars['BigDecimal']>;
    managementFee_lte?: InputMaybe<Scalars['BigDecimal']>;
    managementFee_not?: InputMaybe<Scalars['BigDecimal']>;
    managementFee_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    name?: InputMaybe<Scalars['String']>;
    name_contains?: InputMaybe<Scalars['String']>;
    name_contains_nocase?: InputMaybe<Scalars['String']>;
    name_ends_with?: InputMaybe<Scalars['String']>;
    name_ends_with_nocase?: InputMaybe<Scalars['String']>;
    name_gt?: InputMaybe<Scalars['String']>;
    name_gte?: InputMaybe<Scalars['String']>;
    name_in?: InputMaybe<Array<Scalars['String']>>;
    name_lt?: InputMaybe<Scalars['String']>;
    name_lte?: InputMaybe<Scalars['String']>;
    name_not?: InputMaybe<Scalars['String']>;
    name_not_contains?: InputMaybe<Scalars['String']>;
    name_not_contains_nocase?: InputMaybe<Scalars['String']>;
    name_not_ends_with?: InputMaybe<Scalars['String']>;
    name_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    name_not_in?: InputMaybe<Array<Scalars['String']>>;
    name_not_starts_with?: InputMaybe<Scalars['String']>;
    name_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    name_starts_with?: InputMaybe<Scalars['String']>;
    name_starts_with_nocase?: InputMaybe<Scalars['String']>;
    owner?: InputMaybe<Scalars['Bytes']>;
    owner_contains?: InputMaybe<Scalars['Bytes']>;
    owner_in?: InputMaybe<Array<Scalars['Bytes']>>;
    owner_not?: InputMaybe<Scalars['Bytes']>;
    owner_not_contains?: InputMaybe<Scalars['Bytes']>;
    owner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
    poolType?: InputMaybe<Scalars['String']>;
    poolType_contains?: InputMaybe<Scalars['String']>;
    poolType_contains_nocase?: InputMaybe<Scalars['String']>;
    poolType_ends_with?: InputMaybe<Scalars['String']>;
    poolType_ends_with_nocase?: InputMaybe<Scalars['String']>;
    poolType_gt?: InputMaybe<Scalars['String']>;
    poolType_gte?: InputMaybe<Scalars['String']>;
    poolType_in?: InputMaybe<Array<Scalars['String']>>;
    poolType_lt?: InputMaybe<Scalars['String']>;
    poolType_lte?: InputMaybe<Scalars['String']>;
    poolType_not?: InputMaybe<Scalars['String']>;
    poolType_not_contains?: InputMaybe<Scalars['String']>;
    poolType_not_contains_nocase?: InputMaybe<Scalars['String']>;
    poolType_not_ends_with?: InputMaybe<Scalars['String']>;
    poolType_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    poolType_not_in?: InputMaybe<Array<Scalars['String']>>;
    poolType_not_starts_with?: InputMaybe<Scalars['String']>;
    poolType_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    poolType_starts_with?: InputMaybe<Scalars['String']>;
    poolType_starts_with_nocase?: InputMaybe<Scalars['String']>;
    principalToken?: InputMaybe<Scalars['Bytes']>;
    principalToken_contains?: InputMaybe<Scalars['Bytes']>;
    principalToken_in?: InputMaybe<Array<Scalars['Bytes']>>;
    principalToken_not?: InputMaybe<Scalars['Bytes']>;
    principalToken_not_contains?: InputMaybe<Scalars['Bytes']>;
    principalToken_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
    strategyType?: InputMaybe<Scalars['Int']>;
    strategyType_gt?: InputMaybe<Scalars['Int']>;
    strategyType_gte?: InputMaybe<Scalars['Int']>;
    strategyType_in?: InputMaybe<Array<Scalars['Int']>>;
    strategyType_lt?: InputMaybe<Scalars['Int']>;
    strategyType_lte?: InputMaybe<Scalars['Int']>;
    strategyType_not?: InputMaybe<Scalars['Int']>;
    strategyType_not_in?: InputMaybe<Array<Scalars['Int']>>;
    swapEnabled?: InputMaybe<Scalars['Boolean']>;
    swapEnabled_in?: InputMaybe<Array<Scalars['Boolean']>>;
    swapEnabled_not?: InputMaybe<Scalars['Boolean']>;
    swapEnabled_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
    swapFee?: InputMaybe<Scalars['BigDecimal']>;
    swapFee_gt?: InputMaybe<Scalars['BigDecimal']>;
    swapFee_gte?: InputMaybe<Scalars['BigDecimal']>;
    swapFee_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    swapFee_lt?: InputMaybe<Scalars['BigDecimal']>;
    swapFee_lte?: InputMaybe<Scalars['BigDecimal']>;
    swapFee_not?: InputMaybe<Scalars['BigDecimal']>;
    swapFee_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    swapsCount?: InputMaybe<Scalars['BigInt']>;
    swapsCount_gt?: InputMaybe<Scalars['BigInt']>;
    swapsCount_gte?: InputMaybe<Scalars['BigInt']>;
    swapsCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
    swapsCount_lt?: InputMaybe<Scalars['BigInt']>;
    swapsCount_lte?: InputMaybe<Scalars['BigInt']>;
    swapsCount_not?: InputMaybe<Scalars['BigInt']>;
    swapsCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    symbol?: InputMaybe<Scalars['String']>;
    symbol_contains?: InputMaybe<Scalars['String']>;
    symbol_contains_nocase?: InputMaybe<Scalars['String']>;
    symbol_ends_with?: InputMaybe<Scalars['String']>;
    symbol_ends_with_nocase?: InputMaybe<Scalars['String']>;
    symbol_gt?: InputMaybe<Scalars['String']>;
    symbol_gte?: InputMaybe<Scalars['String']>;
    symbol_in?: InputMaybe<Array<Scalars['String']>>;
    symbol_lt?: InputMaybe<Scalars['String']>;
    symbol_lte?: InputMaybe<Scalars['String']>;
    symbol_not?: InputMaybe<Scalars['String']>;
    symbol_not_contains?: InputMaybe<Scalars['String']>;
    symbol_not_contains_nocase?: InputMaybe<Scalars['String']>;
    symbol_not_ends_with?: InputMaybe<Scalars['String']>;
    symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    symbol_not_in?: InputMaybe<Array<Scalars['String']>>;
    symbol_not_starts_with?: InputMaybe<Scalars['String']>;
    symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    symbol_starts_with?: InputMaybe<Scalars['String']>;
    symbol_starts_with_nocase?: InputMaybe<Scalars['String']>;
    tokensList?: InputMaybe<Array<Scalars['Bytes']>>;
    tokensList_contains?: InputMaybe<Array<Scalars['Bytes']>>;
    tokensList_contains_nocase?: InputMaybe<Array<Scalars['Bytes']>>;
    tokensList_not?: InputMaybe<Array<Scalars['Bytes']>>;
    tokensList_not_contains?: InputMaybe<Array<Scalars['Bytes']>>;
    tokensList_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']>>;
    totalLiquidity?: InputMaybe<Scalars['BigDecimal']>;
    totalLiquidity_gt?: InputMaybe<Scalars['BigDecimal']>;
    totalLiquidity_gte?: InputMaybe<Scalars['BigDecimal']>;
    totalLiquidity_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    totalLiquidity_lt?: InputMaybe<Scalars['BigDecimal']>;
    totalLiquidity_lte?: InputMaybe<Scalars['BigDecimal']>;
    totalLiquidity_not?: InputMaybe<Scalars['BigDecimal']>;
    totalLiquidity_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    totalShares?: InputMaybe<Scalars['BigDecimal']>;
    totalShares_gt?: InputMaybe<Scalars['BigDecimal']>;
    totalShares_gte?: InputMaybe<Scalars['BigDecimal']>;
    totalShares_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    totalShares_lt?: InputMaybe<Scalars['BigDecimal']>;
    totalShares_lte?: InputMaybe<Scalars['BigDecimal']>;
    totalShares_not?: InputMaybe<Scalars['BigDecimal']>;
    totalShares_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    totalSwapFee?: InputMaybe<Scalars['BigDecimal']>;
    totalSwapFee_gt?: InputMaybe<Scalars['BigDecimal']>;
    totalSwapFee_gte?: InputMaybe<Scalars['BigDecimal']>;
    totalSwapFee_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    totalSwapFee_lt?: InputMaybe<Scalars['BigDecimal']>;
    totalSwapFee_lte?: InputMaybe<Scalars['BigDecimal']>;
    totalSwapFee_not?: InputMaybe<Scalars['BigDecimal']>;
    totalSwapFee_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    totalSwapVolume?: InputMaybe<Scalars['BigDecimal']>;
    totalSwapVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
    totalSwapVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
    totalSwapVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    totalSwapVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
    totalSwapVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
    totalSwapVolume_not?: InputMaybe<Scalars['BigDecimal']>;
    totalSwapVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    totalWeight?: InputMaybe<Scalars['BigDecimal']>;
    totalWeight_gt?: InputMaybe<Scalars['BigDecimal']>;
    totalWeight_gte?: InputMaybe<Scalars['BigDecimal']>;
    totalWeight_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    totalWeight_lt?: InputMaybe<Scalars['BigDecimal']>;
    totalWeight_lte?: InputMaybe<Scalars['BigDecimal']>;
    totalWeight_not?: InputMaybe<Scalars['BigDecimal']>;
    totalWeight_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    tx?: InputMaybe<Scalars['Bytes']>;
    tx_contains?: InputMaybe<Scalars['Bytes']>;
    tx_in?: InputMaybe<Array<Scalars['Bytes']>>;
    tx_not?: InputMaybe<Scalars['Bytes']>;
    tx_not_contains?: InputMaybe<Scalars['Bytes']>;
    tx_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
    unitSeconds?: InputMaybe<Scalars['BigInt']>;
    unitSeconds_gt?: InputMaybe<Scalars['BigInt']>;
    unitSeconds_gte?: InputMaybe<Scalars['BigInt']>;
    unitSeconds_in?: InputMaybe<Array<Scalars['BigInt']>>;
    unitSeconds_lt?: InputMaybe<Scalars['BigInt']>;
    unitSeconds_lte?: InputMaybe<Scalars['BigInt']>;
    unitSeconds_not?: InputMaybe<Scalars['BigInt']>;
    unitSeconds_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    upperTarget?: InputMaybe<Scalars['BigDecimal']>;
    upperTarget_gt?: InputMaybe<Scalars['BigDecimal']>;
    upperTarget_gte?: InputMaybe<Scalars['BigDecimal']>;
    upperTarget_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    upperTarget_lt?: InputMaybe<Scalars['BigDecimal']>;
    upperTarget_lte?: InputMaybe<Scalars['BigDecimal']>;
    upperTarget_not?: InputMaybe<Scalars['BigDecimal']>;
    upperTarget_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    vaultID?: InputMaybe<Scalars['String']>;
    vaultID_contains?: InputMaybe<Scalars['String']>;
    vaultID_contains_nocase?: InputMaybe<Scalars['String']>;
    vaultID_ends_with?: InputMaybe<Scalars['String']>;
    vaultID_ends_with_nocase?: InputMaybe<Scalars['String']>;
    vaultID_gt?: InputMaybe<Scalars['String']>;
    vaultID_gte?: InputMaybe<Scalars['String']>;
    vaultID_in?: InputMaybe<Array<Scalars['String']>>;
    vaultID_lt?: InputMaybe<Scalars['String']>;
    vaultID_lte?: InputMaybe<Scalars['String']>;
    vaultID_not?: InputMaybe<Scalars['String']>;
    vaultID_not_contains?: InputMaybe<Scalars['String']>;
    vaultID_not_contains_nocase?: InputMaybe<Scalars['String']>;
    vaultID_not_ends_with?: InputMaybe<Scalars['String']>;
    vaultID_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    vaultID_not_in?: InputMaybe<Array<Scalars['String']>>;
    vaultID_not_starts_with?: InputMaybe<Scalars['String']>;
    vaultID_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    vaultID_starts_with?: InputMaybe<Scalars['String']>;
    vaultID_starts_with_nocase?: InputMaybe<Scalars['String']>;
    wrappedIndex?: InputMaybe<Scalars['Int']>;
    wrappedIndex_gt?: InputMaybe<Scalars['Int']>;
    wrappedIndex_gte?: InputMaybe<Scalars['Int']>;
    wrappedIndex_in?: InputMaybe<Array<Scalars['Int']>>;
    wrappedIndex_lt?: InputMaybe<Scalars['Int']>;
    wrappedIndex_lte?: InputMaybe<Scalars['Int']>;
    wrappedIndex_not?: InputMaybe<Scalars['Int']>;
    wrappedIndex_not_in?: InputMaybe<Array<Scalars['Int']>>;
};
declare enum Pool_OrderBy {
    Address = "address",
    Amp = "amp",
    BaseToken = "baseToken",
    CreateTime = "createTime",
    ExpiryTime = "expiryTime",
    Factory = "factory",
    HistoricalValues = "historicalValues",
    HoldersCount = "holdersCount",
    Id = "id",
    LowerTarget = "lowerTarget",
    MainIndex = "mainIndex",
    ManagementFee = "managementFee",
    Name = "name",
    Owner = "owner",
    PoolType = "poolType",
    PriceRateProviders = "priceRateProviders",
    PrincipalToken = "principalToken",
    Shares = "shares",
    StrategyType = "strategyType",
    SwapEnabled = "swapEnabled",
    SwapFee = "swapFee",
    Swaps = "swaps",
    SwapsCount = "swapsCount",
    Symbol = "symbol",
    Tokens = "tokens",
    TokensList = "tokensList",
    TotalLiquidity = "totalLiquidity",
    TotalShares = "totalShares",
    TotalSwapFee = "totalSwapFee",
    TotalSwapVolume = "totalSwapVolume",
    TotalWeight = "totalWeight",
    Tx = "tx",
    UnitSeconds = "unitSeconds",
    UpperTarget = "upperTarget",
    VaultId = "vaultID",
    WeightUpdates = "weightUpdates",
    WrappedIndex = "wrappedIndex"
}
declare type TokenPrice_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    amount?: InputMaybe<Scalars['BigDecimal']>;
    amount_gt?: InputMaybe<Scalars['BigDecimal']>;
    amount_gte?: InputMaybe<Scalars['BigDecimal']>;
    amount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    amount_lt?: InputMaybe<Scalars['BigDecimal']>;
    amount_lte?: InputMaybe<Scalars['BigDecimal']>;
    amount_not?: InputMaybe<Scalars['BigDecimal']>;
    amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    asset?: InputMaybe<Scalars['Bytes']>;
    asset_contains?: InputMaybe<Scalars['Bytes']>;
    asset_in?: InputMaybe<Array<Scalars['Bytes']>>;
    asset_not?: InputMaybe<Scalars['Bytes']>;
    asset_not_contains?: InputMaybe<Scalars['Bytes']>;
    asset_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
    block?: InputMaybe<Scalars['BigInt']>;
    block_gt?: InputMaybe<Scalars['BigInt']>;
    block_gte?: InputMaybe<Scalars['BigInt']>;
    block_in?: InputMaybe<Array<Scalars['BigInt']>>;
    block_lt?: InputMaybe<Scalars['BigInt']>;
    block_lte?: InputMaybe<Scalars['BigInt']>;
    block_not?: InputMaybe<Scalars['BigInt']>;
    block_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    id?: InputMaybe<Scalars['ID']>;
    id_gt?: InputMaybe<Scalars['ID']>;
    id_gte?: InputMaybe<Scalars['ID']>;
    id_in?: InputMaybe<Array<Scalars['ID']>>;
    id_lt?: InputMaybe<Scalars['ID']>;
    id_lte?: InputMaybe<Scalars['ID']>;
    id_not?: InputMaybe<Scalars['ID']>;
    id_not_in?: InputMaybe<Array<Scalars['ID']>>;
    poolId?: InputMaybe<Scalars['String']>;
    poolId_contains?: InputMaybe<Scalars['String']>;
    poolId_contains_nocase?: InputMaybe<Scalars['String']>;
    poolId_ends_with?: InputMaybe<Scalars['String']>;
    poolId_ends_with_nocase?: InputMaybe<Scalars['String']>;
    poolId_gt?: InputMaybe<Scalars['String']>;
    poolId_gte?: InputMaybe<Scalars['String']>;
    poolId_in?: InputMaybe<Array<Scalars['String']>>;
    poolId_lt?: InputMaybe<Scalars['String']>;
    poolId_lte?: InputMaybe<Scalars['String']>;
    poolId_not?: InputMaybe<Scalars['String']>;
    poolId_not_contains?: InputMaybe<Scalars['String']>;
    poolId_not_contains_nocase?: InputMaybe<Scalars['String']>;
    poolId_not_ends_with?: InputMaybe<Scalars['String']>;
    poolId_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    poolId_not_in?: InputMaybe<Array<Scalars['String']>>;
    poolId_not_starts_with?: InputMaybe<Scalars['String']>;
    poolId_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    poolId_starts_with?: InputMaybe<Scalars['String']>;
    poolId_starts_with_nocase?: InputMaybe<Scalars['String']>;
    price?: InputMaybe<Scalars['BigDecimal']>;
    price_gt?: InputMaybe<Scalars['BigDecimal']>;
    price_gte?: InputMaybe<Scalars['BigDecimal']>;
    price_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    price_lt?: InputMaybe<Scalars['BigDecimal']>;
    price_lte?: InputMaybe<Scalars['BigDecimal']>;
    price_not?: InputMaybe<Scalars['BigDecimal']>;
    price_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    pricingAsset?: InputMaybe<Scalars['Bytes']>;
    pricingAsset_contains?: InputMaybe<Scalars['Bytes']>;
    pricingAsset_in?: InputMaybe<Array<Scalars['Bytes']>>;
    pricingAsset_not?: InputMaybe<Scalars['Bytes']>;
    pricingAsset_not_contains?: InputMaybe<Scalars['Bytes']>;
    pricingAsset_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
    timestamp?: InputMaybe<Scalars['Int']>;
    timestamp_gt?: InputMaybe<Scalars['Int']>;
    timestamp_gte?: InputMaybe<Scalars['Int']>;
    timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
    timestamp_lt?: InputMaybe<Scalars['Int']>;
    timestamp_lte?: InputMaybe<Scalars['Int']>;
    timestamp_not?: InputMaybe<Scalars['Int']>;
    timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
};
declare enum TokenPrice_OrderBy {
    Amount = "amount",
    Asset = "asset",
    Block = "block",
    Id = "id",
    PoolId = "poolId",
    Price = "price",
    PricingAsset = "pricingAsset",
    Timestamp = "timestamp"
}
declare type User_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    id?: InputMaybe<Scalars['ID']>;
    id_gt?: InputMaybe<Scalars['ID']>;
    id_gte?: InputMaybe<Scalars['ID']>;
    id_in?: InputMaybe<Array<Scalars['ID']>>;
    id_lt?: InputMaybe<Scalars['ID']>;
    id_lte?: InputMaybe<Scalars['ID']>;
    id_not?: InputMaybe<Scalars['ID']>;
    id_not_in?: InputMaybe<Array<Scalars['ID']>>;
};
declare enum User_OrderBy {
    Id = "id",
    SharesOwned = "sharesOwned",
    Swaps = "swaps",
    UserInternalBalances = "userInternalBalances"
}
declare type PoolsQuery = {
    __typename?: 'Query';
    pools: Array<{
        __typename?: 'Pool';
        id: string;
        address: string;
        poolType?: string | null;
        symbol?: string | null;
        name?: string | null;
        swapFee: string;
        totalWeight?: string | null;
        totalSwapVolume: string;
        totalSwapFee: string;
        totalLiquidity: string;
        totalShares: string;
        swapsCount: string;
        holdersCount: string;
        tokensList: Array<string>;
        amp?: string | null;
        expiryTime?: string | null;
        unitSeconds?: string | null;
        principalToken?: string | null;
        baseToken?: string | null;
        swapEnabled: boolean;
        wrappedIndex?: number | null;
        mainIndex?: number | null;
        lowerTarget?: string | null;
        upperTarget?: string | null;
        factory?: string | null;
        tokens?: Array<{
            __typename?: 'PoolToken';
            id: string;
            symbol: string;
            name: string;
            decimals: number;
            address: string;
            balance: string;
            invested: string;
            weight?: string | null;
            priceRate: string;
        }> | null;
    }>;
};
declare type PoolQueryVariables = Exact<{
    id: Scalars['ID'];
    block?: InputMaybe<Block_Height>;
}>;
declare type PoolQuery = {
    __typename?: 'Query';
    pool?: {
        __typename?: 'Pool';
        id: string;
        address: string;
        poolType?: string | null;
        symbol?: string | null;
        name?: string | null;
        swapFee: string;
        totalWeight?: string | null;
        totalSwapVolume: string;
        totalSwapFee: string;
        totalLiquidity: string;
        totalShares: string;
        swapsCount: string;
        holdersCount: string;
        tokensList: Array<string>;
        amp?: string | null;
        expiryTime?: string | null;
        unitSeconds?: string | null;
        principalToken?: string | null;
        baseToken?: string | null;
        swapEnabled: boolean;
        wrappedIndex?: number | null;
        mainIndex?: number | null;
        lowerTarget?: string | null;
        upperTarget?: string | null;
        factory?: string | null;
        tokens?: Array<{
            __typename?: 'PoolToken';
            id: string;
            symbol: string;
            name: string;
            decimals: number;
            address: string;
            balance: string;
            invested: string;
            weight?: string | null;
            priceRate: string;
        }> | null;
    } | null;
};
declare type PoolsWithoutLinearQuery = {
    __typename?: 'Query';
    pools: Array<{
        __typename?: 'Pool';
        id: string;
        address: string;
        poolType?: string | null;
        symbol?: string | null;
        name?: string | null;
        swapFee: string;
        totalWeight?: string | null;
        totalSwapVolume: string;
        totalSwapFee: string;
        totalLiquidity: string;
        totalShares: string;
        swapsCount: string;
        holdersCount: string;
        tokensList: Array<string>;
        amp?: string | null;
        expiryTime?: string | null;
        unitSeconds?: string | null;
        principalToken?: string | null;
        baseToken?: string | null;
        swapEnabled: boolean;
        tokens?: Array<{
            __typename?: 'PoolToken';
            id: string;
            symbol: string;
            name: string;
            decimals: number;
            address: string;
            balance: string;
            invested: string;
            weight?: string | null;
            priceRate: string;
        }> | null;
    }>;
};
declare type PoolWithoutLinearQueryVariables = Exact<{
    id: Scalars['ID'];
    block?: InputMaybe<Block_Height>;
}>;
declare type PoolWithoutLinearQuery = {
    __typename?: 'Query';
    pool?: {
        __typename?: 'Pool';
        id: string;
        address: string;
        poolType?: string | null;
        symbol?: string | null;
        name?: string | null;
        swapFee: string;
        totalWeight?: string | null;
        totalSwapVolume: string;
        totalSwapFee: string;
        totalLiquidity: string;
        totalShares: string;
        swapsCount: string;
        holdersCount: string;
        tokensList: Array<string>;
        amp?: string | null;
        expiryTime?: string | null;
        unitSeconds?: string | null;
        principalToken?: string | null;
        baseToken?: string | null;
        swapEnabled: boolean;
        tokens?: Array<{
            __typename?: 'PoolToken';
            id: string;
            symbol: string;
            name: string;
            decimals: number;
            address: string;
            balance: string;
            invested: string;
            weight?: string | null;
            priceRate: string;
        }> | null;
    } | null;
};
declare type PoolHistoricalLiquiditiesQuery = {
    __typename?: 'Query';
    poolHistoricalLiquidities: Array<{
        __typename?: 'PoolHistoricalLiquidity';
        id: string;
        poolTotalShares: string;
        poolLiquidity: string;
        poolShareValue: string;
        pricingAsset: string;
        block: string;
        poolId: {
            __typename?: 'Pool';
            id: string;
        };
    }>;
};
declare type PoolSnapshotsQuery = {
    __typename?: 'Query';
    poolSnapshots: Array<{
        __typename?: 'PoolSnapshot';
        id: string;
        totalShares: string;
        swapVolume: string;
        swapFees: string;
        timestamp: number;
        pool: {
            __typename?: 'Pool';
            id: string;
        };
    }>;
};
declare type JoinExitsQuery = {
    __typename?: 'Query';
    joinExits: Array<{
        __typename?: 'JoinExit';
        amounts: Array<string>;
        id: string;
        sender: string;
        timestamp: number;
        tx: string;
        type: InvestType;
        user: {
            __typename?: 'User';
            id: string;
        };
        pool: {
            __typename?: 'Pool';
            id: string;
            tokensList: Array<string>;
        };
    }>;
};
declare type BalancersQuery = {
    __typename?: 'Query';
    balancers: Array<{
        __typename?: 'Balancer';
        id: string;
        totalLiquidity: string;
        totalSwapVolume: string;
        totalSwapFee: string;
        totalSwapCount: string;
        poolCount: number;
    }>;
};
declare type TokenPricesQuery = {
    __typename?: 'Query';
    tokenPrices: Array<{
        __typename?: 'TokenPrice';
        id: string;
        asset: string;
        amount: string;
        pricingAsset: string;
        price: string;
        block: string;
        timestamp: number;
        poolId: {
            __typename?: 'Pool';
            id: string;
        };
    }>;
};
declare type TokenLatestPricesQuery = {
    __typename?: 'Query';
    latestPrices: Array<{
        __typename?: 'LatestPrice';
        id: string;
        asset: string;
        price: string;
        pricingAsset: string;
        poolId: {
            __typename?: 'Pool';
            id: string;
        };
    }>;
};
declare type TokenLatestPriceQueryVariables = Exact<{
    id: Scalars['ID'];
}>;
declare type TokenLatestPriceQuery = {
    __typename?: 'Query';
    latestPrice?: {
        __typename?: 'LatestPrice';
        id: string;
        asset: string;
        price: string;
        pricingAsset: string;
        poolId: {
            __typename?: 'Pool';
            id: string;
        };
    } | null;
};
declare type UserQueryVariables = Exact<{
    id: Scalars['ID'];
    block?: InputMaybe<Block_Height>;
}>;
declare type UserQuery = {
    __typename?: 'Query';
    user?: {
        __typename?: 'User';
        id: string;
        sharesOwned?: Array<{
            __typename?: 'PoolShare';
            balance: string;
            poolId: {
                __typename?: 'Pool';
                id: string;
            };
        }> | null;
    } | null;
};
declare type UsersQuery = {
    __typename?: 'Query';
    users: Array<{
        __typename?: 'User';
        id: string;
        sharesOwned?: Array<{
            __typename?: 'PoolShare';
            balance: string;
            poolId: {
                __typename?: 'Pool';
                id: string;
            };
        }> | null;
    }>;
};
declare type SdkFunctionWrapper = <T>(action: (requestHeaders?: Record<string, string>) => Promise<T>, operationName: string) => Promise<T>;
declare function getSdk(client: GraphQLClient, withWrapper?: SdkFunctionWrapper): {
    Pools(variables?: Exact<{
        skip?: InputMaybe<number> | undefined;
        first?: InputMaybe<number> | undefined;
        orderBy?: InputMaybe<Pool_OrderBy> | undefined;
        orderDirection?: InputMaybe<OrderDirection> | undefined;
        where?: InputMaybe<Pool_Filter> | undefined;
        block?: InputMaybe<Block_Height> | undefined;
    }> | undefined, requestHeaders?: Dom.RequestInit["headers"]): Promise<PoolsQuery>;
    Pool(variables: PoolQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<PoolQuery>;
    PoolsWithoutLinear(variables?: Exact<{
        skip?: InputMaybe<number> | undefined;
        first?: InputMaybe<number> | undefined;
        orderBy?: InputMaybe<Pool_OrderBy> | undefined;
        orderDirection?: InputMaybe<OrderDirection> | undefined;
        where?: InputMaybe<Pool_Filter> | undefined;
        block?: InputMaybe<Block_Height> | undefined;
    }> | undefined, requestHeaders?: Dom.RequestInit["headers"]): Promise<PoolsWithoutLinearQuery>;
    PoolWithoutLinear(variables: PoolWithoutLinearQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<PoolWithoutLinearQuery>;
    PoolHistoricalLiquidities(variables?: Exact<{
        skip?: InputMaybe<number> | undefined;
        first?: InputMaybe<number> | undefined;
        orderBy?: InputMaybe<PoolHistoricalLiquidity_OrderBy> | undefined;
        orderDirection?: InputMaybe<OrderDirection> | undefined;
        where?: InputMaybe<PoolHistoricalLiquidity_Filter> | undefined;
        block?: InputMaybe<Block_Height> | undefined;
    }> | undefined, requestHeaders?: Dom.RequestInit["headers"]): Promise<PoolHistoricalLiquiditiesQuery>;
    PoolSnapshots(variables?: Exact<{
        skip?: InputMaybe<number> | undefined;
        first?: InputMaybe<number> | undefined;
        orderBy?: InputMaybe<PoolSnapshot_OrderBy> | undefined;
        orderDirection?: InputMaybe<OrderDirection> | undefined;
        where?: InputMaybe<PoolSnapshot_Filter> | undefined;
        block?: InputMaybe<Block_Height> | undefined;
    }> | undefined, requestHeaders?: Dom.RequestInit["headers"]): Promise<PoolSnapshotsQuery>;
    JoinExits(variables?: Exact<{
        skip?: InputMaybe<number> | undefined;
        first?: InputMaybe<number> | undefined;
        orderBy?: InputMaybe<JoinExit_OrderBy> | undefined;
        orderDirection?: InputMaybe<OrderDirection> | undefined;
        where?: InputMaybe<JoinExit_Filter> | undefined;
        block?: InputMaybe<Block_Height> | undefined;
    }> | undefined, requestHeaders?: Dom.RequestInit["headers"]): Promise<JoinExitsQuery>;
    Balancers(variables?: Exact<{
        skip?: InputMaybe<number> | undefined;
        first?: InputMaybe<number> | undefined;
        orderBy?: InputMaybe<Balancer_OrderBy> | undefined;
        orderDirection?: InputMaybe<OrderDirection> | undefined;
        where?: InputMaybe<Balancer_Filter> | undefined;
        block?: InputMaybe<Block_Height> | undefined;
    }> | undefined, requestHeaders?: Dom.RequestInit["headers"]): Promise<BalancersQuery>;
    TokenPrices(variables?: Exact<{
        skip?: InputMaybe<number> | undefined;
        first?: InputMaybe<number> | undefined;
        orderBy?: InputMaybe<TokenPrice_OrderBy> | undefined;
        orderDirection?: InputMaybe<OrderDirection> | undefined;
        where?: InputMaybe<TokenPrice_Filter> | undefined;
        block?: InputMaybe<Block_Height> | undefined;
    }> | undefined, requestHeaders?: Dom.RequestInit["headers"]): Promise<TokenPricesQuery>;
    TokenLatestPrices(variables?: Exact<{
        skip?: InputMaybe<number> | undefined;
        first?: InputMaybe<number> | undefined;
        orderBy?: InputMaybe<LatestPrice_OrderBy> | undefined;
        orderDirection?: InputMaybe<OrderDirection> | undefined;
        where?: InputMaybe<LatestPrice_Filter> | undefined;
        block?: InputMaybe<Block_Height> | undefined;
    }> | undefined, requestHeaders?: Dom.RequestInit["headers"]): Promise<TokenLatestPricesQuery>;
    TokenLatestPrice(variables: TokenLatestPriceQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<TokenLatestPriceQuery>;
    User(variables: UserQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UserQuery>;
    Users(variables?: Exact<{
        skip?: InputMaybe<number> | undefined;
        first?: InputMaybe<number> | undefined;
        orderBy?: InputMaybe<User_OrderBy> | undefined;
        orderDirection?: InputMaybe<OrderDirection> | undefined;
        where?: InputMaybe<User_Filter> | undefined;
        block?: InputMaybe<Block_Height> | undefined;
    }> | undefined, requestHeaders?: Dom.RequestInit["headers"]): Promise<UsersQuery>;
};
declare type Sdk = ReturnType<typeof getSdk>;

declare type SubgraphClient = Sdk;

declare class Subgraph {
    readonly url: string;
    readonly client: SubgraphClient;
    constructor(config: BalancerSdkConfig);
    private initClient;
}

declare class Sor extends SOR {
    constructor(sdkConfig: BalancerSdkConfig);
    private static getSorConfig;
    private static getSorNetworkConfig;
    private static getPoolDataService;
    private static getTokenPriceService;
}

declare class BalancerSDK {
    config: BalancerSdkConfig;
    readonly swaps: Swaps;
    readonly relayer: Relayer;
    readonly sor: Sor;
    readonly subgraph: Subgraph;
    constructor(config: BalancerSdkConfig);
    get networkConfig(): BalancerNetworkConfig;
}

export { AaveHelpers, Account, AssetHelpers, BalancerErrors, BalancerLinearPoolType, BalancerNetworkConfig, BalancerSDK, BalancerSdkConfig, BalancerSdkSorConfig, BatchRelayerJoinPool, BatchSwap, BatchSwapStep, EncodeBatchSwapInput, EncodeBooMirrorWorldEnterInput, EncodeBooMirrorWorldLeaveInput, EncodeExitPoolInput, EncodeJoinPoolInput, EncodeMasterChefDepositInput, EncodeMasterChefWithdrawInput, EncodeUnwrapAaveStaticTokenInput, EncodeUnwrapYearnVaultTokenInput, EncodeXSonarBarEnterInput, EncodeXSonarBarLeaveInput, ExitAndBatchSwapExitItemInput, ExitAndBatchSwapInput, ExitPoolData, ExitPoolRequest, ExitStablePhantomInput, FetchPoolsInput, FundManagement, JoinPoolRequest, ManagedPoolEncoder, NestedLinearPool, Network, OutputReference, PoolBalanceOp, PoolBalanceOpKind, PoolReference, PoolSpecialization, QueryWithSorInput, QueryWithSorOutput, Relayer, RelayerAction, RelayerAuthorization, SingleSwap, Sor, StablePhantomPoolJoinKind, StablePoolEncoder, StablePoolExitKind, StablePoolJoinKind, Subgraph, Swap, SwapType, Swaps, TransactionData, UserBalanceOp, UserBalanceOpKind, WeightedPoolEncoder, WeightedPoolExitKind, WeightedPoolJoinKind, accountToAddress, getLimitsForSlippage, getPoolAddress, getPoolNonce, getPoolSpecialization, isNormalizedWeights, isSameAddress, signPermit, splitPoolId, toNormalizedWeights };
