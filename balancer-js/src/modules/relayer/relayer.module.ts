import { BigNumber, BigNumberish, parseFixed } from '@ethersproject/bignumber';
import {
    AddressZero,
    MaxUint256,
    WeiPerEther,
    Zero,
} from '@ethersproject/constants';

import { Swaps } from '@/modules/swaps/swaps.module';
import {
    BatchRelayerJoinPool,
    ExitAndBatchSwapInput,
    ExitStablePhantomInput,
    NestedLinearPool,
    OutputReference,
} from './types';
import {
    BalancerLinearPoolType,
    BalancerNetworkConfig,
    ExitPoolRequest,
    TransactionData,
} from '@/types';
import {
    BatchSwapStep,
    FetchPoolsInput,
    FundManagement,
    QueryWithSorOutput,
    SwapType,
} from '../swaps/types';
import { SubgraphPoolBase } from '@balancer-labs/sor';
import { flatten, keyBy } from 'lodash';
import { WeightedPoolEncoder } from '@/pool-weighted/encoder';
import { BooMirrorWorldStakingService } from '@/modules/relayer/extensions/boo-mirror-world-staking.service';
import { FBeetsBarStakingService } from '@/modules/relayer/extensions/fbeets-bar-staking.service';
import { MasterChefStakingService } from '@/modules/relayer/extensions/masterchef-staking.service';
import { YearnWrappingService } from '@/modules/relayer/extensions/yearn-wrapping.service';
import { AaveWrappingService } from '@/modules/relayer/extensions/aave-wrapping.service';
import { VaultActionsService } from '@/modules/relayer/extensions/vault-actions.service';

export * from './types';

export class Relayer {
    static CHAINED_REFERENCE_PREFIX = 'ba10';
    private vaultActionsService: VaultActionsService;
    private aaveWrappingService: AaveWrappingService;
    private booMirrorWorldStaking: BooMirrorWorldStakingService;
    private fBeetsBarStakingService: FBeetsBarStakingService;
    private masterChefStakingService: MasterChefStakingService;
    private yearnWrappingService: YearnWrappingService;
    private batchRelayerAddress: string;

    constructor(
        private readonly swaps: Swaps,
        private readonly config: BalancerNetworkConfig
    ) {
        this.vaultActionsService = new VaultActionsService();
        this.aaveWrappingService = new AaveWrappingService();
        this.booMirrorWorldStaking = new BooMirrorWorldStakingService();
        this.fBeetsBarStakingService = new FBeetsBarStakingService();
        this.masterChefStakingService = new MasterChefStakingService();
        this.yearnWrappingService = new YearnWrappingService();
        this.batchRelayerAddress =
            this.config.addresses.contracts.batchRelayer || '';
    }

    static toChainedReference(key: BigNumberish): BigNumber {
        // The full padded prefix is 66 characters long, with 64 hex characters and the 0x prefix.
        const paddedPrefix = `0x${Relayer.CHAINED_REFERENCE_PREFIX}${'0'.repeat(
            64 - Relayer.CHAINED_REFERENCE_PREFIX.length
        )}`;
        return BigNumber.from(paddedPrefix).add(key);
    }

    /**
     * fetchPools saves updated pools data to SOR internal onChainBalanceCache.
     * @param {SubgraphPoolBase[]} [poolsData=[]] If poolsData passed uses this as pools source otherwise fetches from config.subgraphUrl.
     * @param {boolean} [isOnChain=true] If isOnChain is true will retrieve all required onChain data via multicall otherwise uses subgraph values.
     * @returns {boolean} Boolean indicating whether pools data was fetched correctly (true) or not (false).
     */
    async fetchPools(): Promise<boolean> {
        return this.swaps.fetchPools();
    }

    public getPools(): SubgraphPoolBase[] {
        return this.swaps.getPools();
    }

    private get poolMap(): { [address: string]: SubgraphPoolBase } {
        const pools = this.getPools();

        return keyBy(pools, 'address');
    }

    private get linearPoolMap(): { [address: string]: SubgraphPoolBase } {
        const pools = this.getPools();

        return keyBy(
            pools.filter((pool) => pool.poolType === 'Linear'),
            'address'
        );
    }

    private get linearPoolWrappedTokenMap(): {
        [address: string]: SubgraphPoolBase;
    } {
        const pools = this.getPools();

        return keyBy(
            pools.filter((pool) => pool.poolType === 'Linear'),
            (pool) => pool.tokensList[pool.wrappedIndex || 0]
        );
    }

    private get stablePhantomMap(): { [address: string]: SubgraphPoolBase } {
        const pools = this.getPools();

        return keyBy(
            pools.filter((pool) => pool.poolType === 'StablePhantom'),
            'address'
        );
    }

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
    async exitPoolAndBatchSwap(
        params: ExitAndBatchSwapInput
    ): Promise<TransactionData> {
        const pool = this.getRequiredPool(params.poolId);
        const isWeightedPool = pool.poolType === 'Weighted';
        const slippageAmountNegative = WeiPerEther.sub(
            BigNumber.from(params.slippage)
        );
        const exits = params.exits.map((exit) => ({
            ...exit,
            exitToken: exit.exitToken.toLowerCase(),
            batchSwapTokenOut: exit.batchSwapTokenOut?.toLowerCase(),
            // Set min amounts out of exit pool based on slippage
            exitMinAmountOut: BigNumber.from(exit.exitExpectedAmountOut)
                .mul(slippageAmountNegative)
                .div(WeiPerEther)
                .toString(),
        }));

        // Output of exit is used as input to swaps
        const outputReferences = exits.map((exit, index) => ({
            index,
            key: Relayer.toChainedReference(index),
        }));

        const exitsWithBatchSwaps = exits.filter(
            (exit) => exit.batchSwapTokenOut
        );
        const batchSwapTokensIn = exitsWithBatchSwaps.map(
            (exit) => exit.exitToken
        );
        const batchSwapTokensOut = exitsWithBatchSwaps.map(
            (exit) => exit.batchSwapTokenOut || ''
        );
        const poolContainsOnlyPhantomBpts =
            exits.length === exitsWithBatchSwaps.length;

        const exitCall = this.vaultActionsService.constructExitCall({
            assets: exits.map((exit) => exit.exitToken),
            minAmountsOut: exits.map((exit) => exit.exitMinAmountOut),
            userData: params.userData,
            toInternalBalance: poolContainsOnlyPhantomBpts, // Creates exitPool request with exit to internal balance to save gas for following swaps
            poolId: params.poolId,
            poolKind: 0, // This will always be 0 to match supported Relayer types
            sender: params.exiter,
            recipient: params.exiter,
            outputReferences,
            exitPoolRequest: {} as ExitPoolRequest,
        });

        // Use swapsService to get swap info for exitTokens>finalTokens
        // This will give batchSwap swap paths
        // Amounts out will be worst case amounts
        const queryResult = await this.swaps.queryBatchSwapWithSor({
            tokensIn: batchSwapTokensIn,
            tokensOut: batchSwapTokensOut,
            swapType: SwapType.SwapExactIn,
            amounts: exitsWithBatchSwaps.map((exit) => exit.exitMinAmountOut), // Use minAmountsOut as input to swap to account for slippage
            fetchPools: params.fetchPools,
        });

        // Update swap amounts with ref outputs from exitPool
        queryResult.swaps.forEach((swap) => {
            const token = queryResult.assets[swap.assetInIndex];
            const index = exits.findIndex((exit) => exit.exitToken === token);

            if (index !== -1) {
                swap.amount = outputReferences[index].key.toString();
            }
        });

        // const tempDeltas = ['10096980', '0', '0', '10199896999999482390', '0']; // Useful for debug

        // Replace tokenIn delta for swaps with amount + slippage.
        // This gives tolerance for limit incase amount out of exitPool is larger min,
        const slippageAmountPositive = WeiPerEther.add(params.slippage);
        exits.forEach((exit) => {
            const index = queryResult.assets
                .map((elem) => elem.toLowerCase())
                .indexOf(exit.exitToken.toLowerCase());

            if (index !== -1) {
                queryResult.deltas[index] = BigNumber.from(
                    exit.exitExpectedAmountOut
                )
                    .mul(slippageAmountPositive)
                    .div(WeiPerEther)
                    .toString();
            }
        });

        // Creates limit array.
        // Slippage set to 0. Already accounted for as swap used amounts out of pool with worst case slippage.
        const limits = Swaps.getLimitsForSlippage(
            batchSwapTokensIn, // tokensIn
            batchSwapTokensOut, // tokensOut
            SwapType.SwapExactIn,
            queryResult.deltas, // tempDeltas // Useful for debug
            queryResult.assets,
            '0'
        );

        // Creates fund management using internal balance as source of tokens
        const funds: FundManagement = {
            sender: params.exiter,
            recipient: params.swapRecipient,
            fromInternalBalance: poolContainsOnlyPhantomBpts,
            toInternalBalance: false,
        };

        let additionalCalls: string[] = [];
        let unwrapOutputReferences: OutputReference[] = [];

        if (params.unwrap) {
            //find any wrapped tokens in the query result assets
            const wrappedTokens = Object.keys(
                this.linearPoolWrappedTokenMap
            ).filter((wrappedToken) =>
                queryResult.assets.includes(wrappedToken)
            );

            const { unwrapCalls, outputReferences } = this.encodeUnwrapCalls(
                wrappedTokens,
                queryResult.assets,
                funds
            );

            additionalCalls = unwrapCalls;
            unwrapOutputReferences = outputReferences;

            //update the return amounts to represent the unwrappedAmount
            queryResult.returnAmounts = queryResult.returnAmounts.map(
                (returnAmount, i) => {
                    const asset = batchSwapTokensOut[i].toLowerCase();

                    if (this.linearPoolWrappedTokenMap[asset]) {
                        const linearPool =
                            this.linearPoolWrappedTokenMap[asset];
                        const wrappedToken =
                            linearPool.tokens[linearPool.wrappedIndex || 0];
                        const wrappedDecimals = wrappedToken.decimals;
                        const priceRate = parseFixed(
                            wrappedToken.priceRate,
                            wrappedDecimals
                        );

                        return BigNumber.from(returnAmount)
                            .mul(priceRate)
                            .div(BigNumber.from(10).pow(wrappedDecimals))
                            .toString();
                    }

                    return returnAmount;
                }
            );
        }

        const encodedBatchSwap = this.vaultActionsService.encodeBatchSwap({
            swapType: SwapType.SwapExactIn,
            swaps: queryResult.swaps,
            assets: queryResult.assets,
            funds: funds,
            limits: limits.map((l) => l.toString()),
            deadline: MaxUint256,
            value: '0',
            outputReferences: unwrapOutputReferences,
        });

        // Return amounts from swap
        const calls = [exitCall, encodedBatchSwap, ...additionalCalls];
        return {
            function: 'multicall',
            params: calls,
            outputs: {
                amountsOut: exits.map((exit) => {
                    //this exit does not have a batch swap, return the expected amount out
                    if (!exit.batchSwapTokenOut) {
                        return exit.exitExpectedAmountOut;
                    }

                    const index = exitsWithBatchSwaps.findIndex(
                        (exitWithBatchSwap) =>
                            exitWithBatchSwap.exitToken === exit.exitToken
                    );

                    //Add the slippage back to the amountsOut so that it reflects the expected amount
                    //rather than worst case
                    return BigNumber.from(queryResult.returnAmounts[index])
                        .mul(slippageAmountPositive)
                        .div(WeiPerEther)
                        .toString();
                }),
            },
        };
    }

    public async joinPool({
        poolId,
        tokens,
        bptOut,
        fetchPools,
        slippage,
        funds,
        farmId,
        mintFBeets,
    }: BatchRelayerJoinPool): Promise<TransactionData> {
        const stakeBptInFarm = typeof farmId === 'number';
        const wrappedNativeAsset =
            this.config.addresses.tokens.wrappedNativeAsset.toLowerCase();
        const pool = this.getRequiredPool(poolId);
        const nestedLinearPools = this.getNestedLinearPools(pool);
        const isWeightedPool = pool.poolType === 'Weighted';
        const hasNestedLinearPools = nestedLinearPools.length > 0;
        const calls: string[] = [];
        let queryResult: null | QueryWithSorOutput = null;
        const nativeToken = tokens.find(
            (token) => token.address === AddressZero
        );
        const nativeAssetValue = nativeToken
            ? parseFixed(nativeToken.amount, 18).toString()
            : '0';

        //TODO: if there are no nested pools, we don't need to use the batch relayer
        if (hasNestedLinearPools) {
            //if there are nested linear pools, the first step is to swap mainTokens for linear or phantom stable BPT
            const tokensIn = nestedLinearPools.map((item) =>
                nativeToken && item.mainToken === wrappedNativeAsset
                    ? AddressZero
                    : item.mainToken
            );

            const tokensOut = nestedLinearPools.map(
                (item) => item.poolTokenAddress
            );
            const amounts = tokensIn.map((tokenAddress) => {
                if (tokenAddress === AddressZero) {
                    return nativeAssetValue;
                }

                const token = tokens.find(
                    (token) =>
                        token.address.toLowerCase() ===
                        tokenAddress.toLowerCase()
                );

                return this.getTokenAmountScaled(
                    tokenAddress,
                    token?.amount || '0'
                );
            });

            queryResult = await this.swaps.queryBatchSwapWithSor({
                tokensIn,
                tokensOut,
                swapType: SwapType.SwapExactIn,
                amounts,
                fetchPools,
            });

            const limits = Swaps.getLimitsForSlippage(
                tokensIn,
                tokensOut,
                SwapType.SwapExactIn,
                queryResult.deltas,
                queryResult.assets,
                slippage
            );

            const encodedBatchSwap = this.vaultActionsService.encodeBatchSwap({
                swapType: SwapType.SwapExactIn,
                swaps: queryResult.swaps,
                assets: queryResult.assets,
                funds: {
                    ...funds,
                    /*toInternalBalance:
                        stakeBptInFarm || isWeightedPool
                            ? true
                            : funds.toInternalBalance,*/
                    toInternalBalance: isWeightedPool
                        ? true
                        : funds.toInternalBalance,
                },
                limits: limits.map((l) => l.toString()),
                deadline: MaxUint256,
                value: nativeAssetValue,
                outputReferences: queryResult.assets.map((asset, index) => ({
                    index,
                    key: Relayer.toChainedReference(index),
                })),
            });

            calls.push(encodedBatchSwap);
        }

        //if this is a weighted pool, we need to also join the pool
        if (isWeightedPool) {
            const joinHasNativeAsset =
                pool.tokensList.find((token) => token === wrappedNativeAsset) &&
                nativeAssetValue !== '0';

            const amountsIn = pool.tokensList.map((tokenAddress) => {
                const token = tokens.find((token) => {
                    if (
                        token.address === AddressZero &&
                        tokenAddress.toLowerCase() === wrappedNativeAsset
                    ) {
                        return true;
                    }

                    return (
                        token.address.toLowerCase() ===
                        tokenAddress.toLowerCase()
                    );
                });

                if (token) {
                    return this.getTokenAmountScaled(
                        tokenAddress,
                        token?.amount || '0'
                    );
                }

                //This token is a nested BPT, not a mainToken
                //Replace the amount with the chained reference value
                const index =
                    queryResult?.assets.findIndex(
                        (asset) =>
                            asset.toLowerCase() === tokenAddress.toLowerCase()
                    ) || -1;

                //if the return amount is 0, we dont pass on the chained reference
                if (index === -1 || queryResult?.deltas[index] === '0') {
                    return '0';
                }

                return Relayer.toChainedReference(index || 0);
            });

            const encodedJoinPool = this.vaultActionsService.encodeJoinPool({
                poolId: pool.id,
                poolKind: 0,
                sender: funds.sender,
                recipient:
                    stakeBptInFarm || mintFBeets
                        ? this.batchRelayerAddress
                        : funds.recipient,
                joinPoolRequest: {
                    assets: joinHasNativeAsset
                        ? pool.tokensList.map((token) =>
                              token === wrappedNativeAsset ? AddressZero : token
                          )
                        : pool.tokensList,
                    maxAmountsIn: amountsIn,
                    userData: WeightedPoolEncoder.joinExactTokensInForBPTOut(
                        amountsIn,
                        bptOut
                    ),
                    fromInternalBalance: hasNestedLinearPools
                        ? true
                        : funds.fromInternalBalance,
                },
                value: joinHasNativeAsset ? nativeAssetValue : Zero,
                outputReference: stakeBptInFarm
                    ? Relayer.toChainedReference(0)
                    : Zero,
            });

            calls.push(encodedJoinPool);
        }

        if (mintFBeets) {
            calls.push(
                this.fBeetsBarStakingService.encodeEnter({
                    sender: this.batchRelayerAddress,
                    recipient: stakeBptInFarm
                        ? this.batchRelayerAddress
                        : funds.recipient,
                    amount: Relayer.toChainedReference(0),
                    outputReference: Relayer.toChainedReference(0),
                })
            );
        }

        if (stakeBptInFarm) {
            calls.push(
                this.masterChefStakingService.encodeDeposit({
                    sender: this.batchRelayerAddress,
                    recipient: funds.recipient,
                    token:
                        mintFBeets && this.config.fBeets
                            ? this.config.fBeets.address
                            : pool.address,
                    pid:
                        mintFBeets && this.config.fBeets
                            ? this.config.fBeets.farmId
                            : farmId,
                    amount: Relayer.toChainedReference(0),
                    outputReference: Zero,
                })
            );
        }

        return {
            function: 'multicall',
            params: calls,
            outputs: {},
        };
    }

    private getNestedLinearPools(pool: SubgraphPoolBase): NestedLinearPool[] {
        const linearPools: NestedLinearPool[] = [];

        for (const token of pool.tokensList) {
            if (this.linearPoolMap[token]) {
                const linearPool = this.linearPoolMap[token];
                const mainIdx = linearPool.mainIndex || 0;

                linearPools.push({
                    pool: linearPool,
                    mainToken: linearPool.tokensList[mainIdx],
                    wrappedToken:
                        linearPool.tokensList[linearPool.wrappedIndex || 0],
                    poolTokenAddress: linearPool.address,
                });
            } else if (this.stablePhantomMap[token]) {
                for (const stablePhantomToken of this.stablePhantomMap[token]
                    .tokensList) {
                    if (this.linearPoolMap[stablePhantomToken]) {
                        const linearPool =
                            this.linearPoolMap[stablePhantomToken];
                        const mainIdx = linearPool.mainIndex || 0;

                        linearPools.push({
                            pool: linearPool,
                            mainToken: linearPool.tokensList[mainIdx],
                            wrappedToken:
                                linearPool.tokensList[
                                    linearPool.wrappedIndex || 0
                                ],
                            poolTokenAddress:
                                this.stablePhantomMap[token].address,
                        });
                    }
                }
            }
        }

        return linearPools;
    }

    private getRequiredPool(poolId: string): SubgraphPoolBase {
        const pools = this.getPools();
        const pool = pools.find((pool) => pool.id === poolId);

        if (!pool) {
            throw new Error('No pool found with id: ' + poolId);
        }

        return pool;
    }

    private getRequiredLinearPoolForWrappedToken(
        wrappedToken: string
    ): SubgraphPoolBase {
        const pools = this.getPools();
        const pool = pools.find(
            (pool) =>
                typeof pool.wrappedIndex === 'number' &&
                pool.tokensList[pool.wrappedIndex] ===
                    wrappedToken.toLowerCase()
        );

        if (!pool) {
            throw new Error(
                'No linear pool found for wrapped token: ' + wrappedToken
            );
        }

        return pool;
    }

    private getTokenAmountScaled(tokenAddress: string, amount: string): string {
        const pools = this.getPools();
        const tokens = flatten(pools.map((pool) => pool.tokens));
        const token = tokens.find(
            (token) =>
                token.address?.toLowerCase() === tokenAddress.toLowerCase()
        );

        if (!token) {
            throw new Error('No token found with address: ' + tokenAddress);
        }

        return parseFixed(amount, token.decimals).toString();
    }

    private getLinearPoolType(pool: SubgraphPoolBase): BalancerLinearPoolType {
        const linearFactories = this.config.addresses.linearFactories;

        if (linearFactories && pool.factory && linearFactories[pool.factory]) {
            return linearFactories[pool.factory];
        }

        return 'aave';
    }

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
    async swapUnwrapExactIn(
        tokensIn: string[],
        wrappedTokens: string[],
        amountsIn: string[],
        rates: string[],
        funds: FundManagement,
        slippage: string,
        fetchPools: FetchPoolsInput = {
            fetchPools: true,
            fetchOnChain: false,
        }
    ): Promise<TransactionData> {
        // Use swapsService to get swap info for tokensIn>wrappedTokens
        const queryResult = await this.swaps.queryBatchSwapWithSor({
            tokensIn,
            tokensOut: wrappedTokens,
            swapType: SwapType.SwapExactIn,
            amounts: amountsIn,
            fetchPools,
        });

        // Gets limits array for tokensIn>wrappedTokens based on input slippage
        const limits = Swaps.getLimitsForSlippage(
            tokensIn, // tokensIn
            wrappedTokens, // tokensOut
            SwapType.SwapExactIn,
            queryResult.deltas,
            queryResult.assets,
            slippage
        );

        const calls = this.encodeSwapUnwrap(
            wrappedTokens,
            SwapType.SwapExactIn,
            queryResult.swaps,
            queryResult.assets,
            funds,
            limits
        );

        const amountsUnwrapped = queryResult.returnAmounts.map(
            (amountWrapped, i) =>
                BigNumber.from(amountWrapped)
                    .abs()
                    .mul(rates[i])
                    .div(WeiPerEther)
                    .toString()
        );

        return {
            function: 'multicall',
            params: calls,
            outputs: {
                amountsOut: amountsUnwrapped,
            },
        };
    }

    async swapAndUnwrapStablePhantomPool({
        poolId,
        slippage,
        exits,
        account,
    }: ExitStablePhantomInput): Promise<TransactionData> {
        const pool = this.getRequiredPool(poolId);
        const linearPools = this.getNestedLinearPools(pool);
        const tokensIn = exits.map(() => pool.address.toLowerCase());
        const batchSwapTokensOut = exits.map((exit) => {
            if (!exit.unwrap) {
                return exit.tokenOut;
            }

            const linearPool = linearPools.find(
                (linearPool) =>
                    linearPool.mainToken.toLowerCase() ===
                    exit.tokenOut.toLowerCase()
            );

            return linearPool?.wrappedToken ?? exit.tokenOut;
        });

        // Use swapsService to get swap info for tokensIn>wrappedTokens
        const queryResult = await this.swaps.queryBatchSwapWithSor({
            tokensIn,
            tokensOut: batchSwapTokensOut,
            amounts: exits.map((exit) => exit.bptAmountIn),
            swapType: SwapType.SwapExactIn,
            fetchPools: {
                fetchPools: true,
                fetchOnChain: true,
            },
        });

        // Gets limits array for tokensIn>wrappedTokens based on input slippage
        const limits = Swaps.getLimitsForSlippage(
            tokensIn, // tokensIn
            batchSwapTokensOut, // tokensOut
            SwapType.SwapExactIn,
            queryResult.deltas,
            queryResult.assets,
            slippage
        );

        const wrappedTokens = batchSwapTokensOut.filter((batchSwapTokenOut) => {
            const linearPool = linearPools.find(
                (linearPool) =>
                    linearPool.wrappedToken.toLowerCase() === batchSwapTokenOut
            );

            return !!linearPool;
        });

        const funds = {
            sender: account,
            //if all tokens are wrapped, send the output to the batch relayer
            recipient:
                wrappedTokens.length === batchSwapTokensOut.length
                    ? this.batchRelayerAddress
                    : account,
            fromInternalBalance: false,
            toInternalBalance: false,
        };

        const { unwrapCalls, outputReferences } = this.encodeUnwrapCalls(
            wrappedTokens,
            queryResult.assets,
            funds
        );

        const encodedBatchSwap = this.vaultActionsService.encodeBatchSwap({
            swapType: SwapType.SwapExactIn,
            swaps: queryResult.swaps,
            assets: queryResult.assets,
            funds,
            limits: limits.map((l) => l.toString()),
            deadline: MaxUint256,
            value: '0',
            outputReferences: outputReferences,
        });

        const calls = [encodedBatchSwap, ...unwrapCalls];

        return {
            function: 'multicall',
            params: calls,
            outputs: {
                amountsOut: queryResult.returnAmounts.map((amount, index) => {
                    const asset = batchSwapTokensOut[index];
                    const linearPool = linearPools.find(
                        (linearPool) =>
                            linearPool.wrappedToken.toLowerCase() ===
                            asset.toLowerCase()
                    );

                    if (linearPool) {
                        const wrappedRate =
                            linearPool.pool.tokens[
                                linearPool.pool.wrappedIndex || 0
                            ].priceRate;
                        const wrappedRateScaled = parseFixed(wrappedRate, 18);

                        return BigNumber.from(amount)
                            .mul(wrappedRateScaled)
                            .div(WeiPerEther)
                            .toString();
                    }

                    return amount.toString();
                }),
            },
        };
    }

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
    async swapUnwrapExactOut(
        tokensIn: string[],
        wrappedTokens: string[],
        amountsUnwrapped: string[],
        rates: string[],
        funds: FundManagement,
        slippage: string,
        fetchPools: FetchPoolsInput = {
            fetchPools: true,
            fetchOnChain: false,
        }
    ): Promise<TransactionData> {
        const amountsWrapped = amountsUnwrapped.map((amountInwrapped, i) =>
            BigNumber.from(amountInwrapped)
                .mul(WeiPerEther)
                .div(rates[i])
                .toString()
        );

        // Use swapsService to get swap info for tokensIn>wrappedTokens
        const queryResult = await this.swaps.queryBatchSwapWithSor({
            tokensIn,
            tokensOut: wrappedTokens,
            swapType: SwapType.SwapExactOut,
            amounts: amountsWrapped,
            fetchPools,
        });

        // Gets limits array for tokensIn>wrappedTokens based on input slippage
        const limits = Swaps.getLimitsForSlippage(
            tokensIn, // tokensIn
            wrappedTokens, // tokensOut
            SwapType.SwapExactOut,
            queryResult.deltas,
            queryResult.assets,
            slippage
        );

        const calls = this.encodeSwapUnwrap(
            wrappedTokens,
            SwapType.SwapExactOut,
            queryResult.swaps,
            queryResult.assets,
            funds,
            limits
        );

        return {
            function: 'multicall',
            params: calls,
            outputs: {
                amountsIn: queryResult.returnAmounts.map((amount) =>
                    amount.toString()
                ),
            },
        };
    }

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
    encodeSwapUnwrap(
        wrappedTokens: string[],
        swapType: SwapType,
        swaps: BatchSwapStep[],
        assets: string[],
        funds: FundManagement,
        limits: BigNumberish[]
    ): string[] {
        // Output of swaps (wrappedTokens) is used as input to unwrap
        // Need indices of output tokens and outputReferences need to be made with those as key
        const { unwrapCalls, outputReferences } = this.encodeUnwrapCalls(
            wrappedTokens,
            assets,
            funds
        );

        const encodedBatchSwap = this.vaultActionsService.encodeBatchSwap({
            swapType: swapType,
            swaps: swaps,
            assets: assets,
            funds: funds, // Note - this should have Relayer as recipient
            limits: limits.map((l) => l.toString()),
            deadline: MaxUint256,
            value: '0',
            outputReferences: outputReferences,
        });

        return [encodedBatchSwap, ...unwrapCalls];
    }

    encodeUnwrapCalls(
        wrappedTokens: string[],
        assets: string[],
        funds: FundManagement
    ) {
        const outputReferences: OutputReference[] = [];
        const unwrapCalls: string[] = [];

        wrappedTokens.forEach((wrappedToken, i) => {
            const linearPool =
                this.getRequiredLinearPoolForWrappedToken(wrappedToken);
            const linearPoolType = this.getLinearPoolType(linearPool);

            // Find index of wrappedToken in asset array. This is used as ref in Relayer.
            const index = assets.findIndex(
                (token) => token.toLowerCase() === wrappedToken.toLowerCase()
            );
            // There may be cases where swap isn't possible for wrappedToken
            if (index === -1) return;

            const key = Relayer.toChainedReference(i);

            outputReferences.push({
                index: index,
                key: key,
            });

            // console.log(`Unwrapping ${wrappedToken} with amt: ${key.toHexString()}`);

            switch (linearPoolType) {
                case 'aave':
                    unwrapCalls.push(
                        this.aaveWrappingService.encodeUnwrap({
                            staticToken: wrappedToken,
                            sender: funds.recipient, // This should be relayer
                            recipient: funds.sender, // This will be caller
                            amount: key, // Use output of swap as input for unwrap
                            toUnderlying: true,
                            outputReferences: 0,
                        })
                    );
                    break;
                case 'yearn':
                    unwrapCalls.push(
                        this.yearnWrappingService.encodeUnwrap({
                            vaultToken: wrappedToken,
                            sender: funds.recipient, // This should be relayer
                            recipient: funds.sender, // This will be caller
                            amount: key, // Use output of swap as input for unwrap
                            outputReference: 0,
                        })
                    );
                    break;
                case 'boo':
                    unwrapCalls.push(
                        this.booMirrorWorldStaking.encodeLeave({
                            sender: funds.recipient, // This should be relayer
                            recipient: funds.sender, // This will be caller
                            amount: key, // Use output of swap as input for unwrap
                            outputReference: 0,
                        })
                    );
                    break;
            }
        });

        return { unwrapCalls, outputReferences };
    }
}
