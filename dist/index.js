'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var abi = require('@ethersproject/abi');
var constants = require('@ethersproject/constants');
var bignumber = require('@ethersproject/bignumber');
var address = require('@ethersproject/address');
var bytes = require('@ethersproject/bytes');
var abstractSigner = require('@ethersproject/abstract-signer');
var contracts = require('@ethersproject/contracts');
var sor = require('@balancer-labs/sor');
var providers = require('@ethersproject/providers');
var graphqlRequest = require('graphql-request');
var graphql = require('graphql');
var lodash = require('lodash');
var axios = require('axios');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);

exports.StablePoolJoinKind = void 0;
(function (StablePoolJoinKind) {
    StablePoolJoinKind[StablePoolJoinKind["INIT"] = 0] = "INIT";
    StablePoolJoinKind[StablePoolJoinKind["EXACT_TOKENS_IN_FOR_BPT_OUT"] = 1] = "EXACT_TOKENS_IN_FOR_BPT_OUT";
    StablePoolJoinKind[StablePoolJoinKind["TOKEN_IN_FOR_EXACT_BPT_OUT"] = 2] = "TOKEN_IN_FOR_EXACT_BPT_OUT";
})(exports.StablePoolJoinKind || (exports.StablePoolJoinKind = {}));
exports.StablePhantomPoolJoinKind = void 0;
(function (StablePhantomPoolJoinKind) {
    StablePhantomPoolJoinKind[StablePhantomPoolJoinKind["INIT"] = 0] = "INIT";
    StablePhantomPoolJoinKind[StablePhantomPoolJoinKind["COLLECT_PROTOCOL_FEES"] = 1] = "COLLECT_PROTOCOL_FEES";
})(exports.StablePhantomPoolJoinKind || (exports.StablePhantomPoolJoinKind = {}));
exports.StablePoolExitKind = void 0;
(function (StablePoolExitKind) {
    StablePoolExitKind[StablePoolExitKind["EXACT_BPT_IN_FOR_ONE_TOKEN_OUT"] = 0] = "EXACT_BPT_IN_FOR_ONE_TOKEN_OUT";
    StablePoolExitKind[StablePoolExitKind["EXACT_BPT_IN_FOR_TOKENS_OUT"] = 1] = "EXACT_BPT_IN_FOR_TOKENS_OUT";
    StablePoolExitKind[StablePoolExitKind["BPT_IN_FOR_EXACT_TOKENS_OUT"] = 2] = "BPT_IN_FOR_EXACT_TOKENS_OUT";
})(exports.StablePoolExitKind || (exports.StablePoolExitKind = {}));
class StablePoolEncoder {
    /**
     * Cannot be constructed.
     */
    constructor() {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
    }
}
/**
 * Encodes the userData parameter for providing the initial liquidity to a StablePool
 * @param initialBalances - the amounts of tokens to send to the pool to form the initial balances
 */
StablePoolEncoder.joinInit = (amountsIn) => abi.defaultAbiCoder.encode(['uint256', 'uint256[]'], [exports.StablePoolJoinKind.INIT, amountsIn]);
/**
 * Encodes the userData parameter for collecting protocol fees for StablePhantomPool
 */
StablePoolEncoder.joinCollectProtocolFees = () => abi.defaultAbiCoder.encode(['uint256'], [exports.StablePhantomPoolJoinKind.COLLECT_PROTOCOL_FEES]);
/**
 * Encodes the userData parameter for joining a StablePool with exact token inputs
 * @param amountsIn - the amounts each of token to deposit in the pool as liquidity
 * @param minimumBPT - the minimum acceptable BPT to receive in return for deposited tokens
 */
StablePoolEncoder.joinExactTokensInForBPTOut = (amountsIn, minimumBPT) => abi.defaultAbiCoder.encode(['uint256', 'uint256[]', 'uint256'], [
    exports.StablePoolJoinKind.EXACT_TOKENS_IN_FOR_BPT_OUT,
    amountsIn,
    minimumBPT,
]);
/**
 * Encodes the userData parameter for joining a StablePool with to receive an exact amount of BPT
 * @param bptAmountOut - the amount of BPT to be minted
 * @param enterTokenIndex - the index of the token to be provided as liquidity
 */
StablePoolEncoder.joinTokenInForExactBPTOut = (bptAmountOut, enterTokenIndex) => abi.defaultAbiCoder.encode(['uint256', 'uint256', 'uint256'], [
    exports.StablePoolJoinKind.TOKEN_IN_FOR_EXACT_BPT_OUT,
    bptAmountOut,
    enterTokenIndex,
]);
/**
 * Encodes the userData parameter for exiting a StablePool by removing a single token in return for an exact amount of BPT
 * @param bptAmountIn - the amount of BPT to be burned
 * @param enterTokenIndex - the index of the token to removed from the pool
 */
StablePoolEncoder.exitExactBPTInForOneTokenOut = (bptAmountIn, exitTokenIndex) => abi.defaultAbiCoder.encode(['uint256', 'uint256', 'uint256'], [
    exports.StablePoolExitKind.EXACT_BPT_IN_FOR_ONE_TOKEN_OUT,
    bptAmountIn,
    exitTokenIndex,
]);
/**
 * Encodes the userData parameter for exiting a StablePool by removing tokens in return for an exact amount of BPT
 * @param bptAmountIn - the amount of BPT to be burned
 */
StablePoolEncoder.exitExactBPTInForTokensOut = (bptAmountIn) => abi.defaultAbiCoder.encode(['uint256', 'uint256'], [exports.StablePoolExitKind.EXACT_BPT_IN_FOR_TOKENS_OUT, bptAmountIn]);
/**
 * Encodes the userData parameter for exiting a StablePool by removing exact amounts of tokens
 * @param amountsOut - the amounts of each token to be withdrawn from the pool
 * @param maxBPTAmountIn - the minimum acceptable BPT to burn in return for withdrawn tokens
 */
StablePoolEncoder.exitBPTInForExactTokensOut = (amountsOut, maxBPTAmountIn) => abi.defaultAbiCoder.encode(['uint256', 'uint256[]', 'uint256'], [
    exports.StablePoolExitKind.BPT_IN_FOR_EXACT_TOKENS_OUT,
    amountsOut,
    maxBPTAmountIn,
]);

exports.WeightedPoolJoinKind = void 0;
(function (WeightedPoolJoinKind) {
    WeightedPoolJoinKind[WeightedPoolJoinKind["INIT"] = 0] = "INIT";
    WeightedPoolJoinKind[WeightedPoolJoinKind["EXACT_TOKENS_IN_FOR_BPT_OUT"] = 1] = "EXACT_TOKENS_IN_FOR_BPT_OUT";
    WeightedPoolJoinKind[WeightedPoolJoinKind["TOKEN_IN_FOR_EXACT_BPT_OUT"] = 2] = "TOKEN_IN_FOR_EXACT_BPT_OUT";
    WeightedPoolJoinKind[WeightedPoolJoinKind["ALL_TOKENS_IN_FOR_EXACT_BPT_OUT"] = 3] = "ALL_TOKENS_IN_FOR_EXACT_BPT_OUT";
})(exports.WeightedPoolJoinKind || (exports.WeightedPoolJoinKind = {}));
exports.WeightedPoolExitKind = void 0;
(function (WeightedPoolExitKind) {
    WeightedPoolExitKind[WeightedPoolExitKind["EXACT_BPT_IN_FOR_ONE_TOKEN_OUT"] = 0] = "EXACT_BPT_IN_FOR_ONE_TOKEN_OUT";
    WeightedPoolExitKind[WeightedPoolExitKind["EXACT_BPT_IN_FOR_TOKENS_OUT"] = 1] = "EXACT_BPT_IN_FOR_TOKENS_OUT";
    WeightedPoolExitKind[WeightedPoolExitKind["BPT_IN_FOR_EXACT_TOKENS_OUT"] = 2] = "BPT_IN_FOR_EXACT_TOKENS_OUT";
    WeightedPoolExitKind[WeightedPoolExitKind["MANAGEMENT_FEE_TOKENS_OUT"] = 3] = "MANAGEMENT_FEE_TOKENS_OUT";
})(exports.WeightedPoolExitKind || (exports.WeightedPoolExitKind = {}));
class WeightedPoolEncoder {
    /**
     * Cannot be constructed.
     */
    constructor() {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
    }
}
/**
 * Encodes the userData parameter for providing the initial liquidity to a WeightedPool
 * @param initialBalances - the amounts of tokens to send to the pool to form the initial balances
 */
WeightedPoolEncoder.joinInit = (amountsIn) => abi.defaultAbiCoder.encode(['uint256', 'uint256[]'], [exports.WeightedPoolJoinKind.INIT, amountsIn]);
/**
 * Encodes the userData parameter for joining a WeightedPool with exact token inputs
 * @param amountsIn - the amounts each of token to deposit in the pool as liquidity
 * @param minimumBPT - the minimum acceptable BPT to receive in return for deposited tokens
 */
WeightedPoolEncoder.joinExactTokensInForBPTOut = (amountsIn, minimumBPT) => abi.defaultAbiCoder.encode(['uint256', 'uint256[]', 'uint256'], [
    exports.WeightedPoolJoinKind.EXACT_TOKENS_IN_FOR_BPT_OUT,
    amountsIn,
    minimumBPT,
]);
/**
 * Encodes the userData parameter for joining a WeightedPool with a single token to receive an exact amount of BPT
 * @param bptAmountOut - the amount of BPT to be minted
 * @param enterTokenIndex - the index of the token to be provided as liquidity
 */
WeightedPoolEncoder.joinTokenInForExactBPTOut = (bptAmountOut, enterTokenIndex) => abi.defaultAbiCoder.encode(['uint256', 'uint256', 'uint256'], [
    exports.WeightedPoolJoinKind.TOKEN_IN_FOR_EXACT_BPT_OUT,
    bptAmountOut,
    enterTokenIndex,
]);
/**
 * Encodes the userData parameter for joining a WeightedPool proportionally to receive an exact amount of BPT
 * @param bptAmountOut - the amount of BPT to be minted
 */
WeightedPoolEncoder.joinAllTokensInForExactBPTOut = (bptAmountOut) => abi.defaultAbiCoder.encode(['uint256', 'uint256'], [exports.WeightedPoolJoinKind.ALL_TOKENS_IN_FOR_EXACT_BPT_OUT, bptAmountOut]);
/**
 * Encodes the userData parameter for exiting a WeightedPool by removing a single token in return for an exact amount of BPT
 * @param bptAmountIn - the amount of BPT to be burned
 * @param enterTokenIndex - the index of the token to removed from the pool
 */
WeightedPoolEncoder.exitExactBPTInForOneTokenOut = (bptAmountIn, exitTokenIndex) => abi.defaultAbiCoder.encode(['uint256', 'uint256', 'uint256'], [
    exports.WeightedPoolExitKind.EXACT_BPT_IN_FOR_ONE_TOKEN_OUT,
    bptAmountIn,
    exitTokenIndex,
]);
/**
 * Encodes the userData parameter for exiting a WeightedPool by removing tokens in return for an exact amount of BPT
 * @param bptAmountIn - the amount of BPT to be burned
 */
WeightedPoolEncoder.exitExactBPTInForTokensOut = (bptAmountIn) => abi.defaultAbiCoder.encode(['uint256', 'uint256'], [exports.WeightedPoolExitKind.EXACT_BPT_IN_FOR_TOKENS_OUT, bptAmountIn]);
/**
 * Encodes the userData parameter for exiting a WeightedPool by removing exact amounts of tokens
 * @param amountsOut - the amounts of each token to be withdrawn from the pool
 * @param maxBPTAmountIn - the minimum acceptable BPT to burn in return for withdrawn tokens
 */
WeightedPoolEncoder.exitBPTInForExactTokensOut = (amountsOut, maxBPTAmountIn) => abi.defaultAbiCoder.encode(['uint256', 'uint256[]', 'uint256'], [
    exports.WeightedPoolExitKind.BPT_IN_FOR_EXACT_TOKENS_OUT,
    amountsOut,
    maxBPTAmountIn,
]);
class ManagedPoolEncoder {
    /**
     * Cannot be constructed.
     */
    constructor() {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
    }
}
/**
 * Encodes the userData parameter for exiting a ManagedPool for withdrawing management fees.
 * This can only be done by the pool owner.
 */
ManagedPoolEncoder.exitForManagementFees = () => abi.defaultAbiCoder.encode(['uint256'], [exports.WeightedPoolExitKind.MANAGEMENT_FEE_TOKENS_OUT]);

// Should match MAX_WEIGHTED_TOKENS from v2-helpers/constants
// Including would introduce a dependency
const MaxWeightedTokens = 100;
/**
 * Normalize an array of token weights to ensure they sum to `1e18`
 * @param weights - an array of token weights to be normalized
 * @returns an equivalent set of normalized weights
 */
function toNormalizedWeights(weights) {
    // When the number is exactly equal to the max, normalizing with common inputs
    // leads to a value < 0.01, which reverts. In this case fill in the weights exactly.
    if (weights.length == MaxWeightedTokens) {
        return Array(MaxWeightedTokens).fill(constants.WeiPerEther.div(MaxWeightedTokens));
    }
    const sum = weights.reduce((total, weight) => total.add(weight), constants.Zero);
    if (sum.eq(constants.WeiPerEther))
        return weights;
    const normalizedWeights = [];
    let normalizedSum = constants.Zero;
    for (let index = 0; index < weights.length; index++) {
        if (index < weights.length - 1) {
            normalizedWeights[index] = weights[index].mul(constants.WeiPerEther).div(sum);
            normalizedSum = normalizedSum.add(normalizedWeights[index]);
        }
        else {
            normalizedWeights[index] = constants.WeiPerEther.sub(normalizedSum);
        }
    }
    return normalizedWeights;
}
/**
 * Check whether a set of weights are normalized
 * @param weights - an array of potentially unnormalized weights
 * @returns a boolean of whether the weights are normalized
 */
const isNormalizedWeights = (weights) => {
    const totalWeight = weights.reduce((total, weight) => total.add(weight), constants.Zero);
    return totalWeight.eq(constants.WeiPerEther);
};

var isProduction = process.env.NODE_ENV === 'production';
var prefix = 'Invariant failed';
function invariant(condition, message) {
    if (condition) {
        return;
    }
    if (isProduction) {
        throw new Error(prefix);
    }
    var provided = typeof message === 'function' ? message() : message;
    var value = provided ? prefix + ": " + provided : prefix;
    throw new Error(value);
}

/**
 * Splits a poolId into its components, i.e. pool address, pool specialization and its nonce
 * @param poolId - a bytes32 string of the pool's ID
 * @returns an object with the decomposed poolId
 */
const splitPoolId = (poolId) => {
    return {
        address: getPoolAddress(poolId),
        specialization: getPoolSpecialization(poolId),
        nonce: getPoolNonce(poolId),
    };
};
/**
 * Extracts a pool's address from its poolId
 * @param poolId - a bytes32 string of the pool's ID
 * @returns the pool's address
 */
const getPoolAddress = (poolId) => {
    invariant(poolId.length === 66, 'Invalid poolId length');
    return poolId.slice(0, 42);
};
/**
 * Extracts a pool's specialization from its poolId
 * @param poolId - a bytes32 string of the pool's ID
 * @returns the pool's specialization
 */
const getPoolSpecialization = (poolId) => {
    invariant(poolId.length === 66, 'Invalid poolId length');
    // Only have 3 pool specializations so we can just pull the relevant character
    const specializationCode = parseInt(poolId[45]);
    invariant(specializationCode < 3, 'Invalid pool specialization');
    return specializationCode;
};
/**
 * Extracts a pool's nonce from its poolId
 * @param poolId - a bytes32 string of the pool's ID
 * @returns the pool's nonce
 */
const getPoolNonce = (poolId) => {
    invariant(poolId.length === 66, 'Invalid poolId length');
    return bignumber.BigNumber.from(`0x${poolId.slice(46)}`);
};

const balancerErrorCodes = {
    '000': 'ADD_OVERFLOW',
    '001': 'SUB_OVERFLOW',
    '002': 'SUB_UNDERFLOW',
    '003': 'MUL_OVERFLOW',
    '004': 'ZERO_DIVISION',
    '005': 'DIV_INTERNAL',
    '006': 'X_OUT_OF_BOUNDS',
    '007': 'Y_OUT_OF_BOUNDS',
    '008': 'PRODUCT_OUT_OF_BOUNDS',
    '009': 'INVALID_EXPONENT',
    '100': 'OUT_OF_BOUNDS',
    '101': 'UNSORTED_ARRAY',
    '102': 'UNSORTED_TOKENS',
    '103': 'INPUT_LENGTH_MISMATCH',
    '104': 'ZERO_TOKEN',
    '200': 'MIN_TOKENS',
    '201': 'MAX_TOKENS',
    '202': 'MAX_SWAP_FEE_PERCENTAGE',
    '203': 'MIN_SWAP_FEE_PERCENTAGE',
    '204': 'MINIMUM_BPT',
    '205': 'CALLER_NOT_VAULT',
    '206': 'UNINITIALIZED',
    '207': 'BPT_IN_MAX_AMOUNT',
    '208': 'BPT_OUT_MIN_AMOUNT',
    '209': 'EXPIRED_PERMIT',
    '210': 'NOT_TWO_TOKENS',
    '300': 'MIN_AMP',
    '301': 'MAX_AMP',
    '302': 'MIN_WEIGHT',
    '303': 'MAX_STABLE_TOKENS',
    '304': 'MAX_IN_RATIO',
    '305': 'MAX_OUT_RATIO',
    '306': 'MIN_BPT_IN_FOR_TOKEN_OUT',
    '307': 'MAX_OUT_BPT_FOR_TOKEN_IN',
    '308': 'NORMALIZED_WEIGHT_INVARIANT',
    '309': 'INVALID_TOKEN',
    '310': 'UNHANDLED_JOIN_KIND',
    '311': 'ZERO_INVARIANT',
    '312': 'ORACLE_INVALID_SECONDS_QUERY',
    '313': 'ORACLE_NOT_INITIALIZED',
    '314': 'ORACLE_QUERY_TOO_OLD',
    '315': 'ORACLE_INVALID_INDEX',
    '316': 'ORACLE_BAD_SECS',
    '317': 'AMP_END_TIME_TOO_CLOSE',
    '318': 'AMP_ONGOING_UPDATE',
    '319': 'AMP_RATE_TOO_HIGH',
    '320': 'AMP_NO_ONGOING_UPDATE',
    '321': 'STABLE_INVARIANT_DIDNT_CONVERGE',
    '322': 'STABLE_GET_BALANCE_DIDNT_CONVERGE',
    '323': 'RELAYER_NOT_CONTRACT',
    '324': 'BASE_POOL_RELAYER_NOT_CALLED',
    '325': 'REBALANCING_RELAYER_REENTERED',
    '326': 'GRADUAL_UPDATE_TIME_TRAVEL',
    '327': 'SWAPS_DISABLED',
    '328': 'CALLER_IS_NOT_LBP_OWNER',
    '329': 'PRICE_RATE_OVERFLOW',
    '330': 'INVALID_JOIN_EXIT_KIND_WHILE_SWAPS_DISABLED',
    '331': 'WEIGHT_CHANGE_TOO_FAST',
    '332': 'LOWER_GREATER_THAN_UPPER_TARGET',
    '333': 'UPPER_TARGET_TOO_HIGH',
    '334': 'UNHANDLED_BY_LINEAR_POOL',
    '335': 'OUT_OF_TARGET_RANGE',
    '336': 'UNHANDLED_EXIT_KIND ',
    '337': 'UNAUTHORIZED_EXIT',
    '338': 'MAX_MANAGEMENT_SWAP_FEE_PERCENTAGE',
    '339': 'UNHANDLED_BY_MANAGED_POOL',
    '340': 'UNHANDLED_BY_PHANTOM_POOL',
    '341': 'TOKEN_DOES_NOT_HAVE_RATE_PROVIDER',
    '342': 'INVALID_INITIALIZATION',
    '400': 'REENTRANCY',
    '401': 'SENDER_NOT_ALLOWED',
    '402': 'PAUSED',
    '403': 'PAUSE_WINDOW_EXPIRED',
    '404': 'MAX_PAUSE_WINDOW_DURATION',
    '405': 'MAX_BUFFER_PERIOD_DURATION',
    '406': 'INSUFFICIENT_BALANCE',
    '407': 'INSUFFICIENT_ALLOWANCE',
    '408': 'ERC20_TRANSFER_FROM_ZERO_ADDRESS',
    '409': 'ERC20_TRANSFER_TO_ZERO_ADDRESS',
    '410': 'ERC20_MINT_TO_ZERO_ADDRESS',
    '411': 'ERC20_BURN_FROM_ZERO_ADDRESS',
    '412': 'ERC20_APPROVE_FROM_ZERO_ADDRESS',
    '413': 'ERC20_APPROVE_TO_ZERO_ADDRESS',
    '414': 'ERC20_TRANSFER_EXCEEDS_ALLOWANCE',
    '415': 'ERC20_DECREASED_ALLOWANCE_BELOW_ZERO',
    '416': 'ERC20_TRANSFER_EXCEEDS_BALANCE',
    '417': 'ERC20_BURN_EXCEEDS_ALLOWANCE',
    '418': 'SAFE_ERC20_CALL_FAILED',
    '419': 'ADDRESS_INSUFFICIENT_BALANCE',
    '420': 'ADDRESS_CANNOT_SEND_VALUE',
    '421': 'SAFE_CAST_VALUE_CANT_FIT_INT256',
    '422': 'GRANT_SENDER_NOT_ADMIN',
    '423': 'REVOKE_SENDER_NOT_ADMIN',
    '424': 'RENOUNCE_SENDER_NOT_ALLOWED',
    '425': 'BUFFER_PERIOD_EXPIRED',
    '426': 'CALLER_IS_NOT_OWNER',
    '427': 'NEW_OWNER_IS_ZERO',
    '428': 'CODE_DEPLOYMENT_FAILED',
    '429': 'CALL_TO_NON_CONTRACT',
    '430': 'LOW_LEVEL_CALL_FAILED',
    '431': 'NOT_PAUSED',
    '500': 'INVALID_POOL_ID',
    '501': 'CALLER_NOT_POOL',
    '502': 'SENDER_NOT_ASSET_MANAGER',
    '503': 'USER_DOESNT_ALLOW_RELAYER',
    '504': 'INVALID_SIGNATURE',
    '505': 'EXIT_BELOW_MIN',
    '506': 'JOIN_ABOVE_MAX',
    '507': 'SWAP_LIMIT',
    '508': 'SWAP_DEADLINE',
    '509': 'CANNOT_SWAP_SAME_TOKEN',
    '510': 'UNKNOWN_AMOUNT_IN_FIRST_SWAP',
    '511': 'MALCONSTRUCTED_MULTIHOP_SWAP',
    '512': 'INTERNAL_BALANCE_OVERFLOW',
    '513': 'INSUFFICIENT_INTERNAL_BALANCE',
    '514': 'INVALID_ETH_INTERNAL_BALANCE',
    '515': 'INVALID_POST_LOAN_BALANCE',
    '516': 'INSUFFICIENT_ETH',
    '517': 'UNALLOCATED_ETH',
    '518': 'ETH_TRANSFER',
    '519': 'CANNOT_USE_ETH_SENTINEL',
    '520': 'TOKENS_MISMATCH',
    '521': 'TOKEN_NOT_REGISTERED',
    '522': 'TOKEN_ALREADY_REGISTERED',
    '523': 'TOKENS_ALREADY_SET',
    '524': 'TOKENS_LENGTH_MUST_BE_2',
    '525': 'NONZERO_TOKEN_BALANCE',
    '526': 'BALANCE_TOTAL_OVERFLOW',
    '527': 'POOL_NO_TOKENS',
    '528': 'INSUFFICIENT_FLASH_LOAN_BALANCE',
    '600': 'SWAP_FEE_PERCENTAGE_TOO_HIGH',
    '601': 'FLASH_LOAN_FEE_PERCENTAGE_TOO_HIGH',
    '602': 'INSUFFICIENT_FLASH_LOAN_FEE_AMOUNT',
};
class BalancerErrors {
    /**
     * Cannot be constructed.
     */
    constructor() {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
    }
}
BalancerErrors.isErrorCode = (error) => {
    if (!error.includes('BAL#'))
        return false;
    const errorCode = error.replace('BAL#', '');
    return Object.keys(balancerErrorCodes).includes(errorCode);
};
/**
 * Decodes a Balancer error code into the corresponding reason
 * @param error - a Balancer error code of the form `BAL#000`
 * @returns The decoded error reason
 */
BalancerErrors.parseErrorCode = (error) => {
    if (!error.includes('BAL#'))
        throw new Error('Error code not found');
    const errorCode = error.replace('BAL#', '');
    const actualError = balancerErrorCodes[errorCode];
    if (!actualError)
        throw new Error('Error code not found');
    return actualError;
};
/**
 * Decodes a Balancer error code into the corresponding reason
 * @param error - a Balancer error code of the form `BAL#000`
 * @returns The decoded error reason if passed a valid error code, otherwise returns passed input
 */
BalancerErrors.tryParseErrorCode = (error) => {
    try {
        return BalancerErrors.parseErrorCode(error);
    }
    catch {
        return error;
    }
};
/**
 * Tests whether a string is a known Balancer error message
 * @param error - a string to be checked verified as a Balancer error message
 */
BalancerErrors.isBalancerError = (error) => Object.values(balancerErrorCodes).includes(error);
/**
 * Encodes an error string into the corresponding error code
 * @param error - a Balancer error message string
 * @returns a Balancer error code of the form `BAL#000`
 */
BalancerErrors.encodeError = (error) => {
    const encodedError = Object.entries(balancerErrorCodes).find(([, message]) => message === error);
    if (!encodedError)
        throw Error('Error message not found');
    return `BAL#${encodedError[0]}`;
};

async function accountToAddress(account) {
    if (typeof account == 'string')
        return account;
    if (abstractSigner.Signer.isSigner(account))
        return account.getAddress();
    if (account.address)
        return account.address;
    throw new Error('Could not read account address');
}
exports.RelayerAction = void 0;
(function (RelayerAction) {
    RelayerAction["JoinPool"] = "JoinPool";
    RelayerAction["ExitPool"] = "ExitPool";
    RelayerAction["Swap"] = "Swap";
    RelayerAction["BatchSwap"] = "BatchSwap";
    RelayerAction["SetRelayerApproval"] = "SetRelayerApproval";
})(exports.RelayerAction || (exports.RelayerAction = {}));
class RelayerAuthorization {
    /**
     * Cannot be constructed.
     */
    constructor() {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
    }
}
RelayerAuthorization.encodeCalldataAuthorization = (calldata, deadline, signature) => {
    const encodedDeadline = bytes.hexZeroPad(bytes.hexValue(deadline), 32).slice(2);
    const { v, r, s } = bytes.splitSignature(signature);
    const encodedV = bytes.hexZeroPad(bytes.hexValue(v), 32).slice(2);
    const encodedR = r.slice(2);
    const encodedS = s.slice(2);
    return `${calldata}${encodedDeadline}${encodedV}${encodedR}${encodedS}`;
};
RelayerAuthorization.signJoinAuthorization = (validator, user, allowedSender, allowedCalldata, deadline, nonce) => RelayerAuthorization.signAuthorizationFor(exports.RelayerAction.JoinPool, validator, user, allowedSender, allowedCalldata, deadline, nonce);
RelayerAuthorization.signExitAuthorization = (validator, user, allowedSender, allowedCalldata, deadline, nonce) => RelayerAuthorization.signAuthorizationFor(exports.RelayerAction.ExitPool, validator, user, allowedSender, allowedCalldata, deadline, nonce);
RelayerAuthorization.signSwapAuthorization = (validator, user, allowedSender, allowedCalldata, deadline, nonce) => RelayerAuthorization.signAuthorizationFor(exports.RelayerAction.Swap, validator, user, allowedSender, allowedCalldata, deadline, nonce);
RelayerAuthorization.signBatchSwapAuthorization = (validator, user, allowedSender, allowedCalldata, deadline, nonce) => RelayerAuthorization.signAuthorizationFor(exports.RelayerAction.BatchSwap, validator, user, allowedSender, allowedCalldata, deadline, nonce);
RelayerAuthorization.signSetRelayerApprovalAuthorization = (validator, user, allowedSender, allowedCalldata, deadline, nonce) => RelayerAuthorization.signAuthorizationFor(exports.RelayerAction.SetRelayerApproval, validator, user, allowedSender, allowedCalldata, deadline, nonce);
RelayerAuthorization.signAuthorizationFor = async (type, validator, user, allowedSender, allowedCalldata, deadline = constants.MaxUint256, nonce) => {
    const { chainId } = await validator.provider.getNetwork();
    if (!nonce) {
        const userAddress = await user.getAddress();
        nonce = (await validator.getNextNonce(userAddress));
    }
    const domain = {
        name: 'Balancer V2 Vault',
        version: '1',
        chainId,
        verifyingContract: validator.address,
    };
    const types = {
        [type]: [
            { name: 'calldata', type: 'bytes' },
            { name: 'sender', type: 'address' },
            { name: 'nonce', type: 'uint256' },
            { name: 'deadline', type: 'uint256' },
        ],
    };
    const value = {
        calldata: allowedCalldata,
        sender: await accountToAddress(allowedSender),
        nonce: nonce.toString(),
        deadline: deadline.toString(),
    };
    return user._signTypedData(domain, types, value);
};

const signPermit = async (token, owner, spender, amount, deadline = constants.MaxUint256, nonce) => {
    const { chainId } = await token.provider.getNetwork();
    const ownerAddress = await owner.getAddress();
    if (!nonce)
        nonce = (await token.nonces(ownerAddress));
    const domain = {
        name: await token.name(),
        version: '1',
        chainId,
        verifyingContract: token.address,
    };
    const types = {
        Permit: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
            { name: 'value', type: 'uint256' },
            { name: 'nonce', type: 'uint256' },
            { name: 'deadline', type: 'uint256' },
        ],
    };
    const value = {
        owner: ownerAddress,
        spender: await accountToAddress(spender),
        value: amount,
        nonce,
        deadline,
    };
    const signature = await owner._signTypedData(domain, types, value);
    return {
        ...bytes.splitSignature(signature),
        deadline: bignumber.BigNumber.from(deadline),
        nonce: bignumber.BigNumber.from(nonce),
    };
};

const cmpTokens = (tokenA, tokenB) => tokenA.toLowerCase() > tokenB.toLowerCase() ? 1 : -1;
const transposeMatrix = (matrix) => matrix[0].map((_, columnIndex) => matrix.map((row) => row[columnIndex]));
class AssetHelpers {
    constructor(wethAddress) {
        this.ETH = constants.AddressZero;
        /**
         * Tests whether `token` is ETH (represented by `0x0000...0000`).
         *
         * @param token - the address of the asset to be checked
         */
        this.isETH = (token) => AssetHelpers.isEqual(token, this.ETH);
        /**
         * Tests whether `token` is WETH.
         *
         * @param token - the address of the asset to be checked
         */
        this.isWETH = (token) => AssetHelpers.isEqual(token, this.WETH);
        /**
         * Converts an asset to the equivalent ERC20 address.
         *
         * For ERC20s this will return the passed address but passing ETH (`0x0000...0000`) will return the WETH address
         * @param token - the address of the asset to be translated to an equivalent ERC20
         * @returns the address of translated ERC20 asset
         */
        this.translateToERC20 = (token) => this.isETH(token) ? this.WETH : token;
        this.WETH = address.getAddress(wethAddress);
    }
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
    sortTokens(tokens, ...others) {
        others.forEach((array) => invariant(tokens.length === array.length, 'array length mismatch'));
        // We want to sort ETH as if were WETH so we translate to ERC20s
        const erc20Tokens = tokens.map(this.translateToERC20);
        const transpose = transposeMatrix([erc20Tokens, ...others]);
        const sortedTranspose = transpose.sort(([tokenA], [tokenB]) => cmpTokens(tokenA, tokenB));
        const [sortedErc20s, ...sortedOthers] = transposeMatrix(sortedTranspose);
        // If one of the tokens was ETH, we need to translate back from WETH
        const sortedTokens = tokens.includes(this.ETH)
            ? sortedErc20s.map((token) => this.isWETH(token) ? this.ETH : token)
            : sortedErc20s;
        return [sortedTokens, ...sortedOthers];
    }
}
AssetHelpers.isEqual = (addressA, addressB) => address.getAddress(addressA) === address.getAddress(addressB);

var aTokenRateProvider = [
	{
		inputs: [
			{
				internalType: "contract IStaticAToken",
				name: "_waToken",
				type: "address"
			}
		],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		inputs: [
		],
		name: "getRate",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "waToken",
		outputs: [
			{
				internalType: "contract IStaticAToken",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	}
];

class AaveHelpers {
    static async getRate(rateProviderAddress, provider) {
        const rateProviderContract = new contracts.Contract(rateProviderAddress, aTokenRateProvider, provider);
        const rate = await rateProviderContract.getRate();
        return rate.toString();
    }
}

const isSameAddress = (address1, address2) => address.getAddress(address1) === address.getAddress(address2);

exports.PoolSpecialization = void 0;
(function (PoolSpecialization) {
    PoolSpecialization[PoolSpecialization["GeneralPool"] = 0] = "GeneralPool";
    PoolSpecialization[PoolSpecialization["MinimalSwapInfoPool"] = 1] = "MinimalSwapInfoPool";
    PoolSpecialization[PoolSpecialization["TwoTokenPool"] = 2] = "TwoTokenPool";
})(exports.PoolSpecialization || (exports.PoolSpecialization = {}));
// Balance Operations
exports.UserBalanceOpKind = void 0;
(function (UserBalanceOpKind) {
    UserBalanceOpKind[UserBalanceOpKind["DepositInternal"] = 0] = "DepositInternal";
    UserBalanceOpKind[UserBalanceOpKind["WithdrawInternal"] = 1] = "WithdrawInternal";
    UserBalanceOpKind[UserBalanceOpKind["TransferInternal"] = 2] = "TransferInternal";
    UserBalanceOpKind[UserBalanceOpKind["TransferExternal"] = 3] = "TransferExternal";
})(exports.UserBalanceOpKind || (exports.UserBalanceOpKind = {}));
exports.PoolBalanceOpKind = void 0;
(function (PoolBalanceOpKind) {
    PoolBalanceOpKind[PoolBalanceOpKind["Withdraw"] = 0] = "Withdraw";
    PoolBalanceOpKind[PoolBalanceOpKind["Deposit"] = 1] = "Deposit";
    PoolBalanceOpKind[PoolBalanceOpKind["Update"] = 2] = "Update";
})(exports.PoolBalanceOpKind || (exports.PoolBalanceOpKind = {}));

exports.SwapType = void 0;
(function (SwapType) {
    SwapType[SwapType["SwapExactIn"] = 0] = "SwapExactIn";
    SwapType[SwapType["SwapExactOut"] = 1] = "SwapExactOut";
})(exports.SwapType || (exports.SwapType = {}));

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
function getLimitsForSlippage(tokensIn, tokensOut, swapType, deltas, assets, slippage) {
    // Limits:
    // +ve means max to send
    // -ve mean min to receive
    // For a multihop the intermediate tokens should be 0
    const limits = new Array(assets.length).fill(constants.Zero);
    assets.forEach((token, i) => {
        if (tokensIn.some((tokenIn) => isSameAddress(token, tokenIn))) {
            // For SwapExactOut slippage is on tokenIn, i.e. amtIn + slippage
            const slippageAmount = bignumber.BigNumber.from(slippage).add(constants.WeiPerEther);
            limits[i] =
                swapType === exports.SwapType.SwapExactOut
                    ? limits[i].add(bignumber.BigNumber.from(deltas[i])
                        .mul(slippageAmount)
                        .div(constants.WeiPerEther))
                    : limits[i].add(deltas[i]);
        }
        if (tokensOut.some((tokenOut) => isSameAddress(token, tokenOut))) {
            // For SwapExactIn slippage is on tokenOut, i.e. amtOut - slippage
            const slippageAmount = constants.WeiPerEther.sub(bignumber.BigNumber.from(slippage));
            limits[i] =
                swapType === exports.SwapType.SwapExactIn
                    ? limits[i].add(bignumber.BigNumber.from(deltas[i])
                        .mul(slippageAmount)
                        .div(constants.WeiPerEther))
                    : limits[i].add(deltas[i]);
        }
    });
    return limits;
}

exports.Network = void 0;
(function (Network) {
    Network[Network["MAINNET"] = 1] = "MAINNET";
    Network[Network["ROPSTEN"] = 3] = "ROPSTEN";
    Network[Network["RINKEBY"] = 4] = "RINKEBY";
    Network[Network["G\u00D6RLI"] = 5] = "G\u00D6RLI";
    Network[Network["KOVAN"] = 42] = "KOVAN";
    Network[Network["POLYGON"] = 137] = "POLYGON";
    Network[Network["ARBITRUM"] = 42161] = "ARBITRUM";
})(exports.Network || (exports.Network = {}));

/*
 * queryBatchSwap simulates a call to `batchSwap`, returning an array of Vault asset deltas. Calls to `swap` cannot be
 * simulated directly, but an equivalent `batchSwap` call can and will yield the exact same result.
 *
 * Each element in the array corresponds to the asset at the same index, and indicates the number of tokens (or ETH)
 * the Vault would take from the sender (if positive) or send to the recipient (if negative). The arguments it
 * receives are the same that an equivalent `batchSwap` call would receive.
 */
async function queryBatchSwap(vaultContract, swapType, swaps, assets) {
    const funds = {
        sender: constants.AddressZero,
        recipient: constants.AddressZero,
        fromInternalBalance: false,
        toInternalBalance: false,
    };
    try {
        const deltas = await vaultContract.queryBatchSwap(swapType, swaps, assets, funds);
        return deltas.map((d) => d.toString());
    }
    catch (err) {
        throw `queryBatchSwap call error: ${err}`;
    }
}
/*
Uses SOR to create a batchSwap which is then queried onChain.
*/
async function queryBatchSwapWithSor(sor, vaultContract, queryWithSor) {
    if (queryWithSor.fetchPools.fetchPools)
        await sor.fetchPools();
    const swaps = [];
    const assetArray = [];
    // get path information for each tokenIn
    for (let i = 0; i < queryWithSor.tokensIn.length; i++) {
        const swap = await getSorSwapInfo(queryWithSor.tokensIn[i], queryWithSor.tokensOut[i], queryWithSor.swapType, queryWithSor.amounts[i].toString(), sor);
        swaps.push(swap.swaps);
        assetArray.push(swap.tokenAddresses);
    }
    // Join swaps and assets together correctly
    const batchedSwaps = batchSwaps(assetArray, swaps);
    const returnTokens = queryWithSor.swapType === exports.SwapType.SwapExactIn
        ? queryWithSor.tokensOut
        : queryWithSor.tokensIn;
    const returnAmounts = Array(returnTokens.length).fill(constants.Zero);
    let deltas = Array(batchedSwaps.assets.length).fill(constants.Zero);
    try {
        // Onchain query
        deltas = await queryBatchSwap(vaultContract, queryWithSor.swapType, batchedSwaps.swaps, batchedSwaps.assets);
        if (deltas.length > 0) {
            returnTokens.forEach((t, i) => {
                const idx = batchedSwaps.assets.indexOf(t.toLowerCase());
                returnAmounts[i] =
                    idx !== -1 ? deltas[idx].toString() : constants.Zero.toString();
            });
        }
    }
    catch (err) {
        console.error(`queryBatchSwapTokensIn error: ${err}`);
    }
    return {
        returnAmounts,
        swaps: batchedSwaps.swaps,
        assets: batchedSwaps.assets,
        deltas: deltas.map((d) => d.toString()),
    };
}
/*
Use SOR to get swapInfo for tokenIn>tokenOut.
SwapInfos.swaps has path information.
*/
async function getSorSwapInfo(tokenIn, tokenOut, swapType, amount, sor$1) {
    const swapTypeSOR = swapType === exports.SwapType.SwapExactIn
        ? sor.SwapTypes.SwapExactIn
        : sor.SwapTypes.SwapExactOut;
    const swapInfo = await sor$1.getSwaps(tokenIn.toLowerCase(), tokenOut.toLowerCase(), swapTypeSOR, amount);
    return swapInfo;
}
/*
Format multiple individual swaps/assets into a single swap/asset.
*/
function batchSwaps(assetArray, swaps) {
    // asset addresses without duplicates
    const newAssetArray = [...new Set(assetArray.flat())];
    // Update indices of each swap to use new asset array
    swaps.forEach((swap, i) => {
        swap.forEach((poolSwap) => {
            poolSwap.assetInIndex = newAssetArray.indexOf(assetArray[i][poolSwap.assetInIndex]);
            poolSwap.assetOutIndex = newAssetArray.indexOf(assetArray[i][poolSwap.assetOutIndex]);
        });
    });
    // Join Swaps into a single batchSwap
    const batchedSwaps = swaps.flat();
    return { swaps: batchedSwaps, assets: newAssetArray };
}

const balancerVault = '0xb8f34fa65bef9c361eb52d95a930fa3548b3fba3';
const BALANCER_NETWORK_CONFIG = {
    [exports.Network.MAINNET]: {
        chainId: exports.Network.MAINNET,
        addresses: {
            contracts: {
                vault: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
                multicall: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
            },
            tokens: {
                wrappedNativeAsset: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            },
            linearFactories: {
                '0xd7fad3bd59d6477cbe1be7f646f7f1ba25b230f8': 'aave',
            },
        },
        urls: {
            subgraph: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2',
        },
        pools: {
            staBal3Pool: {
                id: '0x7b50775383d3d6f0215a8f290f2c9e2eebbeceb20000000000000000000000fe',
                address: '0x7b50775383d3d6f0215a8f290f2c9e2eebbeceb2',
            },
        },
    },
    [exports.Network.POLYGON]: {
        chainId: exports.Network.POLYGON,
        addresses: {
            contracts: {
                vault: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
                multicall: '0xa1B2b503959aedD81512C37e9dce48164ec6a94d',
            },
            tokens: {
                wrappedNativeAsset: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
            },
        },
        urls: {
            subgraph: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-polygon-v2',
        },
        pools: {},
    },
    [exports.Network.ARBITRUM]: {
        chainId: exports.Network.ARBITRUM,
        addresses: {
            contracts: {
                vault: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
                multicall: '0x269ff446d9892c9e19082564df3f5e8741e190a1',
            },
            tokens: {
                wrappedNativeAsset: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
            },
        },
        urls: {
            subgraph: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-arbitrum-v2',
        },
        pools: {},
    },
    [exports.Network.KOVAN]: {
        chainId: exports.Network.KOVAN,
        addresses: {
            contracts: {
                vault: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
                multicall: '0x2cc8688C5f75E365aaEEb4ea8D6a480405A48D2A',
            },
            tokens: {
                wrappedNativeAsset: '0xdFCeA9088c8A88A76FF74892C1457C17dfeef9C1',
            },
        },
        urls: {
            subgraph: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-kovan-v2',
        },
        pools: {
            staBal3Pool: {
                id: '0x8fd162f338b770f7e879030830cde9173367f3010000000000000000000004d8',
                address: '0x8fd162f338b770f7e879030830cde9173367f301',
            },
            wethStaBal3: {
                id: '0x6be79a54f119dbf9e8ebd9ded8c5bd49205bc62d00020000000000000000033c',
                address: '0x6be79a54f119dbf9e8ebd9ded8c5bd49205bc62d',
            },
        },
    },
    [exports.Network.ROPSTEN]: {
        chainId: exports.Network.ROPSTEN,
        addresses: {
            contracts: {
                vault: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
                multicall: '0x53c43764255c17bd724f74c4ef150724ac50a3ed',
            },
            tokens: {
                wrappedNativeAsset: '0xdFCeA9088c8A88A76FF74892C1457C17dfeef9C1',
            },
        },
        urls: {
            subgraph: '',
        },
        pools: {},
    },
    [exports.Network.RINKEBY]: {
        chainId: exports.Network.RINKEBY,
        addresses: {
            contracts: {
                vault: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
                multicall: '0x42ad527de7d4e9d9d011ac45b31d8551f8fe9821',
            },
            tokens: {
                wrappedNativeAsset: '0xdFCeA9088c8A88A76FF74892C1457C17dfeef9C1',
            },
        },
        urls: {
            subgraph: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-rinkeby-v2',
        },
        pools: {},
    },
    [exports.Network.GÖRLI]: {
        chainId: exports.Network.GÖRLI,
        addresses: {
            contracts: {
                vault: '0x65748E8287Ce4B9E6D83EE853431958851550311',
                multicall: '0x42ad527de7d4e9d9d011ac45b31d8551f8fe9821',
            },
            tokens: {
                wrappedNativeAsset: '0x9A1000D492d40bfccbc03f413A48F5B6516Ec0Fd',
            },
        },
        urls: {
            subgraph: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-goerli-v2',
        },
        pools: {},
    },
};

var vaultAbi = [
	{
		inputs: [
			{
				internalType: "contract IAuthorizer",
				name: "authorizer",
				type: "address"
			},
			{
				internalType: "contract IWETH",
				name: "weth",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "pauseWindowDuration",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "bufferPeriodDuration",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "contract IAuthorizer",
				name: "newAuthorizer",
				type: "address"
			}
		],
		name: "AuthorizerChanged",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "contract IERC20",
				name: "token",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				indexed: false,
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "ExternalBalanceTransfer",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "contract IFlashLoanRecipient",
				name: "recipient",
				type: "address"
			},
			{
				indexed: true,
				internalType: "contract IERC20",
				name: "token",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "feeAmount",
				type: "uint256"
			}
		],
		name: "FlashLoan",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "user",
				type: "address"
			},
			{
				indexed: true,
				internalType: "contract IERC20",
				name: "token",
				type: "address"
			},
			{
				indexed: false,
				internalType: "int256",
				name: "delta",
				type: "int256"
			}
		],
		name: "InternalBalanceChanged",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "bool",
				name: "paused",
				type: "bool"
			}
		],
		name: "PausedStateChanged",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "poolId",
				type: "bytes32"
			},
			{
				indexed: true,
				internalType: "address",
				name: "liquidityProvider",
				type: "address"
			},
			{
				indexed: false,
				internalType: "contract IERC20[]",
				name: "tokens",
				type: "address[]"
			},
			{
				indexed: false,
				internalType: "int256[]",
				name: "deltas",
				type: "int256[]"
			},
			{
				indexed: false,
				internalType: "uint256[]",
				name: "protocolFeeAmounts",
				type: "uint256[]"
			}
		],
		name: "PoolBalanceChanged",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "poolId",
				type: "bytes32"
			},
			{
				indexed: true,
				internalType: "address",
				name: "assetManager",
				type: "address"
			},
			{
				indexed: true,
				internalType: "contract IERC20",
				name: "token",
				type: "address"
			},
			{
				indexed: false,
				internalType: "int256",
				name: "cashDelta",
				type: "int256"
			},
			{
				indexed: false,
				internalType: "int256",
				name: "managedDelta",
				type: "int256"
			}
		],
		name: "PoolBalanceManaged",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "poolId",
				type: "bytes32"
			},
			{
				indexed: true,
				internalType: "address",
				name: "poolAddress",
				type: "address"
			},
			{
				indexed: false,
				internalType: "enum IVault.PoolSpecialization",
				name: "specialization",
				type: "uint8"
			}
		],
		name: "PoolRegistered",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "relayer",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				indexed: false,
				internalType: "bool",
				name: "approved",
				type: "bool"
			}
		],
		name: "RelayerApprovalChanged",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "poolId",
				type: "bytes32"
			},
			{
				indexed: true,
				internalType: "contract IERC20",
				name: "tokenIn",
				type: "address"
			},
			{
				indexed: true,
				internalType: "contract IERC20",
				name: "tokenOut",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amountOut",
				type: "uint256"
			}
		],
		name: "Swap",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "poolId",
				type: "bytes32"
			},
			{
				indexed: false,
				internalType: "contract IERC20[]",
				name: "tokens",
				type: "address[]"
			}
		],
		name: "TokensDeregistered",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "poolId",
				type: "bytes32"
			},
			{
				indexed: false,
				internalType: "contract IERC20[]",
				name: "tokens",
				type: "address[]"
			},
			{
				indexed: false,
				internalType: "address[]",
				name: "assetManagers",
				type: "address[]"
			}
		],
		name: "TokensRegistered",
		type: "event"
	},
	{
		inputs: [
		],
		name: "WETH",
		outputs: [
			{
				internalType: "contract IWETH",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "enum IVault.SwapKind",
				name: "kind",
				type: "uint8"
			},
			{
				components: [
					{
						internalType: "bytes32",
						name: "poolId",
						type: "bytes32"
					},
					{
						internalType: "uint256",
						name: "assetInIndex",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "assetOutIndex",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount",
						type: "uint256"
					},
					{
						internalType: "bytes",
						name: "userData",
						type: "bytes"
					}
				],
				internalType: "struct IVault.BatchSwapStep[]",
				name: "swaps",
				type: "tuple[]"
			},
			{
				internalType: "contract IAsset[]",
				name: "assets",
				type: "address[]"
			},
			{
				components: [
					{
						internalType: "address",
						name: "sender",
						type: "address"
					},
					{
						internalType: "bool",
						name: "fromInternalBalance",
						type: "bool"
					},
					{
						internalType: "address payable",
						name: "recipient",
						type: "address"
					},
					{
						internalType: "bool",
						name: "toInternalBalance",
						type: "bool"
					}
				],
				internalType: "struct IVault.FundManagement",
				name: "funds",
				type: "tuple"
			},
			{
				internalType: "int256[]",
				name: "limits",
				type: "int256[]"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "batchSwap",
		outputs: [
			{
				internalType: "int256[]",
				name: "assetDeltas",
				type: "int256[]"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "poolId",
				type: "bytes32"
			},
			{
				internalType: "contract IERC20[]",
				name: "tokens",
				type: "address[]"
			}
		],
		name: "deregisterTokens",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "poolId",
				type: "bytes32"
			},
			{
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				internalType: "address payable",
				name: "recipient",
				type: "address"
			},
			{
				components: [
					{
						internalType: "contract IAsset[]",
						name: "assets",
						type: "address[]"
					},
					{
						internalType: "uint256[]",
						name: "minAmountsOut",
						type: "uint256[]"
					},
					{
						internalType: "bytes",
						name: "userData",
						type: "bytes"
					},
					{
						internalType: "bool",
						name: "toInternalBalance",
						type: "bool"
					}
				],
				internalType: "struct IVault.ExitPoolRequest",
				name: "request",
				type: "tuple"
			}
		],
		name: "exitPool",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "contract IFlashLoanRecipient",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "contract IERC20[]",
				name: "tokens",
				type: "address[]"
			},
			{
				internalType: "uint256[]",
				name: "amounts",
				type: "uint256[]"
			},
			{
				internalType: "bytes",
				name: "userData",
				type: "bytes"
			}
		],
		name: "flashLoan",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes4",
				name: "selector",
				type: "bytes4"
			}
		],
		name: "getActionId",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getAuthorizer",
		outputs: [
			{
				internalType: "contract IAuthorizer",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getDomainSeparator",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "user",
				type: "address"
			},
			{
				internalType: "contract IERC20[]",
				name: "tokens",
				type: "address[]"
			}
		],
		name: "getInternalBalance",
		outputs: [
			{
				internalType: "uint256[]",
				name: "balances",
				type: "uint256[]"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "user",
				type: "address"
			}
		],
		name: "getNextNonce",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getPausedState",
		outputs: [
			{
				internalType: "bool",
				name: "paused",
				type: "bool"
			},
			{
				internalType: "uint256",
				name: "pauseWindowEndTime",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "bufferPeriodEndTime",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "poolId",
				type: "bytes32"
			}
		],
		name: "getPool",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			},
			{
				internalType: "enum IVault.PoolSpecialization",
				name: "",
				type: "uint8"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "poolId",
				type: "bytes32"
			},
			{
				internalType: "contract IERC20",
				name: "token",
				type: "address"
			}
		],
		name: "getPoolTokenInfo",
		outputs: [
			{
				internalType: "uint256",
				name: "cash",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "managed",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "lastChangeBlock",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "assetManager",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "poolId",
				type: "bytes32"
			}
		],
		name: "getPoolTokens",
		outputs: [
			{
				internalType: "contract IERC20[]",
				name: "tokens",
				type: "address[]"
			},
			{
				internalType: "uint256[]",
				name: "balances",
				type: "uint256[]"
			},
			{
				internalType: "uint256",
				name: "lastChangeBlock",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getProtocolFeesCollector",
		outputs: [
			{
				internalType: "contract ProtocolFeesCollector",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "user",
				type: "address"
			},
			{
				internalType: "address",
				name: "relayer",
				type: "address"
			}
		],
		name: "hasApprovedRelayer",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "poolId",
				type: "bytes32"
			},
			{
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				components: [
					{
						internalType: "contract IAsset[]",
						name: "assets",
						type: "address[]"
					},
					{
						internalType: "uint256[]",
						name: "maxAmountsIn",
						type: "uint256[]"
					},
					{
						internalType: "bytes",
						name: "userData",
						type: "bytes"
					},
					{
						internalType: "bool",
						name: "fromInternalBalance",
						type: "bool"
					}
				],
				internalType: "struct IVault.JoinPoolRequest",
				name: "request",
				type: "tuple"
			}
		],
		name: "joinPool",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "enum IVault.PoolBalanceOpKind",
						name: "kind",
						type: "uint8"
					},
					{
						internalType: "bytes32",
						name: "poolId",
						type: "bytes32"
					},
					{
						internalType: "contract IERC20",
						name: "token",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "amount",
						type: "uint256"
					}
				],
				internalType: "struct IVault.PoolBalanceOp[]",
				name: "ops",
				type: "tuple[]"
			}
		],
		name: "managePoolBalance",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "enum IVault.UserBalanceOpKind",
						name: "kind",
						type: "uint8"
					},
					{
						internalType: "contract IAsset",
						name: "asset",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "amount",
						type: "uint256"
					},
					{
						internalType: "address",
						name: "sender",
						type: "address"
					},
					{
						internalType: "address payable",
						name: "recipient",
						type: "address"
					}
				],
				internalType: "struct IVault.UserBalanceOp[]",
				name: "ops",
				type: "tuple[]"
			}
		],
		name: "manageUserBalance",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "enum IVault.SwapKind",
				name: "kind",
				type: "uint8"
			},
			{
				components: [
					{
						internalType: "bytes32",
						name: "poolId",
						type: "bytes32"
					},
					{
						internalType: "uint256",
						name: "assetInIndex",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "assetOutIndex",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount",
						type: "uint256"
					},
					{
						internalType: "bytes",
						name: "userData",
						type: "bytes"
					}
				],
				internalType: "struct IVault.BatchSwapStep[]",
				name: "swaps",
				type: "tuple[]"
			},
			{
				internalType: "contract IAsset[]",
				name: "assets",
				type: "address[]"
			},
			{
				components: [
					{
						internalType: "address",
						name: "sender",
						type: "address"
					},
					{
						internalType: "bool",
						name: "fromInternalBalance",
						type: "bool"
					},
					{
						internalType: "address payable",
						name: "recipient",
						type: "address"
					},
					{
						internalType: "bool",
						name: "toInternalBalance",
						type: "bool"
					}
				],
				internalType: "struct IVault.FundManagement",
				name: "funds",
				type: "tuple"
			}
		],
		name: "queryBatchSwap",
		outputs: [
			{
				internalType: "int256[]",
				name: "",
				type: "int256[]"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "enum IVault.PoolSpecialization",
				name: "specialization",
				type: "uint8"
			}
		],
		name: "registerPool",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "poolId",
				type: "bytes32"
			},
			{
				internalType: "contract IERC20[]",
				name: "tokens",
				type: "address[]"
			},
			{
				internalType: "address[]",
				name: "assetManagers",
				type: "address[]"
			}
		],
		name: "registerTokens",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "contract IAuthorizer",
				name: "newAuthorizer",
				type: "address"
			}
		],
		name: "setAuthorizer",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bool",
				name: "paused",
				type: "bool"
			}
		],
		name: "setPaused",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				internalType: "address",
				name: "relayer",
				type: "address"
			},
			{
				internalType: "bool",
				name: "approved",
				type: "bool"
			}
		],
		name: "setRelayerApproval",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "bytes32",
						name: "poolId",
						type: "bytes32"
					},
					{
						internalType: "enum IVault.SwapKind",
						name: "kind",
						type: "uint8"
					},
					{
						internalType: "contract IAsset",
						name: "assetIn",
						type: "address"
					},
					{
						internalType: "contract IAsset",
						name: "assetOut",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "amount",
						type: "uint256"
					},
					{
						internalType: "bytes",
						name: "userData",
						type: "bytes"
					}
				],
				internalType: "struct IVault.SingleSwap",
				name: "singleSwap",
				type: "tuple"
			},
			{
				components: [
					{
						internalType: "address",
						name: "sender",
						type: "address"
					},
					{
						internalType: "bool",
						name: "fromInternalBalance",
						type: "bool"
					},
					{
						internalType: "address payable",
						name: "recipient",
						type: "address"
					},
					{
						internalType: "bool",
						name: "toInternalBalance",
						type: "bool"
					}
				],
				internalType: "struct IVault.FundManagement",
				name: "funds",
				type: "tuple"
			},
			{
				internalType: "uint256",
				name: "limit",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "swap",
		outputs: [
			{
				internalType: "uint256",
				name: "amountCalculated",
				type: "uint256"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		stateMutability: "payable",
		type: "receive"
	}
];

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var docCache = new Map();
var fragmentSourceMap = new Map();
var printFragmentWarnings = true;
var experimentalFragmentVariables = false;
function normalize(string) {
    return string.replace(/[\s,]+/g, ' ').trim();
}
function cacheKeyFromLoc(loc) {
    return normalize(loc.source.body.substring(loc.start, loc.end));
}
function processFragments(ast) {
    var seenKeys = new Set();
    var definitions = [];
    ast.definitions.forEach(function (fragmentDefinition) {
        if (fragmentDefinition.kind === 'FragmentDefinition') {
            var fragmentName = fragmentDefinition.name.value;
            var sourceKey = cacheKeyFromLoc(fragmentDefinition.loc);
            var sourceKeySet = fragmentSourceMap.get(fragmentName);
            if (sourceKeySet && !sourceKeySet.has(sourceKey)) {
                if (printFragmentWarnings) {
                    console.warn("Warning: fragment with name " + fragmentName + " already exists.\n"
                        + "graphql-tag enforces all fragment names across your application to be unique; read more about\n"
                        + "this in the docs: http://dev.apollodata.com/core/fragments.html#unique-names");
                }
            }
            else if (!sourceKeySet) {
                fragmentSourceMap.set(fragmentName, sourceKeySet = new Set);
            }
            sourceKeySet.add(sourceKey);
            if (!seenKeys.has(sourceKey)) {
                seenKeys.add(sourceKey);
                definitions.push(fragmentDefinition);
            }
        }
        else {
            definitions.push(fragmentDefinition);
        }
    });
    return __assign(__assign({}, ast), { definitions: definitions });
}
function stripLoc(doc) {
    var workSet = new Set(doc.definitions);
    workSet.forEach(function (node) {
        if (node.loc)
            delete node.loc;
        Object.keys(node).forEach(function (key) {
            var value = node[key];
            if (value && typeof value === 'object') {
                workSet.add(value);
            }
        });
    });
    var loc = doc.loc;
    if (loc) {
        delete loc.startToken;
        delete loc.endToken;
    }
    return doc;
}
function parseDocument(source) {
    var cacheKey = normalize(source);
    if (!docCache.has(cacheKey)) {
        var parsed = graphql.parse(source, {
            experimentalFragmentVariables: experimentalFragmentVariables,
            allowLegacyFragmentVariables: experimentalFragmentVariables
        });
        if (!parsed || parsed.kind !== 'Document') {
            throw new Error('Not a valid GraphQL document.');
        }
        docCache.set(cacheKey, stripLoc(processFragments(parsed)));
    }
    return docCache.get(cacheKey);
}
function gql(literals) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (typeof literals === 'string') {
        literals = [literals];
    }
    var result = literals[0];
    args.forEach(function (arg, i) {
        if (arg && arg.kind === 'Document') {
            result += arg.loc.source.body;
        }
        else {
            result += arg;
        }
        result += literals[i + 1];
    });
    return parseDocument(result);
}
function resetCaches() {
    docCache.clear();
    fragmentSourceMap.clear();
}
function disableFragmentWarnings() {
    printFragmentWarnings = false;
}
function enableExperimentalFragmentVariables() {
    experimentalFragmentVariables = true;
}
function disableExperimentalFragmentVariables() {
    experimentalFragmentVariables = false;
}
var extras = {
    gql: gql,
    resetCaches: resetCaches,
    disableFragmentWarnings: disableFragmentWarnings,
    enableExperimentalFragmentVariables: enableExperimentalFragmentVariables,
    disableExperimentalFragmentVariables: disableExperimentalFragmentVariables
};
(function (gql_1) {
    gql_1.gql = extras.gql, gql_1.resetCaches = extras.resetCaches, gql_1.disableFragmentWarnings = extras.disableFragmentWarnings, gql_1.enableExperimentalFragmentVariables = extras.enableExperimentalFragmentVariables, gql_1.disableExperimentalFragmentVariables = extras.disableExperimentalFragmentVariables;
})(gql || (gql = {}));
gql["default"] = gql;
var gql$1 = gql;

var AmpUpdate_OrderBy;
(function (AmpUpdate_OrderBy) {
    AmpUpdate_OrderBy["EndAmp"] = "endAmp";
    AmpUpdate_OrderBy["EndTimestamp"] = "endTimestamp";
    AmpUpdate_OrderBy["Id"] = "id";
    AmpUpdate_OrderBy["PoolId"] = "poolId";
    AmpUpdate_OrderBy["ScheduledTimestamp"] = "scheduledTimestamp";
    AmpUpdate_OrderBy["StartAmp"] = "startAmp";
    AmpUpdate_OrderBy["StartTimestamp"] = "startTimestamp";
})(AmpUpdate_OrderBy || (AmpUpdate_OrderBy = {}));
var BalancerSnapshot_OrderBy;
(function (BalancerSnapshot_OrderBy) {
    BalancerSnapshot_OrderBy["Id"] = "id";
    BalancerSnapshot_OrderBy["PoolCount"] = "poolCount";
    BalancerSnapshot_OrderBy["Timestamp"] = "timestamp";
    BalancerSnapshot_OrderBy["TotalLiquidity"] = "totalLiquidity";
    BalancerSnapshot_OrderBy["TotalSwapCount"] = "totalSwapCount";
    BalancerSnapshot_OrderBy["TotalSwapFee"] = "totalSwapFee";
    BalancerSnapshot_OrderBy["TotalSwapVolume"] = "totalSwapVolume";
    BalancerSnapshot_OrderBy["Vault"] = "vault";
})(BalancerSnapshot_OrderBy || (BalancerSnapshot_OrderBy = {}));
var Balancer_OrderBy;
(function (Balancer_OrderBy) {
    Balancer_OrderBy["Id"] = "id";
    Balancer_OrderBy["PoolCount"] = "poolCount";
    Balancer_OrderBy["Pools"] = "pools";
    Balancer_OrderBy["TotalLiquidity"] = "totalLiquidity";
    Balancer_OrderBy["TotalSwapCount"] = "totalSwapCount";
    Balancer_OrderBy["TotalSwapFee"] = "totalSwapFee";
    Balancer_OrderBy["TotalSwapVolume"] = "totalSwapVolume";
})(Balancer_OrderBy || (Balancer_OrderBy = {}));
var GradualWeightUpdate_OrderBy;
(function (GradualWeightUpdate_OrderBy) {
    GradualWeightUpdate_OrderBy["EndTimestamp"] = "endTimestamp";
    GradualWeightUpdate_OrderBy["EndWeights"] = "endWeights";
    GradualWeightUpdate_OrderBy["Id"] = "id";
    GradualWeightUpdate_OrderBy["PoolId"] = "poolId";
    GradualWeightUpdate_OrderBy["ScheduledTimestamp"] = "scheduledTimestamp";
    GradualWeightUpdate_OrderBy["StartTimestamp"] = "startTimestamp";
    GradualWeightUpdate_OrderBy["StartWeights"] = "startWeights";
})(GradualWeightUpdate_OrderBy || (GradualWeightUpdate_OrderBy = {}));
var InvestType;
(function (InvestType) {
    InvestType["Exit"] = "Exit";
    InvestType["Join"] = "Join";
})(InvestType || (InvestType = {}));
var Investment_OrderBy;
(function (Investment_OrderBy) {
    Investment_OrderBy["Amount"] = "amount";
    Investment_OrderBy["AssetManagerAddress"] = "assetManagerAddress";
    Investment_OrderBy["Id"] = "id";
    Investment_OrderBy["PoolTokenId"] = "poolTokenId";
    Investment_OrderBy["Timestamp"] = "timestamp";
})(Investment_OrderBy || (Investment_OrderBy = {}));
var JoinExit_OrderBy;
(function (JoinExit_OrderBy) {
    JoinExit_OrderBy["Amounts"] = "amounts";
    JoinExit_OrderBy["Id"] = "id";
    JoinExit_OrderBy["Pool"] = "pool";
    JoinExit_OrderBy["Sender"] = "sender";
    JoinExit_OrderBy["Timestamp"] = "timestamp";
    JoinExit_OrderBy["Tx"] = "tx";
    JoinExit_OrderBy["Type"] = "type";
    JoinExit_OrderBy["User"] = "user";
})(JoinExit_OrderBy || (JoinExit_OrderBy = {}));
var LatestPrice_OrderBy;
(function (LatestPrice_OrderBy) {
    LatestPrice_OrderBy["Asset"] = "asset";
    LatestPrice_OrderBy["Block"] = "block";
    LatestPrice_OrderBy["Id"] = "id";
    LatestPrice_OrderBy["PoolId"] = "poolId";
    LatestPrice_OrderBy["Price"] = "price";
    LatestPrice_OrderBy["PricingAsset"] = "pricingAsset";
})(LatestPrice_OrderBy || (LatestPrice_OrderBy = {}));
/** Defines the order direction, either ascending or descending */
var OrderDirection;
(function (OrderDirection) {
    OrderDirection["Asc"] = "asc";
    OrderDirection["Desc"] = "desc";
})(OrderDirection || (OrderDirection = {}));
var PoolHistoricalLiquidity_OrderBy;
(function (PoolHistoricalLiquidity_OrderBy) {
    PoolHistoricalLiquidity_OrderBy["Block"] = "block";
    PoolHistoricalLiquidity_OrderBy["Id"] = "id";
    PoolHistoricalLiquidity_OrderBy["PoolId"] = "poolId";
    PoolHistoricalLiquidity_OrderBy["PoolLiquidity"] = "poolLiquidity";
    PoolHistoricalLiquidity_OrderBy["PoolShareValue"] = "poolShareValue";
    PoolHistoricalLiquidity_OrderBy["PoolTotalShares"] = "poolTotalShares";
    PoolHistoricalLiquidity_OrderBy["PricingAsset"] = "pricingAsset";
})(PoolHistoricalLiquidity_OrderBy || (PoolHistoricalLiquidity_OrderBy = {}));
var PoolShare_OrderBy;
(function (PoolShare_OrderBy) {
    PoolShare_OrderBy["Balance"] = "balance";
    PoolShare_OrderBy["Id"] = "id";
    PoolShare_OrderBy["PoolId"] = "poolId";
    PoolShare_OrderBy["UserAddress"] = "userAddress";
})(PoolShare_OrderBy || (PoolShare_OrderBy = {}));
var PoolSnapshot_OrderBy;
(function (PoolSnapshot_OrderBy) {
    PoolSnapshot_OrderBy["Amounts"] = "amounts";
    PoolSnapshot_OrderBy["Id"] = "id";
    PoolSnapshot_OrderBy["Liquidity"] = "liquidity";
    PoolSnapshot_OrderBy["Pool"] = "pool";
    PoolSnapshot_OrderBy["SwapFees"] = "swapFees";
    PoolSnapshot_OrderBy["SwapVolume"] = "swapVolume";
    PoolSnapshot_OrderBy["Timestamp"] = "timestamp";
    PoolSnapshot_OrderBy["TotalShares"] = "totalShares";
})(PoolSnapshot_OrderBy || (PoolSnapshot_OrderBy = {}));
var PoolToken_OrderBy;
(function (PoolToken_OrderBy) {
    PoolToken_OrderBy["Address"] = "address";
    PoolToken_OrderBy["Balance"] = "balance";
    PoolToken_OrderBy["Decimals"] = "decimals";
    PoolToken_OrderBy["Id"] = "id";
    PoolToken_OrderBy["Invested"] = "invested";
    PoolToken_OrderBy["Investments"] = "investments";
    PoolToken_OrderBy["Name"] = "name";
    PoolToken_OrderBy["PoolId"] = "poolId";
    PoolToken_OrderBy["PriceRate"] = "priceRate";
    PoolToken_OrderBy["Symbol"] = "symbol";
    PoolToken_OrderBy["Token"] = "token";
    PoolToken_OrderBy["Weight"] = "weight";
})(PoolToken_OrderBy || (PoolToken_OrderBy = {}));
var Pool_OrderBy;
(function (Pool_OrderBy) {
    Pool_OrderBy["Address"] = "address";
    Pool_OrderBy["Amp"] = "amp";
    Pool_OrderBy["BaseToken"] = "baseToken";
    Pool_OrderBy["CreateTime"] = "createTime";
    Pool_OrderBy["ExpiryTime"] = "expiryTime";
    Pool_OrderBy["Factory"] = "factory";
    Pool_OrderBy["HistoricalValues"] = "historicalValues";
    Pool_OrderBy["HoldersCount"] = "holdersCount";
    Pool_OrderBy["Id"] = "id";
    Pool_OrderBy["LowerTarget"] = "lowerTarget";
    Pool_OrderBy["MainIndex"] = "mainIndex";
    Pool_OrderBy["ManagementFee"] = "managementFee";
    Pool_OrderBy["Name"] = "name";
    Pool_OrderBy["Owner"] = "owner";
    Pool_OrderBy["PoolType"] = "poolType";
    Pool_OrderBy["PriceRateProviders"] = "priceRateProviders";
    Pool_OrderBy["PrincipalToken"] = "principalToken";
    Pool_OrderBy["Shares"] = "shares";
    Pool_OrderBy["StrategyType"] = "strategyType";
    Pool_OrderBy["SwapEnabled"] = "swapEnabled";
    Pool_OrderBy["SwapFee"] = "swapFee";
    Pool_OrderBy["Swaps"] = "swaps";
    Pool_OrderBy["SwapsCount"] = "swapsCount";
    Pool_OrderBy["Symbol"] = "symbol";
    Pool_OrderBy["Tokens"] = "tokens";
    Pool_OrderBy["TokensList"] = "tokensList";
    Pool_OrderBy["TotalLiquidity"] = "totalLiquidity";
    Pool_OrderBy["TotalShares"] = "totalShares";
    Pool_OrderBy["TotalSwapFee"] = "totalSwapFee";
    Pool_OrderBy["TotalSwapVolume"] = "totalSwapVolume";
    Pool_OrderBy["TotalWeight"] = "totalWeight";
    Pool_OrderBy["Tx"] = "tx";
    Pool_OrderBy["UnitSeconds"] = "unitSeconds";
    Pool_OrderBy["UpperTarget"] = "upperTarget";
    Pool_OrderBy["VaultId"] = "vaultID";
    Pool_OrderBy["WeightUpdates"] = "weightUpdates";
    Pool_OrderBy["WrappedIndex"] = "wrappedIndex";
})(Pool_OrderBy || (Pool_OrderBy = {}));
var PriceRateProvider_OrderBy;
(function (PriceRateProvider_OrderBy) {
    PriceRateProvider_OrderBy["Address"] = "address";
    PriceRateProvider_OrderBy["CacheDuration"] = "cacheDuration";
    PriceRateProvider_OrderBy["CacheExpiry"] = "cacheExpiry";
    PriceRateProvider_OrderBy["Id"] = "id";
    PriceRateProvider_OrderBy["LastCached"] = "lastCached";
    PriceRateProvider_OrderBy["PoolId"] = "poolId";
    PriceRateProvider_OrderBy["Rate"] = "rate";
    PriceRateProvider_OrderBy["Token"] = "token";
})(PriceRateProvider_OrderBy || (PriceRateProvider_OrderBy = {}));
var Swap_OrderBy;
(function (Swap_OrderBy) {
    Swap_OrderBy["Caller"] = "caller";
    Swap_OrderBy["Id"] = "id";
    Swap_OrderBy["PoolId"] = "poolId";
    Swap_OrderBy["Timestamp"] = "timestamp";
    Swap_OrderBy["TokenAmountIn"] = "tokenAmountIn";
    Swap_OrderBy["TokenAmountOut"] = "tokenAmountOut";
    Swap_OrderBy["TokenIn"] = "tokenIn";
    Swap_OrderBy["TokenInSym"] = "tokenInSym";
    Swap_OrderBy["TokenOut"] = "tokenOut";
    Swap_OrderBy["TokenOutSym"] = "tokenOutSym";
    Swap_OrderBy["Tx"] = "tx";
    Swap_OrderBy["UserAddress"] = "userAddress";
})(Swap_OrderBy || (Swap_OrderBy = {}));
var TokenPrice_OrderBy;
(function (TokenPrice_OrderBy) {
    TokenPrice_OrderBy["Amount"] = "amount";
    TokenPrice_OrderBy["Asset"] = "asset";
    TokenPrice_OrderBy["Block"] = "block";
    TokenPrice_OrderBy["Id"] = "id";
    TokenPrice_OrderBy["PoolId"] = "poolId";
    TokenPrice_OrderBy["Price"] = "price";
    TokenPrice_OrderBy["PricingAsset"] = "pricingAsset";
    TokenPrice_OrderBy["Timestamp"] = "timestamp";
})(TokenPrice_OrderBy || (TokenPrice_OrderBy = {}));
var TokenSnapshot_OrderBy;
(function (TokenSnapshot_OrderBy) {
    TokenSnapshot_OrderBy["Id"] = "id";
    TokenSnapshot_OrderBy["Timestamp"] = "timestamp";
    TokenSnapshot_OrderBy["Token"] = "token";
    TokenSnapshot_OrderBy["TotalBalanceNotional"] = "totalBalanceNotional";
    TokenSnapshot_OrderBy["TotalBalanceUsd"] = "totalBalanceUSD";
    TokenSnapshot_OrderBy["TotalSwapCount"] = "totalSwapCount";
    TokenSnapshot_OrderBy["TotalVolumeNotional"] = "totalVolumeNotional";
    TokenSnapshot_OrderBy["TotalVolumeUsd"] = "totalVolumeUSD";
})(TokenSnapshot_OrderBy || (TokenSnapshot_OrderBy = {}));
var Token_OrderBy;
(function (Token_OrderBy) {
    Token_OrderBy["Address"] = "address";
    Token_OrderBy["Decimals"] = "decimals";
    Token_OrderBy["Id"] = "id";
    Token_OrderBy["LatestPrice"] = "latestPrice";
    Token_OrderBy["Name"] = "name";
    Token_OrderBy["Symbol"] = "symbol";
    Token_OrderBy["TotalBalanceNotional"] = "totalBalanceNotional";
    Token_OrderBy["TotalBalanceUsd"] = "totalBalanceUSD";
    Token_OrderBy["TotalSwapCount"] = "totalSwapCount";
    Token_OrderBy["TotalVolumeNotional"] = "totalVolumeNotional";
    Token_OrderBy["TotalVolumeUsd"] = "totalVolumeUSD";
})(Token_OrderBy || (Token_OrderBy = {}));
var TradePairSnapshot_OrderBy;
(function (TradePairSnapshot_OrderBy) {
    TradePairSnapshot_OrderBy["Id"] = "id";
    TradePairSnapshot_OrderBy["Pair"] = "pair";
    TradePairSnapshot_OrderBy["Timestamp"] = "timestamp";
    TradePairSnapshot_OrderBy["TotalSwapFee"] = "totalSwapFee";
    TradePairSnapshot_OrderBy["TotalSwapVolume"] = "totalSwapVolume";
})(TradePairSnapshot_OrderBy || (TradePairSnapshot_OrderBy = {}));
var TradePair_OrderBy;
(function (TradePair_OrderBy) {
    TradePair_OrderBy["Id"] = "id";
    TradePair_OrderBy["Token0"] = "token0";
    TradePair_OrderBy["Token1"] = "token1";
    TradePair_OrderBy["TotalSwapFee"] = "totalSwapFee";
    TradePair_OrderBy["TotalSwapVolume"] = "totalSwapVolume";
})(TradePair_OrderBy || (TradePair_OrderBy = {}));
var UserInternalBalance_OrderBy;
(function (UserInternalBalance_OrderBy) {
    UserInternalBalance_OrderBy["Balance"] = "balance";
    UserInternalBalance_OrderBy["Id"] = "id";
    UserInternalBalance_OrderBy["Token"] = "token";
    UserInternalBalance_OrderBy["UserAddress"] = "userAddress";
})(UserInternalBalance_OrderBy || (UserInternalBalance_OrderBy = {}));
var User_OrderBy;
(function (User_OrderBy) {
    User_OrderBy["Id"] = "id";
    User_OrderBy["SharesOwned"] = "sharesOwned";
    User_OrderBy["Swaps"] = "swaps";
    User_OrderBy["UserInternalBalances"] = "userInternalBalances";
})(User_OrderBy || (User_OrderBy = {}));
var _SubgraphErrorPolicy_;
(function (_SubgraphErrorPolicy_) {
    /** Data will be returned even if the subgraph has indexing errors */
    _SubgraphErrorPolicy_["Allow"] = "allow";
    /** If the subgraph has indexing errors, data will be omitted. The default. */
    _SubgraphErrorPolicy_["Deny"] = "deny";
})(_SubgraphErrorPolicy_ || (_SubgraphErrorPolicy_ = {}));
const SubgraphPoolTokenFragmentDoc = gql$1 `
    fragment SubgraphPoolToken on PoolToken {
  id
  symbol
  name
  decimals
  address
  balance
  invested
  weight
  priceRate
}
    `;
const SubgraphPoolFragmentDoc = gql$1 `
    fragment SubgraphPool on Pool {
  id
  address
  poolType
  symbol
  name
  swapFee
  totalWeight
  totalSwapVolume
  totalSwapFee
  totalLiquidity
  totalShares
  tokens(first: 100) {
    ...SubgraphPoolToken
  }
  swapsCount
  holdersCount
  tokensList
  totalWeight
  amp
  expiryTime
  unitSeconds
  principalToken
  baseToken
  swapEnabled
  wrappedIndex
  mainIndex
  lowerTarget
  upperTarget
  factory
}
    ${SubgraphPoolTokenFragmentDoc}`;
const SubgraphPoolWithoutLinearFragmentDoc = gql$1 `
    fragment SubgraphPoolWithoutLinear on Pool {
  id
  address
  poolType
  symbol
  name
  swapFee
  totalWeight
  totalSwapVolume
  totalSwapFee
  totalLiquidity
  totalShares
  tokens(first: 1000) {
    ...SubgraphPoolToken
  }
  swapsCount
  holdersCount
  tokensList
  totalWeight
  amp
  expiryTime
  unitSeconds
  principalToken
  baseToken
  swapEnabled
}
    ${SubgraphPoolTokenFragmentDoc}`;
const SubgraphPoolSnapshotFragmentDoc = gql$1 `
    fragment SubgraphPoolSnapshot on PoolSnapshot {
  id
  pool {
    id
  }
  totalShares
  swapVolume
  swapFees
  timestamp
}
    `;
const SubgraphJoinExitFragmentDoc = gql$1 `
    fragment SubgraphJoinExit on JoinExit {
  amounts
  id
  sender
  timestamp
  tx
  type
  user {
    id
  }
  pool {
    id
    tokensList
  }
}
    `;
const SubgraphBalancerFragmentDoc = gql$1 `
    fragment SubgraphBalancer on Balancer {
  id
  totalLiquidity
  totalSwapVolume
  totalSwapFee
  totalSwapCount
  poolCount
}
    `;
const SubgraphTokenPriceFragmentDoc = gql$1 `
    fragment SubgraphTokenPrice on TokenPrice {
  id
  poolId {
    id
  }
  asset
  amount
  pricingAsset
  price
  block
  timestamp
}
    `;
const SubgraphTokenLatestPriceFragmentDoc = gql$1 `
    fragment SubgraphTokenLatestPrice on LatestPrice {
  id
  asset
  price
  poolId {
    id
  }
  pricingAsset
}
    `;
const SubgraphUserFragmentDoc = gql$1 `
    fragment SubgraphUser on User {
  id
  sharesOwned(first: 1000) {
    balance
    poolId {
      id
    }
  }
}
    `;
const PoolsDocument = gql$1 `
    query Pools($skip: Int, $first: Int, $orderBy: Pool_orderBy, $orderDirection: OrderDirection, $where: Pool_filter, $block: Block_height) {
  pools(
    skip: $skip
    first: $first
    orderBy: $orderBy
    orderDirection: $orderDirection
    where: $where
    block: $block
  ) {
    ...SubgraphPool
  }
}
    ${SubgraphPoolFragmentDoc}`;
const PoolDocument = gql$1 `
    query Pool($id: ID!, $block: Block_height) {
  pool(id: $id, block: $block) {
    ...SubgraphPool
  }
}
    ${SubgraphPoolFragmentDoc}`;
const PoolsWithoutLinearDocument = gql$1 `
    query PoolsWithoutLinear($skip: Int, $first: Int, $orderBy: Pool_orderBy, $orderDirection: OrderDirection, $where: Pool_filter, $block: Block_height) {
  pools(
    skip: $skip
    first: $first
    orderBy: $orderBy
    orderDirection: $orderDirection
    where: $where
    block: $block
  ) {
    ...SubgraphPoolWithoutLinear
  }
}
    ${SubgraphPoolWithoutLinearFragmentDoc}`;
const PoolWithoutLinearDocument = gql$1 `
    query PoolWithoutLinear($id: ID!, $block: Block_height) {
  pool(id: $id, block: $block) {
    ...SubgraphPoolWithoutLinear
  }
}
    ${SubgraphPoolWithoutLinearFragmentDoc}`;
const PoolHistoricalLiquiditiesDocument = gql$1 `
    query PoolHistoricalLiquidities($skip: Int, $first: Int, $orderBy: PoolHistoricalLiquidity_orderBy, $orderDirection: OrderDirection, $where: PoolHistoricalLiquidity_filter, $block: Block_height) {
  poolHistoricalLiquidities(
    skip: $skip
    first: $first
    orderBy: $orderBy
    orderDirection: $orderDirection
    where: $where
    block: $block
  ) {
    id
    poolId {
      id
    }
    poolTotalShares
    poolLiquidity
    poolShareValue
    pricingAsset
    block
  }
}
    `;
const PoolSnapshotsDocument = gql$1 `
    query PoolSnapshots($skip: Int, $first: Int, $orderBy: PoolSnapshot_orderBy, $orderDirection: OrderDirection, $where: PoolSnapshot_filter, $block: Block_height) {
  poolSnapshots(
    skip: $skip
    first: $first
    orderBy: $orderBy
    orderDirection: $orderDirection
    where: $where
    block: $block
  ) {
    ...SubgraphPoolSnapshot
  }
}
    ${SubgraphPoolSnapshotFragmentDoc}`;
const JoinExitsDocument = gql$1 `
    query JoinExits($skip: Int, $first: Int, $orderBy: JoinExit_orderBy, $orderDirection: OrderDirection, $where: JoinExit_filter, $block: Block_height) {
  joinExits(
    skip: $skip
    first: $first
    orderBy: $orderBy
    orderDirection: $orderDirection
    where: $where
    block: $block
  ) {
    ...SubgraphJoinExit
  }
}
    ${SubgraphJoinExitFragmentDoc}`;
const BalancersDocument = gql$1 `
    query Balancers($skip: Int, $first: Int, $orderBy: Balancer_orderBy, $orderDirection: OrderDirection, $where: Balancer_filter, $block: Block_height) {
  balancers(
    skip: $skip
    first: $first
    orderBy: $orderBy
    orderDirection: $orderDirection
    where: $where
    block: $block
  ) {
    ...SubgraphBalancer
  }
}
    ${SubgraphBalancerFragmentDoc}`;
const TokenPricesDocument = gql$1 `
    query TokenPrices($skip: Int, $first: Int, $orderBy: TokenPrice_orderBy, $orderDirection: OrderDirection, $where: TokenPrice_filter, $block: Block_height) {
  tokenPrices(
    skip: $skip
    first: $first
    orderBy: $orderBy
    orderDirection: $orderDirection
    where: $where
    block: $block
  ) {
    ...SubgraphTokenPrice
  }
}
    ${SubgraphTokenPriceFragmentDoc}`;
const TokenLatestPricesDocument = gql$1 `
    query TokenLatestPrices($skip: Int, $first: Int, $orderBy: LatestPrice_orderBy, $orderDirection: OrderDirection, $where: LatestPrice_filter, $block: Block_height) {
  latestPrices(
    skip: $skip
    first: $first
    orderBy: $orderBy
    orderDirection: $orderDirection
    where: $where
    block: $block
  ) {
    ...SubgraphTokenLatestPrice
  }
}
    ${SubgraphTokenLatestPriceFragmentDoc}`;
const TokenLatestPriceDocument = gql$1 `
    query TokenLatestPrice($id: ID!) {
  latestPrice(id: $id) {
    ...SubgraphTokenLatestPrice
  }
}
    ${SubgraphTokenLatestPriceFragmentDoc}`;
const UserDocument = gql$1 `
    query User($id: ID!, $block: Block_height) {
  user(id: $id, block: $block) {
    ...SubgraphUser
  }
}
    ${SubgraphUserFragmentDoc}`;
const UsersDocument = gql$1 `
    query Users($skip: Int, $first: Int, $orderBy: User_orderBy, $orderDirection: OrderDirection, $where: User_filter, $block: Block_height) {
  users(
    skip: $skip
    first: $first
    orderBy: $orderBy
    orderDirection: $orderDirection
    where: $where
    block: $block
  ) {
    ...SubgraphUser
  }
}
    ${SubgraphUserFragmentDoc}`;
const defaultWrapper = (action, _operationName) => action();
function getSdk(client, withWrapper = defaultWrapper) {
    return {
        Pools(variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders) => client.request(PoolsDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), 'Pools');
        },
        Pool(variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders) => client.request(PoolDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), 'Pool');
        },
        PoolsWithoutLinear(variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders) => client.request(PoolsWithoutLinearDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), 'PoolsWithoutLinear');
        },
        PoolWithoutLinear(variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders) => client.request(PoolWithoutLinearDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), 'PoolWithoutLinear');
        },
        PoolHistoricalLiquidities(variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders) => client.request(PoolHistoricalLiquiditiesDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), 'PoolHistoricalLiquidities');
        },
        PoolSnapshots(variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders) => client.request(PoolSnapshotsDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), 'PoolSnapshots');
        },
        JoinExits(variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders) => client.request(JoinExitsDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), 'JoinExits');
        },
        Balancers(variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders) => client.request(BalancersDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), 'Balancers');
        },
        TokenPrices(variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders) => client.request(TokenPricesDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), 'TokenPrices');
        },
        TokenLatestPrices(variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders) => client.request(TokenLatestPricesDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), 'TokenLatestPrices');
        },
        TokenLatestPrice(variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders) => client.request(TokenLatestPriceDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), 'TokenLatestPrice');
        },
        User(variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders) => client.request(UserDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), 'User');
        },
        Users(variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders) => client.request(UsersDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), 'Users');
        }
    };
}

function createSubgraphClient(subgraphUrl) {
    const client = new graphqlRequest.GraphQLClient(subgraphUrl);
    return getSdk(client);
}

class Multicaller {
    constructor(multiAddress, provider, abi$1, options = {}) {
        this.options = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.calls = [];
        this.paths = [];
        this.multiAddress = multiAddress;
        this.provider = provider;
        this.interface = new abi.Interface(abi$1);
        this.options = options;
    }
    call(path, address, functionName, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params) {
        this.calls.push([address, functionName, params]);
        this.paths.push(path);
        return this;
    }
    async execute(from = {}) {
        const obj = from;
        const results = await this.executeMulticall();
        results.forEach((result, i) => lodash.set(obj, this.paths[i], result.length > 1 ? result : result[0]));
        this.calls = [];
        this.paths = [];
        return obj;
    }
    async executeMulticall() {
        const multi = new contracts.Contract(this.multiAddress, [
            'function aggregate(tuple[](address target, bytes callData) memory calls) public view returns (uint256 blockNumber, bytes[] memory returnData)',
        ], this.provider);
        const [, res] = await multi.aggregate(this.calls.map(([address, functionName, params]) => [
            address,
            this.interface.encodeFunctionData(functionName, params),
        ]), this.options);
        return res.map((result, i) => this.interface.decodeFunctionResult(this.calls[i][1], result));
    }
}

var weightedPoolAbi = [
	{
		inputs: [
			{
				internalType: "contract IVault",
				name: "vault",
				type: "address"
			},
			{
				internalType: "string",
				name: "name",
				type: "string"
			},
			{
				internalType: "string",
				name: "symbol",
				type: "string"
			},
			{
				internalType: "contract IERC20[]",
				name: "tokens",
				type: "address[]"
			},
			{
				internalType: "uint256[]",
				name: "normalizedWeights",
				type: "uint256[]"
			},
			{
				internalType: "uint256",
				name: "swapFeePercentage",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "pauseWindowDuration",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "bufferPeriodDuration",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "owner",
				type: "address"
			}
		],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "Approval",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "bool",
				name: "paused",
				type: "bool"
			}
		],
		name: "PausedStateChanged",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "swapFeePercentage",
				type: "uint256"
			}
		],
		name: "SwapFeePercentageChanged",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "Transfer",
		type: "event"
	},
	{
		inputs: [
		],
		name: "DOMAIN_SEPARATOR",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				internalType: "address",
				name: "spender",
				type: "address"
			}
		],
		name: "allowance",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "approve",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address"
			}
		],
		name: "balanceOf",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "decimals",
		outputs: [
			{
				internalType: "uint8",
				name: "",
				type: "uint8"
			}
		],
		stateMutability: "pure",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "decreaseApproval",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes4",
				name: "selector",
				type: "bytes4"
			}
		],
		name: "getActionId",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getAuthorizer",
		outputs: [
			{
				internalType: "contract IAuthorizer",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getInvariant",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getLastInvariant",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getNormalizedWeights",
		outputs: [
			{
				internalType: "uint256[]",
				name: "",
				type: "uint256[]"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getOwner",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getPausedState",
		outputs: [
			{
				internalType: "bool",
				name: "paused",
				type: "bool"
			},
			{
				internalType: "uint256",
				name: "pauseWindowEndTime",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "bufferPeriodEndTime",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getPoolId",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getRate",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getSwapFeePercentage",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getVault",
		outputs: [
			{
				internalType: "contract IVault",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "increaseApproval",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "name",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			}
		],
		name: "nonces",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "poolId",
				type: "bytes32"
			},
			{
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256[]",
				name: "balances",
				type: "uint256[]"
			},
			{
				internalType: "uint256",
				name: "lastChangeBlock",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "protocolSwapFeePercentage",
				type: "uint256"
			},
			{
				internalType: "bytes",
				name: "userData",
				type: "bytes"
			}
		],
		name: "onExitPool",
		outputs: [
			{
				internalType: "uint256[]",
				name: "",
				type: "uint256[]"
			},
			{
				internalType: "uint256[]",
				name: "",
				type: "uint256[]"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "poolId",
				type: "bytes32"
			},
			{
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256[]",
				name: "balances",
				type: "uint256[]"
			},
			{
				internalType: "uint256",
				name: "lastChangeBlock",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "protocolSwapFeePercentage",
				type: "uint256"
			},
			{
				internalType: "bytes",
				name: "userData",
				type: "bytes"
			}
		],
		name: "onJoinPool",
		outputs: [
			{
				internalType: "uint256[]",
				name: "",
				type: "uint256[]"
			},
			{
				internalType: "uint256[]",
				name: "",
				type: "uint256[]"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "enum IVault.SwapKind",
						name: "kind",
						type: "uint8"
					},
					{
						internalType: "contract IERC20",
						name: "tokenIn",
						type: "address"
					},
					{
						internalType: "contract IERC20",
						name: "tokenOut",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "amount",
						type: "uint256"
					},
					{
						internalType: "bytes32",
						name: "poolId",
						type: "bytes32"
					},
					{
						internalType: "uint256",
						name: "lastChangeBlock",
						type: "uint256"
					},
					{
						internalType: "address",
						name: "from",
						type: "address"
					},
					{
						internalType: "address",
						name: "to",
						type: "address"
					},
					{
						internalType: "bytes",
						name: "userData",
						type: "bytes"
					}
				],
				internalType: "struct IPoolSwapStructs.SwapRequest",
				name: "request",
				type: "tuple"
			},
			{
				internalType: "uint256",
				name: "balanceTokenIn",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "balanceTokenOut",
				type: "uint256"
			}
		],
		name: "onSwap",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			},
			{
				internalType: "uint8",
				name: "v",
				type: "uint8"
			},
			{
				internalType: "bytes32",
				name: "r",
				type: "bytes32"
			},
			{
				internalType: "bytes32",
				name: "s",
				type: "bytes32"
			}
		],
		name: "permit",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "poolId",
				type: "bytes32"
			},
			{
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256[]",
				name: "balances",
				type: "uint256[]"
			},
			{
				internalType: "uint256",
				name: "lastChangeBlock",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "protocolSwapFeePercentage",
				type: "uint256"
			},
			{
				internalType: "bytes",
				name: "userData",
				type: "bytes"
			}
		],
		name: "queryExit",
		outputs: [
			{
				internalType: "uint256",
				name: "bptIn",
				type: "uint256"
			},
			{
				internalType: "uint256[]",
				name: "amountsOut",
				type: "uint256[]"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "poolId",
				type: "bytes32"
			},
			{
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256[]",
				name: "balances",
				type: "uint256[]"
			},
			{
				internalType: "uint256",
				name: "lastChangeBlock",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "protocolSwapFeePercentage",
				type: "uint256"
			},
			{
				internalType: "bytes",
				name: "userData",
				type: "bytes"
			}
		],
		name: "queryJoin",
		outputs: [
			{
				internalType: "uint256",
				name: "bptOut",
				type: "uint256"
			},
			{
				internalType: "uint256[]",
				name: "amountsIn",
				type: "uint256[]"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bool",
				name: "paused",
				type: "bool"
			}
		],
		name: "setPaused",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "swapFeePercentage",
				type: "uint256"
			}
		],
		name: "setSwapFeePercentage",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "symbol",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "totalSupply",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "transfer",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "transferFrom",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	}
];

var stablePoolAbi = [
	{
		inputs: [
			{
				internalType: "contract IVault",
				name: "vault",
				type: "address"
			},
			{
				internalType: "string",
				name: "name",
				type: "string"
			},
			{
				internalType: "string",
				name: "symbol",
				type: "string"
			},
			{
				internalType: "contract IERC20[]",
				name: "tokens",
				type: "address[]"
			},
			{
				internalType: "uint256",
				name: "amplificationParameter",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "swapFeePercentage",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "pauseWindowDuration",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "bufferPeriodDuration",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "owner",
				type: "address"
			}
		],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "startValue",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "endValue",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "startTime",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "endTime",
				type: "uint256"
			}
		],
		name: "AmpUpdateStarted",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "currentValue",
				type: "uint256"
			}
		],
		name: "AmpUpdateStopped",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "Approval",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "bool",
				name: "paused",
				type: "bool"
			}
		],
		name: "PausedStateChanged",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "swapFeePercentage",
				type: "uint256"
			}
		],
		name: "SwapFeePercentageChanged",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "Transfer",
		type: "event"
	},
	{
		inputs: [
		],
		name: "DOMAIN_SEPARATOR",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				internalType: "address",
				name: "spender",
				type: "address"
			}
		],
		name: "allowance",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "approve",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address"
			}
		],
		name: "balanceOf",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "decimals",
		outputs: [
			{
				internalType: "uint8",
				name: "",
				type: "uint8"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "decreaseAllowance",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes4",
				name: "selector",
				type: "bytes4"
			}
		],
		name: "getActionId",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getAmplificationParameter",
		outputs: [
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			},
			{
				internalType: "bool",
				name: "isUpdating",
				type: "bool"
			},
			{
				internalType: "uint256",
				name: "precision",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getAuthorizer",
		outputs: [
			{
				internalType: "contract IAuthorizer",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getOwner",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getPausedState",
		outputs: [
			{
				internalType: "bool",
				name: "paused",
				type: "bool"
			},
			{
				internalType: "uint256",
				name: "pauseWindowEndTime",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "bufferPeriodEndTime",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getPoolId",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getRate",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getSwapFeePercentage",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getVault",
		outputs: [
			{
				internalType: "contract IVault",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "addedValue",
				type: "uint256"
			}
		],
		name: "increaseAllowance",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "name",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			}
		],
		name: "nonces",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "poolId",
				type: "bytes32"
			},
			{
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256[]",
				name: "balances",
				type: "uint256[]"
			},
			{
				internalType: "uint256",
				name: "lastChangeBlock",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "protocolSwapFeePercentage",
				type: "uint256"
			},
			{
				internalType: "bytes",
				name: "userData",
				type: "bytes"
			}
		],
		name: "onExitPool",
		outputs: [
			{
				internalType: "uint256[]",
				name: "",
				type: "uint256[]"
			},
			{
				internalType: "uint256[]",
				name: "",
				type: "uint256[]"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "poolId",
				type: "bytes32"
			},
			{
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256[]",
				name: "balances",
				type: "uint256[]"
			},
			{
				internalType: "uint256",
				name: "lastChangeBlock",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "protocolSwapFeePercentage",
				type: "uint256"
			},
			{
				internalType: "bytes",
				name: "userData",
				type: "bytes"
			}
		],
		name: "onJoinPool",
		outputs: [
			{
				internalType: "uint256[]",
				name: "",
				type: "uint256[]"
			},
			{
				internalType: "uint256[]",
				name: "",
				type: "uint256[]"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "enum IVault.SwapKind",
						name: "kind",
						type: "uint8"
					},
					{
						internalType: "contract IERC20",
						name: "tokenIn",
						type: "address"
					},
					{
						internalType: "contract IERC20",
						name: "tokenOut",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "amount",
						type: "uint256"
					},
					{
						internalType: "bytes32",
						name: "poolId",
						type: "bytes32"
					},
					{
						internalType: "uint256",
						name: "lastChangeBlock",
						type: "uint256"
					},
					{
						internalType: "address",
						name: "from",
						type: "address"
					},
					{
						internalType: "address",
						name: "to",
						type: "address"
					},
					{
						internalType: "bytes",
						name: "userData",
						type: "bytes"
					}
				],
				internalType: "struct IPoolSwapStructs.SwapRequest",
				name: "swapRequest",
				type: "tuple"
			},
			{
				internalType: "uint256[]",
				name: "balances",
				type: "uint256[]"
			},
			{
				internalType: "uint256",
				name: "indexIn",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "indexOut",
				type: "uint256"
			}
		],
		name: "onSwap",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "enum IVault.SwapKind",
						name: "kind",
						type: "uint8"
					},
					{
						internalType: "contract IERC20",
						name: "tokenIn",
						type: "address"
					},
					{
						internalType: "contract IERC20",
						name: "tokenOut",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "amount",
						type: "uint256"
					},
					{
						internalType: "bytes32",
						name: "poolId",
						type: "bytes32"
					},
					{
						internalType: "uint256",
						name: "lastChangeBlock",
						type: "uint256"
					},
					{
						internalType: "address",
						name: "from",
						type: "address"
					},
					{
						internalType: "address",
						name: "to",
						type: "address"
					},
					{
						internalType: "bytes",
						name: "userData",
						type: "bytes"
					}
				],
				internalType: "struct IPoolSwapStructs.SwapRequest",
				name: "request",
				type: "tuple"
			},
			{
				internalType: "uint256",
				name: "balanceTokenIn",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "balanceTokenOut",
				type: "uint256"
			}
		],
		name: "onSwap",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			},
			{
				internalType: "uint8",
				name: "v",
				type: "uint8"
			},
			{
				internalType: "bytes32",
				name: "r",
				type: "bytes32"
			},
			{
				internalType: "bytes32",
				name: "s",
				type: "bytes32"
			}
		],
		name: "permit",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "poolId",
				type: "bytes32"
			},
			{
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256[]",
				name: "balances",
				type: "uint256[]"
			},
			{
				internalType: "uint256",
				name: "lastChangeBlock",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "protocolSwapFeePercentage",
				type: "uint256"
			},
			{
				internalType: "bytes",
				name: "userData",
				type: "bytes"
			}
		],
		name: "queryExit",
		outputs: [
			{
				internalType: "uint256",
				name: "bptIn",
				type: "uint256"
			},
			{
				internalType: "uint256[]",
				name: "amountsOut",
				type: "uint256[]"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "poolId",
				type: "bytes32"
			},
			{
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256[]",
				name: "balances",
				type: "uint256[]"
			},
			{
				internalType: "uint256",
				name: "lastChangeBlock",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "protocolSwapFeePercentage",
				type: "uint256"
			},
			{
				internalType: "bytes",
				name: "userData",
				type: "bytes"
			}
		],
		name: "queryJoin",
		outputs: [
			{
				internalType: "uint256",
				name: "bptOut",
				type: "uint256"
			},
			{
				internalType: "uint256[]",
				name: "amountsIn",
				type: "uint256[]"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "contract IERC20",
				name: "token",
				type: "address"
			},
			{
				internalType: "bytes",
				name: "poolConfig",
				type: "bytes"
			}
		],
		name: "setAssetManagerPoolConfig",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bool",
				name: "paused",
				type: "bool"
			}
		],
		name: "setPaused",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "swapFeePercentage",
				type: "uint256"
			}
		],
		name: "setSwapFeePercentage",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "rawEndValue",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "endTime",
				type: "uint256"
			}
		],
		name: "startAmplificationParameterUpdate",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "stopAmplificationParameterUpdate",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "symbol",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "totalSupply",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "transfer",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "transferFrom",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	}
];

var elementPoolAbi = [
	{
		inputs: [
			{
				internalType: "contract IERC20",
				name: "_underlying",
				type: "address"
			},
			{
				internalType: "contract IERC20",
				name: "_bond",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "_expiration",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "_unitSeconds",
				type: "uint256"
			},
			{
				internalType: "contract IVault",
				name: "vault",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "_percentFee",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "_percentFeeGov",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "_governance",
				type: "address"
			},
			{
				internalType: "string",
				name: "name",
				type: "string"
			},
			{
				internalType: "string",
				name: "symbol",
				type: "string"
			}
		],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "Approval",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "collectedBase",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "collectedBond",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "remainingBase",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "remainingBond",
				type: "uint256"
			}
		],
		name: "FeeCollection",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "Transfer",
		type: "event"
	},
	{
		inputs: [
		],
		name: "DOMAIN_SEPARATOR",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "FEE_BOUND",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				internalType: "address",
				name: "spender",
				type: "address"
			}
		],
		name: "allowance",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "approve",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address"
			}
		],
		name: "balanceOf",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "bond",
		outputs: [
			{
				internalType: "contract IERC20",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "bondDecimals",
		outputs: [
			{
				internalType: "uint8",
				name: "",
				type: "uint8"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "decimals",
		outputs: [
			{
				internalType: "uint8",
				name: "",
				type: "uint8"
			}
		],
		stateMutability: "pure",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "decreaseApproval",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "expiration",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "feesBond",
		outputs: [
			{
				internalType: "uint128",
				name: "",
				type: "uint128"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "feesUnderlying",
		outputs: [
			{
				internalType: "uint128",
				name: "",
				type: "uint128"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getPoolId",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getVault",
		outputs: [
			{
				internalType: "contract IVault",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "governance",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "increaseApproval",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "name",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			}
		],
		name: "nonces",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "poolId",
				type: "bytes32"
			},
			{
				internalType: "address",
				name: "",
				type: "address"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256[]",
				name: "currentBalances",
				type: "uint256[]"
			},
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "protocolSwapFee",
				type: "uint256"
			},
			{
				internalType: "bytes",
				name: "userData",
				type: "bytes"
			}
		],
		name: "onExitPool",
		outputs: [
			{
				internalType: "uint256[]",
				name: "amountsOut",
				type: "uint256[]"
			},
			{
				internalType: "uint256[]",
				name: "dueProtocolFeeAmounts",
				type: "uint256[]"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "poolId",
				type: "bytes32"
			},
			{
				internalType: "address",
				name: "",
				type: "address"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256[]",
				name: "currentBalances",
				type: "uint256[]"
			},
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "protocolSwapFee",
				type: "uint256"
			},
			{
				internalType: "bytes",
				name: "userData",
				type: "bytes"
			}
		],
		name: "onJoinPool",
		outputs: [
			{
				internalType: "uint256[]",
				name: "amountsIn",
				type: "uint256[]"
			},
			{
				internalType: "uint256[]",
				name: "dueProtocolFeeAmounts",
				type: "uint256[]"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "enum IVault.SwapKind",
						name: "kind",
						type: "uint8"
					},
					{
						internalType: "contract IERC20",
						name: "tokenIn",
						type: "address"
					},
					{
						internalType: "contract IERC20",
						name: "tokenOut",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "amount",
						type: "uint256"
					},
					{
						internalType: "bytes32",
						name: "poolId",
						type: "bytes32"
					},
					{
						internalType: "uint256",
						name: "lastChangeBlock",
						type: "uint256"
					},
					{
						internalType: "address",
						name: "from",
						type: "address"
					},
					{
						internalType: "address",
						name: "to",
						type: "address"
					},
					{
						internalType: "bytes",
						name: "userData",
						type: "bytes"
					}
				],
				internalType: "struct IPoolSwapStructs.SwapRequest",
				name: "swapRequest",
				type: "tuple"
			},
			{
				internalType: "uint256",
				name: "currentBalanceTokenIn",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "currentBalanceTokenOut",
				type: "uint256"
			}
		],
		name: "onSwap",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "percentFee",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "percentFeeGov",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			},
			{
				internalType: "uint8",
				name: "v",
				type: "uint8"
			},
			{
				internalType: "bytes32",
				name: "r",
				type: "bytes32"
			},
			{
				internalType: "bytes32",
				name: "s",
				type: "bytes32"
			}
		],
		name: "permit",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountX",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "reserveX",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "reserveY",
				type: "uint256"
			},
			{
				internalType: "bool",
				name: "out",
				type: "bool"
			}
		],
		name: "solveTradeInvariant",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "symbol",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "totalSupply",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "transfer",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "transferFrom",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "underlying",
		outputs: [
			{
				internalType: "contract IERC20",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "underlyingDecimals",
		outputs: [
			{
				internalType: "uint8",
				name: "",
				type: "uint8"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "unitSeconds",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	}
];

var linearPoolAbi = [
	{
		inputs: [
			{
				internalType: "contract IVault",
				name: "vault",
				type: "address"
			},
			{
				internalType: "string",
				name: "name",
				type: "string"
			},
			{
				internalType: "string",
				name: "symbol",
				type: "string"
			},
			{
				internalType: "contract IERC20",
				name: "mainToken",
				type: "address"
			},
			{
				internalType: "contract IERC20",
				name: "wrappedToken",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "upperTarget",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "swapFeePercentage",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "pauseWindowDuration",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "bufferPeriodDuration",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "owner",
				type: "address"
			}
		],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "Approval",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "bool",
				name: "paused",
				type: "bool"
			}
		],
		name: "PausedStateChanged",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "swapFeePercentage",
				type: "uint256"
			}
		],
		name: "SwapFeePercentageChanged",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "contract IERC20",
				name: "token",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "lowerTarget",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "upperTarget",
				type: "uint256"
			}
		],
		name: "TargetsSet",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "Transfer",
		type: "event"
	},
	{
		inputs: [
		],
		name: "DOMAIN_SEPARATOR",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				internalType: "address",
				name: "spender",
				type: "address"
			}
		],
		name: "allowance",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "approve",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address"
			}
		],
		name: "balanceOf",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "decimals",
		outputs: [
			{
				internalType: "uint8",
				name: "",
				type: "uint8"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "decreaseAllowance",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes4",
				name: "selector",
				type: "bytes4"
			}
		],
		name: "getActionId",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getAuthorizer",
		outputs: [
			{
				internalType: "contract IAuthorizer",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getBptIndex",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getMainIndex",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getMainToken",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getOwner",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getPausedState",
		outputs: [
			{
				internalType: "bool",
				name: "paused",
				type: "bool"
			},
			{
				internalType: "uint256",
				name: "pauseWindowEndTime",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "bufferPeriodEndTime",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getPoolId",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getRate",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getScalingFactors",
		outputs: [
			{
				internalType: "uint256[]",
				name: "",
				type: "uint256[]"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getSwapFeePercentage",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getTargets",
		outputs: [
			{
				internalType: "uint256",
				name: "lowerTarget",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "upperTarget",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getVault",
		outputs: [
			{
				internalType: "contract IVault",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getVirtualSupply",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getWrappedIndex",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getWrappedToken",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getWrappedTokenRate",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "addedValue",
				type: "uint256"
			}
		],
		name: "increaseAllowance",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "initialize",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "name",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			}
		],
		name: "nonces",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "poolId",
				type: "bytes32"
			},
			{
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256[]",
				name: "balances",
				type: "uint256[]"
			},
			{
				internalType: "uint256",
				name: "lastChangeBlock",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "protocolSwapFeePercentage",
				type: "uint256"
			},
			{
				internalType: "bytes",
				name: "userData",
				type: "bytes"
			}
		],
		name: "onExitPool",
		outputs: [
			{
				internalType: "uint256[]",
				name: "",
				type: "uint256[]"
			},
			{
				internalType: "uint256[]",
				name: "",
				type: "uint256[]"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "poolId",
				type: "bytes32"
			},
			{
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256[]",
				name: "balances",
				type: "uint256[]"
			},
			{
				internalType: "uint256",
				name: "lastChangeBlock",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "protocolSwapFeePercentage",
				type: "uint256"
			},
			{
				internalType: "bytes",
				name: "userData",
				type: "bytes"
			}
		],
		name: "onJoinPool",
		outputs: [
			{
				internalType: "uint256[]",
				name: "",
				type: "uint256[]"
			},
			{
				internalType: "uint256[]",
				name: "",
				type: "uint256[]"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "enum IVault.SwapKind",
						name: "kind",
						type: "uint8"
					},
					{
						internalType: "contract IERC20",
						name: "tokenIn",
						type: "address"
					},
					{
						internalType: "contract IERC20",
						name: "tokenOut",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "amount",
						type: "uint256"
					},
					{
						internalType: "bytes32",
						name: "poolId",
						type: "bytes32"
					},
					{
						internalType: "uint256",
						name: "lastChangeBlock",
						type: "uint256"
					},
					{
						internalType: "address",
						name: "from",
						type: "address"
					},
					{
						internalType: "address",
						name: "to",
						type: "address"
					},
					{
						internalType: "bytes",
						name: "userData",
						type: "bytes"
					}
				],
				internalType: "struct IPoolSwapStructs.SwapRequest",
				name: "request",
				type: "tuple"
			},
			{
				internalType: "uint256[]",
				name: "balances",
				type: "uint256[]"
			},
			{
				internalType: "uint256",
				name: "indexIn",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "indexOut",
				type: "uint256"
			}
		],
		name: "onSwap",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			},
			{
				internalType: "uint8",
				name: "v",
				type: "uint8"
			},
			{
				internalType: "bytes32",
				name: "r",
				type: "bytes32"
			},
			{
				internalType: "bytes32",
				name: "s",
				type: "bytes32"
			}
		],
		name: "permit",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "poolId",
				type: "bytes32"
			},
			{
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256[]",
				name: "balances",
				type: "uint256[]"
			},
			{
				internalType: "uint256",
				name: "lastChangeBlock",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "protocolSwapFeePercentage",
				type: "uint256"
			},
			{
				internalType: "bytes",
				name: "userData",
				type: "bytes"
			}
		],
		name: "queryExit",
		outputs: [
			{
				internalType: "uint256",
				name: "bptIn",
				type: "uint256"
			},
			{
				internalType: "uint256[]",
				name: "amountsOut",
				type: "uint256[]"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "poolId",
				type: "bytes32"
			},
			{
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256[]",
				name: "balances",
				type: "uint256[]"
			},
			{
				internalType: "uint256",
				name: "lastChangeBlock",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "protocolSwapFeePercentage",
				type: "uint256"
			},
			{
				internalType: "bytes",
				name: "userData",
				type: "bytes"
			}
		],
		name: "queryJoin",
		outputs: [
			{
				internalType: "uint256",
				name: "bptOut",
				type: "uint256"
			},
			{
				internalType: "uint256[]",
				name: "amountsIn",
				type: "uint256[]"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "contract IERC20",
				name: "token",
				type: "address"
			},
			{
				internalType: "bytes",
				name: "poolConfig",
				type: "bytes"
			}
		],
		name: "setAssetManagerPoolConfig",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bool",
				name: "paused",
				type: "bool"
			}
		],
		name: "setPaused",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "swapFeePercentage",
				type: "uint256"
			}
		],
		name: "setSwapFeePercentage",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "newLowerTarget",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "newUpperTarget",
				type: "uint256"
			}
		],
		name: "setTargets",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "symbol",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "totalSupply",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "transfer",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "transferFrom",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	}
];

async function getOnChainBalances(subgraphPoolsOriginal, multiAddress, vaultAddress, provider) {
    if (subgraphPoolsOriginal.length === 0)
        return subgraphPoolsOriginal;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const abis = Object.values(
    // Remove duplicate entries using their names
    Object.fromEntries([
        ...vaultAbi,
        ...aTokenRateProvider,
        ...weightedPoolAbi,
        ...stablePoolAbi,
        ...elementPoolAbi,
        ...linearPoolAbi,
    ].map((row) => [row.name, row])));
    const multiPool = new Multicaller(multiAddress, provider, abis);
    const supportedPoolTypes = Object.values(sor.PoolFilter);
    const subgraphPools = [];
    subgraphPoolsOriginal.forEach((pool) => {
        if (!supportedPoolTypes.includes(pool.poolType)) {
            console.error(`Unknown pool type: ${pool.poolType} ${pool.id}`);
            return;
        }
        subgraphPools.push(pool);
        multiPool.call(`${pool.id}.poolTokens`, vaultAddress, 'getPoolTokens', [
            pool.id,
        ]);
        multiPool.call(`${pool.id}.totalSupply`, pool.address, 'totalSupply');
        // TO DO - Make this part of class to make more flexible?
        if (pool.poolType === 'Weighted' ||
            pool.poolType === 'LiquidityBootstrapping' ||
            pool.poolType === 'Investment') {
            multiPool.call(`${pool.id}.weights`, pool.address, 'getNormalizedWeights');
            multiPool.call(`${pool.id}.swapFee`, pool.address, 'getSwapFeePercentage');
        }
        else if (pool.poolType === 'Stable' ||
            pool.poolType === 'MetaStable' ||
            pool.poolType === 'StablePhantom') {
            // MetaStable & StablePhantom is the same as Stable for multicall purposes
            multiPool.call(`${pool.id}.amp`, pool.address, 'getAmplificationParameter');
            multiPool.call(`${pool.id}.swapFee`, pool.address, 'getSwapFeePercentage');
        }
        else if (pool.poolType === 'Element') {
            multiPool.call(`${pool.id}.swapFee`, pool.address, 'percentFee');
        }
        else if (pool.poolType === 'AaveLinear') {
            multiPool.call(`${pool.id}.swapFee`, pool.address, 'getSwapFeePercentage');
            multiPool.call(`${pool.id}.targets`, pool.address, 'getTargets');
            multiPool.call(`${pool.id}.rate`, pool.address, 'getWrappedTokenRate');
        }
    });
    let pools = {};
    try {
        pools = (await multiPool.execute());
    }
    catch (err) {
        throw `Issue with multicall execution.`;
    }
    const onChainPools = [];
    Object.entries(pools).forEach(([poolId, onchainData], index) => {
        try {
            const { poolTokens, swapFee, weights } = onchainData;
            if (subgraphPools[index].poolType === 'Stable' ||
                subgraphPools[index].poolType === 'MetaStable' ||
                subgraphPools[index].poolType === 'StablePhantom') {
                if (!onchainData.amp) {
                    console.error(`Stable Pool Missing Amp: ${poolId}`);
                    return;
                }
                else {
                    // Need to scale amp by precision to match expected Subgraph scale
                    // amp is stored with 3 decimals of precision
                    subgraphPools[index].amp = bignumber.formatFixed(onchainData.amp[0], 3);
                }
            }
            if (subgraphPools[index].poolType === 'AaveLinear') {
                if (!onchainData.targets) {
                    console.error(`Linear Pool Missing Targets: ${poolId}`);
                    return;
                }
                else {
                    subgraphPools[index].lowerTarget = bignumber.formatFixed(onchainData.targets[0], 18);
                    subgraphPools[index].upperTarget = bignumber.formatFixed(onchainData.targets[1], 18);
                }
                const wrappedIndex = subgraphPools[index].wrappedIndex;
                if (wrappedIndex === undefined ||
                    onchainData.rate === undefined) {
                    console.error(`Linear Pool Missing WrappedIndex or PriceRate: ${poolId}`);
                    return;
                }
                // Update priceRate of wrappedToken
                subgraphPools[index].tokens[wrappedIndex].priceRate =
                    bignumber.formatFixed(onchainData.rate, 18);
            }
            subgraphPools[index].swapFee = bignumber.formatFixed(swapFee, 18);
            poolTokens.tokens.forEach((token, i) => {
                const T = subgraphPools[index].tokens.find((t) => isSameAddress(t.address, token));
                if (!T)
                    throw `Pool Missing Expected Token: ${poolId} ${token}`;
                T.balance = bignumber.formatFixed(poolTokens.balances[i], T.decimals);
                if (weights) {
                    // Only expected for WeightedPools
                    T.weight = bignumber.formatFixed(weights[i], 18);
                }
            });
            onChainPools.push(subgraphPools[index]);
        }
        catch (err) {
            throw `Issue with pool onchain data: ${err}`;
        }
    });
    return onChainPools;
}

const NETWORKS_WITH_LINEAR_POOLS = [
    exports.Network.MAINNET,
    exports.Network.ROPSTEN,
    exports.Network.RINKEBY,
    exports.Network.GÖRLI,
    exports.Network.KOVAN,
    43114,
];
class SubgraphPoolDataService {
    constructor(client, provider, network, sorConfig) {
        this.client = client;
        this.provider = provider;
        this.network = network;
        this.sorConfig = sorConfig;
    }
    async getPools() {
        const pools = this.supportsLinearPools
            ? await this.getLinearPools()
            : await this.getNonLinearPools();
        const mapped = pools.map((pool) => ({
            ...pool,
            poolType: pool.poolType || '',
            tokens: (pool.tokens || []).map((token) => ({
                ...token,
                weight: token.weight || null,
            })),
            totalWeight: pool.totalWeight || undefined,
            amp: pool.amp || undefined,
            expiryTime: pool.expiryTime ? lodash.parseInt(pool.expiryTime) : undefined,
            unitSeconds: pool.unitSeconds
                ? lodash.parseInt(pool.unitSeconds)
                : undefined,
            principalToken: pool.principalToken || undefined,
            baseToken: pool.baseToken || undefined,
        }));
        if (this.sorConfig.fetchOnChainBalances === false) {
            return mapped;
        }
        return getOnChainBalances(mapped, this.network.addresses.contracts.multicall, this.network.addresses.contracts.vault, this.provider);
    }
    get supportsLinearPools() {
        return NETWORKS_WITH_LINEAR_POOLS.includes(this.network.chainId);
    }
    async getLinearPools() {
        const { pools } = await this.client.Pools({
            where: { swapEnabled: true },
            orderBy: Pool_OrderBy.TotalLiquidity,
            orderDirection: OrderDirection.Desc,
            first: 1000,
        });
        return pools;
    }
    async getNonLinearPools() {
        const { pools } = await this.client.PoolsWithoutLinear({
            where: { swapEnabled: true },
            orderBy: Pool_OrderBy.TotalLiquidity,
            orderDirection: OrderDirection.Desc,
            first: 1000,
        });
        return pools;
    }
}

class CoingeckoTokenPriceService {
    constructor(chainId) {
        this.chainId = chainId;
    }
    async getNativeAssetPriceInToken(tokenAddress) {
        const ethPerToken = await this.getTokenPriceInNativeAsset(tokenAddress);
        // We get the price of token in terms of ETH
        // We want the price of 1 ETH in terms of the token base units
        return `${1 / parseFloat(ethPerToken)}`;
    }
    /**
     * @dev Assumes that the native asset has 18 decimals
     * @param tokenAddress - the address of the token contract
     * @returns the price of 1 ETH in terms of the token base units
     */
    async getTokenPriceInNativeAsset(tokenAddress) {
        const endpoint = `https://api.coingecko.com/api/v3/simple/token_price/${this.platformId}?contract_addresses=${tokenAddress}&vs_currencies=${this.nativeAssetId}`;
        const { data } = await axios__default["default"].get(endpoint, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        if (data[tokenAddress.toLowerCase()][this.nativeAssetId] === undefined) {
            throw Error('No price returned from Coingecko');
        }
        return data[tokenAddress.toLowerCase()][this.nativeAssetId];
    }
    get platformId() {
        switch (this.chainId) {
            case 1:
                return 'ethereum';
            case 42:
                return 'ethereum';
            case 137:
                return 'polygon-pos';
            case 42161:
                return 'arbitrum-one';
        }
        return '2';
    }
    get nativeAssetId() {
        switch (this.chainId) {
            case 1:
                return 'eth';
            case 42:
                return 'eth';
            case 137:
                return '';
            case 42161:
                return 'eth';
        }
        return '';
    }
}

class SubgraphTokenPriceService {
    constructor(client, weth) {
        this.client = client;
        //the subgraph addresses are all toLowerCase
        this.weth = weth.toLowerCase();
    }
    async getNativeAssetPriceInToken(tokenAddress) {
        const ethPerToken = await this.getLatestPriceInEthFromSubgraph(tokenAddress);
        if (!ethPerToken) {
            throw Error('No price found in the subgraph');
        }
        // We want the price of 1 ETH in terms of the token base units
        return `${1 / ethPerToken}`;
    }
    async getLatestPriceInEthFromSubgraph(tokenAddress) {
        tokenAddress = tokenAddress.toLowerCase();
        const { latestPrices } = await this.client.TokenLatestPrices({
            where: { asset_in: [tokenAddress, this.weth] },
        });
        const pricesKeyedOnId = lodash.keyBy(latestPrices, 'id');
        //the ids are set as ${asset}-${pricingAsset}
        //first try to find an exact match
        if (pricesKeyedOnId[`${tokenAddress}-${this.weth}`]) {
            return parseFloat(pricesKeyedOnId[`${tokenAddress}-${this.weth}`].price);
        }
        //no exact match, try to traverse the path
        const matchingLatestPrices = latestPrices.filter((price) => price.asset === tokenAddress);
        //pick the first one we match on.
        //There is no timestamp on latestPrice, should get introduced to allow for sorting by latest
        for (const tokenPrice of matchingLatestPrices) {
            const pricingAssetPricedInEth = pricesKeyedOnId[`${tokenPrice.pricingAsset}-${this.weth}`];
            //1 BAL = 20 USDC, 1 USDC = 0.00025 ETH, 1 BAL = 20 * 0.00025
            if (pricingAssetPricedInEth) {
                return (parseFloat(tokenPrice.price) *
                    parseFloat(pricingAssetPricedInEth.price));
            }
        }
        return null;
    }
}

function getNetworkConfig(config) {
    var _a, _b;
    if (typeof config.network === 'number') {
        const networkConfig = BALANCER_NETWORK_CONFIG[config.network];
        return {
            ...networkConfig,
            urls: {
                ...networkConfig.urls,
                subgraph: (_a = config.customSubgraphUrl) !== null && _a !== void 0 ? _a : networkConfig.urls.subgraph,
            },
        };
    }
    return {
        ...config.network,
        urls: {
            ...config.network.urls,
            subgraph: (_b = config.customSubgraphUrl) !== null && _b !== void 0 ? _b : config.network.urls.subgraph,
        },
    };
}

class Sor extends sor.SOR {
    constructor(sdkConfig) {
        const network = getNetworkConfig(sdkConfig);
        const sorConfig = Sor.getSorConfig(sdkConfig);
        const sorNetworkConfig = Sor.getSorNetworkConfig(network);
        const provider = new providers.JsonRpcProvider(sdkConfig.rpcUrl);
        const subgraphClient = createSubgraphClient(network.urls.subgraph);
        const poolDataService = Sor.getPoolDataService(network, sorConfig, provider, subgraphClient);
        const tokenPriceService = Sor.getTokenPriceService(network, sorConfig, subgraphClient);
        super(provider, sorNetworkConfig, poolDataService, tokenPriceService);
    }
    static getSorConfig(config) {
        return {
            tokenPriceService: 'coingecko',
            poolDataService: 'subgraph',
            fetchOnChainBalances: true,
            ...config.sor,
        };
    }
    static getSorNetworkConfig(network) {
        var _a, _b;
        return {
            ...network,
            vault: network.addresses.contracts.vault,
            weth: network.addresses.tokens.wrappedNativeAsset,
            staBal3Pool: (_a = network.pools) === null || _a === void 0 ? void 0 : _a.staBal3Pool,
            wethStaBal3: (_b = network.pools) === null || _b === void 0 ? void 0 : _b.wethStaBal3,
        };
    }
    static getPoolDataService(network, sorConfig, provider, subgraphClient) {
        return typeof sorConfig.poolDataService === 'object'
            ? sorConfig.poolDataService
            : new SubgraphPoolDataService(subgraphClient, provider, network, sorConfig);
    }
    static getTokenPriceService(network, sorConfig, subgraphClient) {
        if (typeof sorConfig.tokenPriceService === 'object') {
            return sorConfig.tokenPriceService;
        }
        else if (sorConfig.tokenPriceService === 'subgraph') {
            new SubgraphTokenPriceService(subgraphClient, network.addresses.tokens.wrappedNativeAsset);
        }
        return new CoingeckoTokenPriceService(network.chainId);
    }
}

class Swaps {
    constructor(sorOrConfig) {
        if (sorOrConfig instanceof sor.SOR) {
            this.sor = sorOrConfig;
        }
        else {
            this.sor = new Sor(sorOrConfig);
        }
    }
    static getLimitsForSlippage(tokensIn, tokensOut, swapType, deltas, assets, slippage) {
        // TO DO - Check best way to do this?
        const limits = getLimitsForSlippage(tokensIn, tokensOut, swapType, deltas, assets, slippage);
        return limits.map((l) => l.toString());
    }
    /**
     * fetchPools saves updated pools data to SOR internal onChainBalanceCache.
     * @param {SubgraphPoolBase[]} [poolsData=[]] If poolsData passed uses this as pools source otherwise fetches from config.subgraphUrl.
     * @param {boolean} [isOnChain=true] If isOnChain is true will retrieve all required onChain data via multicall otherwise uses subgraph values.
     * @returns {boolean} Boolean indicating whether pools data was fetched correctly (true) or not (false).
     */
    async fetchPools() {
        return this.sor.fetchPools();
    }
    getPools() {
        return this.sor.getPools();
    }
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
    async queryBatchSwap(batchSwap) {
        // TO DO - Pull in a ContractsService and use this to pass Vault to queryBatchSwap.
        const vaultContract = new contracts.Contract(balancerVault, vaultAbi, this.sor.provider);
        return await queryBatchSwap(vaultContract, batchSwap.kind, batchSwap.swaps, batchSwap.assets);
    }
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
    async queryBatchSwapWithSor(queryWithSor) {
        // TO DO - Pull in a ContractsService and use this to pass Vault to queryBatchSwap.
        const vaultContract = new contracts.Contract(balancerVault, vaultAbi, this.sor.provider);
        return await queryBatchSwapWithSor(this.sor, vaultContract, queryWithSor);
    }
}

var booMirrorWorldStakingAbi = [
	{
		inputs: [
			{
				internalType: "contract IERC20",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "approveVault",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "outputReference",
				type: "uint256"
			}
		],
		name: "booMirrorWorldEnter",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "outputReference",
				type: "uint256"
			}
		],
		name: "booMirrorWorldLeave",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getVault",
		outputs: [
			{
				internalType: "contract IVault",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	}
];

class BooMirrorWorldStakingService {
    encodeEnter(params) {
        const booMirrorWorldStakingLibrary = new abi.Interface(booMirrorWorldStakingAbi);
        return booMirrorWorldStakingLibrary.encodeFunctionData('booMirrorWorldEnter', [
            params.sender,
            params.recipient,
            params.amount,
            params.outputReference,
        ]);
    }
    encodeLeave(params) {
        const booMirrorWorldStakingLibrary = new abi.Interface(booMirrorWorldStakingAbi);
        return booMirrorWorldStakingLibrary.encodeFunctionData('booMirrorWorldLeave', [
            params.sender,
            params.recipient,
            params.amount,
            params.outputReference,
        ]);
    }
}

var fBeetsBarStakingAbi = [
	{
		inputs: [
			{
				internalType: "contract IERC20",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "approveVault",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "outputReference",
				type: "uint256"
			}
		],
		name: "fBeetsBarEnter",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "outputReference",
				type: "uint256"
			}
		],
		name: "fBeetsBarLeave",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getVault",
		outputs: [
			{
				internalType: "contract IVault",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	}
];

class FBeetsBarStakingService {
    encodeEnter(params) {
        const fBeetsBarStakingLibrary = new abi.Interface(fBeetsBarStakingAbi);
        return fBeetsBarStakingLibrary.encodeFunctionData('fBeetsBarEnter', [
            params.sender,
            params.recipient,
            params.amount,
            params.outputReference,
        ]);
    }
    encodeLeave(params) {
        const fBeetsBarStakingLibrary = new abi.Interface(fBeetsBarStakingAbi);
        return fBeetsBarStakingLibrary.encodeFunctionData('fBeetsBarLeave', [
            params.sender,
            params.recipient,
            params.amount,
            params.outputReference,
        ]);
    }
}

var masterChefStakingAbi = [
	{
		inputs: [
			{
				internalType: "contract IERC20",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "approveVault",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getVault",
		outputs: [
			{
				internalType: "contract IVault",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "contract IERC20",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "pid",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "outputReference",
				type: "uint256"
			}
		],
		name: "masterChefDeposit",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "pid",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "outputReference",
				type: "uint256"
			}
		],
		name: "masterChefWithdraw",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	}
];

class MasterChefStakingService {
    encodeDeposit(params) {
        const fBeetsBarStakingLibrary = new abi.Interface(masterChefStakingAbi);
        return fBeetsBarStakingLibrary.encodeFunctionData('masterChefDeposit', [
            params.sender,
            params.recipient,
            params.token,
            params.pid,
            params.amount,
            params.outputReference,
        ]);
    }
    encodeWithdraw(params) {
        const fBeetsBarStakingLibrary = new abi.Interface(masterChefStakingAbi);
        return fBeetsBarStakingLibrary.encodeFunctionData('masterChefWithdraw', [
            params.recipient,
            params.pid,
            params.amount,
            params.outputReference,
        ]);
    }
}

var yearnWrappingAbi = [
	{
		inputs: [
			{
				internalType: "contract IERC20",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "approveVault",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getVault",
		outputs: [
			{
				internalType: "contract IVault",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "contract IYearnTokenVault",
				name: "vaultToken",
				type: "address"
			},
			{
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "outputReference",
				type: "uint256"
			}
		],
		name: "unwrapYearnVaultToken",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "contract IYearnTokenVault",
				name: "vaultToken",
				type: "address"
			},
			{
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "outputReference",
				type: "uint256"
			}
		],
		name: "wrapYearnVaultToken",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	}
];

class YearnWrappingService {
    encodeWrap(params) {
        const yearnWrappingLibrary = new abi.Interface(yearnWrappingAbi);
        return yearnWrappingLibrary.encodeFunctionData('wrapYearnVaultToken', [
            params.vaultToken,
            params.sender,
            params.recipient,
            params.amount,
            params.outputReference,
        ]);
    }
    encodeUnwrap(params) {
        const yearnWrappingLibrary = new abi.Interface(yearnWrappingAbi);
        return yearnWrappingLibrary.encodeFunctionData('unwrapYearnVaultToken', [
            params.vaultToken,
            params.sender,
            params.recipient,
            params.amount,
            params.outputReference,
        ]);
    }
}

var aaveWrappingAbi = [
	{
		inputs: [
			{
				internalType: "contract IERC20",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "approveVault",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getVault",
		outputs: [
			{
				internalType: "contract IVault",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "contract IStaticATokenLM",
				name: "staticToken",
				type: "address"
			},
			{
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			},
			{
				internalType: "bool",
				name: "toUnderlying",
				type: "bool"
			},
			{
				internalType: "uint256",
				name: "outputReference",
				type: "uint256"
			}
		],
		name: "unwrapAaveStaticToken",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "contract IStaticATokenLM",
				name: "staticToken",
				type: "address"
			},
			{
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			},
			{
				internalType: "bool",
				name: "fromUnderlying",
				type: "bool"
			},
			{
				internalType: "uint256",
				name: "outputReference",
				type: "uint256"
			}
		],
		name: "wrapAaveDynamicToken",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	}
];

class AaveWrappingService {
    encodeUnwrap(params) {
        const aaveWrappingLibrary = new abi.Interface(aaveWrappingAbi);
        return aaveWrappingLibrary.encodeFunctionData('unwrapAaveStaticToken', [
            params.staticToken,
            params.sender,
            params.recipient,
            params.amount,
            params.toUnderlying,
            params.outputReferences,
        ]);
    }
}

var relayerLibraryAbi = [
	{
		inputs: [
			{
				internalType: "contract IERC20",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "approveVault",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "enum IVault.SwapKind",
				name: "kind",
				type: "uint8"
			},
			{
				components: [
					{
						internalType: "bytes32",
						name: "poolId",
						type: "bytes32"
					},
					{
						internalType: "uint256",
						name: "assetInIndex",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "assetOutIndex",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount",
						type: "uint256"
					},
					{
						internalType: "bytes",
						name: "userData",
						type: "bytes"
					}
				],
				internalType: "struct IVault.BatchSwapStep[]",
				name: "swaps",
				type: "tuple[]"
			},
			{
				internalType: "contract IAsset[]",
				name: "assets",
				type: "address[]"
			},
			{
				components: [
					{
						internalType: "address",
						name: "sender",
						type: "address"
					},
					{
						internalType: "bool",
						name: "fromInternalBalance",
						type: "bool"
					},
					{
						internalType: "address payable",
						name: "recipient",
						type: "address"
					},
					{
						internalType: "bool",
						name: "toInternalBalance",
						type: "bool"
					}
				],
				internalType: "struct IVault.FundManagement",
				name: "funds",
				type: "tuple"
			},
			{
				internalType: "int256[]",
				name: "limits",
				type: "int256[]"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			},
			{
				components: [
					{
						internalType: "uint256",
						name: "index",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "key",
						type: "uint256"
					}
				],
				internalType: "struct VaultActions.OutputReference[]",
				name: "outputReferences",
				type: "tuple[]"
			}
		],
		name: "batchSwap",
		outputs: [
			{
				internalType: "int256[]",
				name: "",
				type: "int256[]"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "poolId",
				type: "bytes32"
			},
			{
				internalType: "enum VaultActions.PoolKind",
				name: "kind",
				type: "uint8"
			},
			{
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				internalType: "address payable",
				name: "recipient",
				type: "address"
			},
			{
				components: [
					{
						internalType: "contract IAsset[]",
						name: "assets",
						type: "address[]"
					},
					{
						internalType: "uint256[]",
						name: "minAmountsOut",
						type: "uint256[]"
					},
					{
						internalType: "bytes",
						name: "userData",
						type: "bytes"
					},
					{
						internalType: "bool",
						name: "toInternalBalance",
						type: "bool"
					}
				],
				internalType: "struct IVault.ExitPoolRequest",
				name: "request",
				type: "tuple"
			},
			{
				components: [
					{
						internalType: "uint256",
						name: "index",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "key",
						type: "uint256"
					}
				],
				internalType: "struct VaultActions.OutputReference[]",
				name: "outputReferences",
				type: "tuple[]"
			}
		],
		name: "exitPool",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getVault",
		outputs: [
			{
				internalType: "contract IVault",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "poolId",
				type: "bytes32"
			},
			{
				internalType: "enum VaultActions.PoolKind",
				name: "kind",
				type: "uint8"
			},
			{
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				components: [
					{
						internalType: "contract IAsset[]",
						name: "assets",
						type: "address[]"
					},
					{
						internalType: "uint256[]",
						name: "maxAmountsIn",
						type: "uint256[]"
					},
					{
						internalType: "bytes",
						name: "userData",
						type: "bytes"
					},
					{
						internalType: "bool",
						name: "fromInternalBalance",
						type: "bool"
					}
				],
				internalType: "struct IVault.JoinPoolRequest",
				name: "request",
				type: "tuple"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "outputReference",
				type: "uint256"
			}
		],
		name: "joinPool",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "enum IVault.UserBalanceOpKind",
						name: "kind",
						type: "uint8"
					},
					{
						internalType: "contract IAsset",
						name: "asset",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "amount",
						type: "uint256"
					},
					{
						internalType: "address",
						name: "sender",
						type: "address"
					},
					{
						internalType: "address payable",
						name: "recipient",
						type: "address"
					}
				],
				internalType: "struct IVault.UserBalanceOp[]",
				name: "ops",
				type: "tuple[]"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "manageUserBalance",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "bytes32",
						name: "poolId",
						type: "bytes32"
					},
					{
						internalType: "enum IVault.SwapKind",
						name: "kind",
						type: "uint8"
					},
					{
						internalType: "contract IAsset",
						name: "assetIn",
						type: "address"
					},
					{
						internalType: "contract IAsset",
						name: "assetOut",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "amount",
						type: "uint256"
					},
					{
						internalType: "bytes",
						name: "userData",
						type: "bytes"
					}
				],
				internalType: "struct IVault.SingleSwap",
				name: "singleSwap",
				type: "tuple"
			},
			{
				components: [
					{
						internalType: "address",
						name: "sender",
						type: "address"
					},
					{
						internalType: "bool",
						name: "fromInternalBalance",
						type: "bool"
					},
					{
						internalType: "address payable",
						name: "recipient",
						type: "address"
					},
					{
						internalType: "bool",
						name: "toInternalBalance",
						type: "bool"
					}
				],
				internalType: "struct IVault.FundManagement",
				name: "funds",
				type: "tuple"
			},
			{
				internalType: "uint256",
				name: "limit",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "outputReference",
				type: "uint256"
			}
		],
		name: "swap",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "payable",
		type: "function"
	}
];

class VaultActionsService {
    encodeBatchSwap(params) {
        const relayerLibrary = new abi.Interface(relayerLibraryAbi);
        return relayerLibrary.encodeFunctionData('batchSwap', [
            params.swapType,
            params.swaps,
            params.assets,
            params.funds,
            params.limits,
            params.deadline,
            params.value,
            params.outputReferences,
        ]);
    }
    encodeExitPool(params) {
        const relayerLibrary = new abi.Interface(relayerLibraryAbi);
        return relayerLibrary.encodeFunctionData('exitPool', [
            params.poolId,
            params.poolKind,
            params.sender,
            params.recipient,
            params.exitPoolRequest,
            params.outputReferences,
        ]);
    }
    encodeJoinPool(params) {
        const relayerLibrary = new abi.Interface(relayerLibraryAbi);
        return relayerLibrary.encodeFunctionData('joinPool', [
            params.poolId,
            params.poolKind,
            params.sender,
            params.recipient,
            params.joinPoolRequest,
            params.value,
            params.outputReference,
        ]);
    }
    constructExitCall(params) {
        const { assets, minAmountsOut, userData, toInternalBalance, poolId, poolKind, sender, recipient, outputReferences, } = params;
        const exitPoolRequest = {
            assets,
            minAmountsOut,
            userData,
            toInternalBalance,
        };
        const exitPoolInput = {
            poolId,
            poolKind,
            sender,
            recipient,
            outputReferences,
            exitPoolRequest,
        };
        return this.encodeExitPool(exitPoolInput);
    }
}

class Relayer {
    constructor(swaps, config) {
        this.swaps = swaps;
        this.config = config;
        this.vaultActionsService = new VaultActionsService();
        this.aaveWrappingService = new AaveWrappingService();
        this.booMirrorWorldStaking = new BooMirrorWorldStakingService();
        this.fBeetsBarStakingService = new FBeetsBarStakingService();
        this.masterChefStakingService = new MasterChefStakingService();
        this.yearnWrappingService = new YearnWrappingService();
        this.batchRelayerAddress =
            this.config.addresses.contracts.batchRelayer || '';
    }
    static toChainedReference(key) {
        // The full padded prefix is 66 characters long, with 64 hex characters and the 0x prefix.
        const paddedPrefix = `0x${Relayer.CHAINED_REFERENCE_PREFIX}${'0'.repeat(64 - Relayer.CHAINED_REFERENCE_PREFIX.length)}`;
        return bignumber.BigNumber.from(paddedPrefix).add(key);
    }
    /**
     * fetchPools saves updated pools data to SOR internal onChainBalanceCache.
     * @param {SubgraphPoolBase[]} [poolsData=[]] If poolsData passed uses this as pools source otherwise fetches from config.subgraphUrl.
     * @param {boolean} [isOnChain=true] If isOnChain is true will retrieve all required onChain data via multicall otherwise uses subgraph values.
     * @returns {boolean} Boolean indicating whether pools data was fetched correctly (true) or not (false).
     */
    async fetchPools() {
        return this.swaps.fetchPools();
    }
    getPools() {
        return this.swaps.getPools();
    }
    get poolMap() {
        const pools = this.getPools();
        return lodash.keyBy(pools, 'address');
    }
    get linearPoolMap() {
        const pools = this.getPools();
        return lodash.keyBy(pools.filter((pool) => pool.poolType === 'Linear'), 'address');
    }
    get linearPoolWrappedTokenMap() {
        const pools = this.getPools();
        return lodash.keyBy(pools.filter((pool) => pool.poolType === 'Linear'), (pool) => pool.tokensList[pool.wrappedIndex || 0]);
    }
    get stablePhantomMap() {
        const pools = this.getPools();
        return lodash.keyBy(pools.filter((pool) => pool.poolType === 'StablePhantom'), 'address');
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
    async exitPoolAndBatchSwap(params) {
        const pool = this.getRequiredPool(params.poolId);
        pool.poolType === 'Weighted';
        const slippageAmountNegative = constants.WeiPerEther.sub(bignumber.BigNumber.from(params.slippage));
        const exits = params.exits.map((exit) => {
            var _a;
            return ({
                ...exit,
                exitToken: exit.exitToken.toLowerCase(),
                batchSwapTokenOut: (_a = exit.batchSwapTokenOut) === null || _a === void 0 ? void 0 : _a.toLowerCase(),
                // Set min amounts out of exit pool based on slippage
                exitMinAmountOut: bignumber.BigNumber.from(exit.exitExpectedAmountOut)
                    .mul(slippageAmountNegative)
                    .div(constants.WeiPerEther)
                    .toString(),
            });
        });
        // Output of exit is used as input to swaps
        const outputReferences = exits.map((exit, index) => ({
            index,
            key: Relayer.toChainedReference(index),
        }));
        const exitsWithBatchSwaps = exits.filter((exit) => exit.batchSwapTokenOut);
        const batchSwapTokensIn = exitsWithBatchSwaps.map((exit) => exit.exitToken);
        const batchSwapTokensOut = exitsWithBatchSwaps.map((exit) => exit.batchSwapTokenOut || '');
        const poolContainsOnlyPhantomBpts = exits.length === exitsWithBatchSwaps.length;
        const exitCall = this.vaultActionsService.constructExitCall({
            assets: exits.map((exit) => exit.exitToken),
            minAmountsOut: exits.map((exit) => exit.exitMinAmountOut),
            userData: params.userData,
            toInternalBalance: poolContainsOnlyPhantomBpts,
            poolId: params.poolId,
            poolKind: 0,
            sender: params.exiter,
            recipient: params.exiter,
            outputReferences,
            exitPoolRequest: {},
        });
        // Use swapsService to get swap info for exitTokens>finalTokens
        // This will give batchSwap swap paths
        // Amounts out will be worst case amounts
        const queryResult = await this.swaps.queryBatchSwapWithSor({
            tokensIn: batchSwapTokensIn,
            tokensOut: batchSwapTokensOut,
            swapType: exports.SwapType.SwapExactIn,
            amounts: exitsWithBatchSwaps.map((exit) => exit.exitMinAmountOut),
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
        const slippageAmountPositive = constants.WeiPerEther.add(params.slippage);
        exits.forEach((exit) => {
            const index = queryResult.assets
                .map((elem) => elem.toLowerCase())
                .indexOf(exit.exitToken.toLowerCase());
            if (index !== -1) {
                queryResult.deltas[index] = bignumber.BigNumber.from(exit.exitExpectedAmountOut)
                    .mul(slippageAmountPositive)
                    .div(constants.WeiPerEther)
                    .toString();
            }
        });
        // Creates limit array.
        // Slippage set to 0. Already accounted for as swap used amounts out of pool with worst case slippage.
        const limits = Swaps.getLimitsForSlippage(batchSwapTokensIn, // tokensIn
        batchSwapTokensOut, // tokensOut
        exports.SwapType.SwapExactIn, queryResult.deltas, // tempDeltas // Useful for debug
        queryResult.assets, '0');
        // Creates fund management using internal balance as source of tokens
        const funds = {
            sender: params.exiter,
            recipient: params.swapRecipient,
            fromInternalBalance: poolContainsOnlyPhantomBpts,
            toInternalBalance: false,
        };
        let additionalCalls = [];
        let unwrapOutputReferences = [];
        if (params.unwrap) {
            //find any wrapped tokens in the query result assets
            const wrappedTokens = Object.keys(this.linearPoolWrappedTokenMap).filter((wrappedToken) => queryResult.assets.includes(wrappedToken));
            const { unwrapCalls, outputReferences } = this.encodeUnwrapCalls(wrappedTokens, queryResult.assets, funds);
            additionalCalls = unwrapCalls;
            unwrapOutputReferences = outputReferences;
            //update the return amounts to represent the unwrappedAmount
            queryResult.returnAmounts = queryResult.returnAmounts.map((returnAmount, i) => {
                const asset = batchSwapTokensOut[i].toLowerCase();
                if (this.linearPoolWrappedTokenMap[asset]) {
                    const linearPool = this.linearPoolWrappedTokenMap[asset];
                    const wrappedToken = linearPool.tokens[linearPool.wrappedIndex || 0];
                    const wrappedDecimals = wrappedToken.decimals;
                    const priceRate = bignumber.parseFixed(wrappedToken.priceRate, wrappedDecimals);
                    return bignumber.BigNumber.from(returnAmount)
                        .mul(priceRate)
                        .div(bignumber.BigNumber.from(10).pow(wrappedDecimals))
                        .toString();
                }
                return returnAmount;
            });
        }
        const encodedBatchSwap = this.vaultActionsService.encodeBatchSwap({
            swapType: exports.SwapType.SwapExactIn,
            swaps: queryResult.swaps,
            assets: queryResult.assets,
            funds: funds,
            limits: limits.map((l) => l.toString()),
            deadline: constants.MaxUint256,
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
                    const index = exitsWithBatchSwaps.findIndex((exitWithBatchSwap) => exitWithBatchSwap.exitToken === exit.exitToken);
                    //Add the slippage back to the amountsOut so that it reflects the expected amount
                    //rather than worst case
                    return bignumber.BigNumber.from(queryResult.returnAmounts[index])
                        .mul(slippageAmountPositive)
                        .div(constants.WeiPerEther)
                        .toString();
                }),
            },
        };
    }
    async joinPool({ poolId, tokens, bptOut, fetchPools, slippage, funds, farmId, mintFBeets, }) {
        const stakeBptInFarm = typeof farmId === 'number';
        const wrappedNativeAsset = this.config.addresses.tokens.wrappedNativeAsset.toLowerCase();
        const pool = this.getRequiredPool(poolId);
        const nestedLinearPools = this.getNestedLinearPools(pool);
        const isWeightedPool = pool.poolType === 'Weighted';
        const hasNestedLinearPools = nestedLinearPools.length > 0;
        const calls = [];
        let queryResult = null;
        const nativeToken = tokens.find((token) => token.address === constants.AddressZero);
        const nativeAssetValue = nativeToken
            ? bignumber.parseFixed(nativeToken.amount, 18).toString()
            : '0';
        //TODO: if there are no nested pools, we don't need to use the batch relayer
        if (hasNestedLinearPools) {
            //if there are nested linear pools, the first step is to swap mainTokens for linear or phantom stable BPT
            const tokensIn = nestedLinearPools.map((item) => nativeToken && item.mainToken === wrappedNativeAsset
                ? constants.AddressZero
                : item.mainToken);
            const tokensOut = nestedLinearPools.map((item) => item.poolTokenAddress);
            const amounts = tokensIn.map((tokenAddress) => {
                if (tokenAddress === constants.AddressZero) {
                    return nativeAssetValue;
                }
                const token = tokens.find((token) => token.address.toLowerCase() ===
                    tokenAddress.toLowerCase());
                return this.getTokenAmountScaled(tokenAddress, (token === null || token === void 0 ? void 0 : token.amount) || '0');
            });
            queryResult = await this.swaps.queryBatchSwapWithSor({
                tokensIn,
                tokensOut,
                swapType: exports.SwapType.SwapExactIn,
                amounts,
                fetchPools,
            });
            const limits = Swaps.getLimitsForSlippage(tokensIn, tokensOut, exports.SwapType.SwapExactIn, queryResult.deltas, queryResult.assets, slippage);
            const encodedBatchSwap = this.vaultActionsService.encodeBatchSwap({
                swapType: exports.SwapType.SwapExactIn,
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
                deadline: constants.MaxUint256,
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
            const joinHasNativeAsset = pool.tokensList.find((token) => token === wrappedNativeAsset) &&
                nativeAssetValue !== '0';
            const amountsIn = pool.tokensList.map((tokenAddress) => {
                const token = tokens.find((token) => {
                    if (token.address === constants.AddressZero &&
                        tokenAddress.toLowerCase() === wrappedNativeAsset) {
                        return true;
                    }
                    return (token.address.toLowerCase() ===
                        tokenAddress.toLowerCase());
                });
                if (token) {
                    return this.getTokenAmountScaled(tokenAddress, (token === null || token === void 0 ? void 0 : token.amount) || '0');
                }
                //This token is a nested BPT, not a mainToken
                //Replace the amount with the chained reference value
                const index = (queryResult === null || queryResult === void 0 ? void 0 : queryResult.assets.findIndex((asset) => asset.toLowerCase() === tokenAddress.toLowerCase())) || -1;
                //if the return amount is 0, we dont pass on the chained reference
                if (index === -1 || (queryResult === null || queryResult === void 0 ? void 0 : queryResult.deltas[index]) === '0') {
                    return '0';
                }
                return Relayer.toChainedReference(index || 0);
            });
            const encodedJoinPool = this.vaultActionsService.encodeJoinPool({
                poolId: pool.id,
                poolKind: 0,
                sender: funds.sender,
                recipient: stakeBptInFarm || mintFBeets
                    ? this.batchRelayerAddress
                    : funds.recipient,
                joinPoolRequest: {
                    assets: joinHasNativeAsset
                        ? pool.tokensList.map((token) => token === wrappedNativeAsset ? constants.AddressZero : token)
                        : pool.tokensList,
                    maxAmountsIn: amountsIn,
                    userData: WeightedPoolEncoder.joinExactTokensInForBPTOut(amountsIn, bptOut),
                    fromInternalBalance: hasNestedLinearPools
                        ? true
                        : funds.fromInternalBalance,
                },
                value: joinHasNativeAsset ? nativeAssetValue : constants.Zero,
                outputReference: stakeBptInFarm
                    ? Relayer.toChainedReference(0)
                    : constants.Zero,
            });
            calls.push(encodedJoinPool);
        }
        if (mintFBeets) {
            calls.push(this.fBeetsBarStakingService.encodeEnter({
                sender: this.batchRelayerAddress,
                recipient: stakeBptInFarm
                    ? this.batchRelayerAddress
                    : funds.recipient,
                amount: Relayer.toChainedReference(0),
                outputReference: Relayer.toChainedReference(0),
            }));
        }
        if (stakeBptInFarm) {
            calls.push(this.masterChefStakingService.encodeDeposit({
                sender: this.batchRelayerAddress,
                recipient: funds.recipient,
                token: mintFBeets && this.config.fBeets
                    ? this.config.fBeets.address
                    : pool.address,
                pid: mintFBeets && this.config.fBeets
                    ? this.config.fBeets.farmId
                    : farmId,
                amount: Relayer.toChainedReference(0),
                outputReference: constants.Zero,
            }));
        }
        return {
            function: 'multicall',
            params: calls,
            outputs: {},
        };
    }
    getNestedLinearPools(pool) {
        const linearPools = [];
        for (const token of pool.tokensList) {
            if (this.linearPoolMap[token]) {
                const linearPool = this.linearPoolMap[token];
                const mainIdx = linearPool.mainIndex || 0;
                linearPools.push({
                    pool: linearPool,
                    mainToken: linearPool.tokensList[mainIdx],
                    wrappedToken: linearPool.tokensList[linearPool.wrappedIndex || 0],
                    poolTokenAddress: linearPool.address,
                });
            }
            else if (this.stablePhantomMap[token]) {
                for (const stablePhantomToken of this.stablePhantomMap[token]
                    .tokensList) {
                    if (this.linearPoolMap[stablePhantomToken]) {
                        const linearPool = this.linearPoolMap[stablePhantomToken];
                        const mainIdx = linearPool.mainIndex || 0;
                        linearPools.push({
                            pool: linearPool,
                            mainToken: linearPool.tokensList[mainIdx],
                            wrappedToken: linearPool.tokensList[linearPool.wrappedIndex || 0],
                            poolTokenAddress: this.stablePhantomMap[token].address,
                        });
                    }
                }
            }
        }
        return linearPools;
    }
    getRequiredPool(poolId) {
        const pools = this.getPools();
        const pool = pools.find((pool) => pool.id === poolId);
        if (!pool) {
            throw new Error('No pool found with id: ' + poolId);
        }
        return pool;
    }
    getRequiredLinearPoolForWrappedToken(wrappedToken) {
        const pools = this.getPools();
        const pool = pools.find((pool) => typeof pool.wrappedIndex === 'number' &&
            pool.tokensList[pool.wrappedIndex] ===
                wrappedToken.toLowerCase());
        if (!pool) {
            throw new Error('No linear pool found for wrapped token: ' + wrappedToken);
        }
        return pool;
    }
    getTokenAmountScaled(tokenAddress, amount) {
        const pools = this.getPools();
        const tokens = lodash.flatten(pools.map((pool) => pool.tokens));
        const token = tokens.find((token) => { var _a; return ((_a = token.address) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === tokenAddress.toLowerCase(); });
        if (!token) {
            throw new Error('No token found with address: ' + tokenAddress);
        }
        return bignumber.parseFixed(amount, token.decimals).toString();
    }
    getLinearPoolType(pool) {
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
    async swapUnwrapExactIn(tokensIn, wrappedTokens, amountsIn, rates, funds, slippage, fetchPools = {
        fetchPools: true,
        fetchOnChain: false,
    }) {
        // Use swapsService to get swap info for tokensIn>wrappedTokens
        const queryResult = await this.swaps.queryBatchSwapWithSor({
            tokensIn,
            tokensOut: wrappedTokens,
            swapType: exports.SwapType.SwapExactIn,
            amounts: amountsIn,
            fetchPools,
        });
        // Gets limits array for tokensIn>wrappedTokens based on input slippage
        const limits = Swaps.getLimitsForSlippage(tokensIn, // tokensIn
        wrappedTokens, // tokensOut
        exports.SwapType.SwapExactIn, queryResult.deltas, queryResult.assets, slippage);
        const calls = this.encodeSwapUnwrap(wrappedTokens, exports.SwapType.SwapExactIn, queryResult.swaps, queryResult.assets, funds, limits);
        const amountsUnwrapped = queryResult.returnAmounts.map((amountWrapped, i) => bignumber.BigNumber.from(amountWrapped)
            .abs()
            .mul(rates[i])
            .div(constants.WeiPerEther)
            .toString());
        return {
            function: 'multicall',
            params: calls,
            outputs: {
                amountsOut: amountsUnwrapped,
            },
        };
    }
    async swapAndUnwrapStablePhantomPool({ poolId, slippage, exits, account, }) {
        const pool = this.getRequiredPool(poolId);
        const linearPools = this.getNestedLinearPools(pool);
        const tokensIn = exits.map(() => pool.address.toLowerCase());
        const batchSwapTokensOut = exits.map((exit) => {
            var _a;
            if (!exit.unwrap) {
                return exit.tokenOut;
            }
            const linearPool = linearPools.find((linearPool) => linearPool.mainToken.toLowerCase() ===
                exit.tokenOut.toLowerCase());
            return (_a = linearPool === null || linearPool === void 0 ? void 0 : linearPool.wrappedToken) !== null && _a !== void 0 ? _a : exit.tokenOut;
        });
        // Use swapsService to get swap info for tokensIn>wrappedTokens
        const queryResult = await this.swaps.queryBatchSwapWithSor({
            tokensIn,
            tokensOut: batchSwapTokensOut,
            amounts: exits.map((exit) => exit.bptAmountIn),
            swapType: exports.SwapType.SwapExactIn,
            fetchPools: {
                fetchPools: true,
                fetchOnChain: true,
            },
        });
        // Gets limits array for tokensIn>wrappedTokens based on input slippage
        const limits = Swaps.getLimitsForSlippage(tokensIn, // tokensIn
        batchSwapTokensOut, // tokensOut
        exports.SwapType.SwapExactIn, queryResult.deltas, queryResult.assets, slippage);
        const wrappedTokens = batchSwapTokensOut.filter((batchSwapTokenOut) => {
            const linearPool = linearPools.find((linearPool) => linearPool.wrappedToken.toLowerCase() === batchSwapTokenOut);
            return !!linearPool;
        });
        const funds = {
            sender: account,
            //if all tokens are wrapped, send the output to the batch relayer
            recipient: wrappedTokens.length === batchSwapTokensOut.length
                ? this.batchRelayerAddress
                : account,
            fromInternalBalance: false,
            toInternalBalance: false,
        };
        const { unwrapCalls, outputReferences } = this.encodeUnwrapCalls(wrappedTokens, queryResult.assets, funds);
        const encodedBatchSwap = this.vaultActionsService.encodeBatchSwap({
            swapType: exports.SwapType.SwapExactIn,
            swaps: queryResult.swaps,
            assets: queryResult.assets,
            funds,
            limits: limits.map((l) => l.toString()),
            deadline: constants.MaxUint256,
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
                    const linearPool = linearPools.find((linearPool) => linearPool.wrappedToken.toLowerCase() ===
                        asset.toLowerCase());
                    if (linearPool) {
                        const wrappedRate = linearPool.pool.tokens[linearPool.pool.wrappedIndex || 0].priceRate;
                        const wrappedRateScaled = bignumber.parseFixed(wrappedRate, 18);
                        return bignumber.BigNumber.from(amount)
                            .mul(wrappedRateScaled)
                            .div(constants.WeiPerEther)
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
    async swapUnwrapExactOut(tokensIn, wrappedTokens, amountsUnwrapped, rates, funds, slippage, fetchPools = {
        fetchPools: true,
        fetchOnChain: false,
    }) {
        const amountsWrapped = amountsUnwrapped.map((amountInwrapped, i) => bignumber.BigNumber.from(amountInwrapped)
            .mul(constants.WeiPerEther)
            .div(rates[i])
            .toString());
        // Use swapsService to get swap info for tokensIn>wrappedTokens
        const queryResult = await this.swaps.queryBatchSwapWithSor({
            tokensIn,
            tokensOut: wrappedTokens,
            swapType: exports.SwapType.SwapExactOut,
            amounts: amountsWrapped,
            fetchPools,
        });
        // Gets limits array for tokensIn>wrappedTokens based on input slippage
        const limits = Swaps.getLimitsForSlippage(tokensIn, // tokensIn
        wrappedTokens, // tokensOut
        exports.SwapType.SwapExactOut, queryResult.deltas, queryResult.assets, slippage);
        const calls = this.encodeSwapUnwrap(wrappedTokens, exports.SwapType.SwapExactOut, queryResult.swaps, queryResult.assets, funds, limits);
        return {
            function: 'multicall',
            params: calls,
            outputs: {
                amountsIn: queryResult.returnAmounts.map((amount) => amount.toString()),
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
    encodeSwapUnwrap(wrappedTokens, swapType, swaps, assets, funds, limits) {
        // Output of swaps (wrappedTokens) is used as input to unwrap
        // Need indices of output tokens and outputReferences need to be made with those as key
        const { unwrapCalls, outputReferences } = this.encodeUnwrapCalls(wrappedTokens, assets, funds);
        const encodedBatchSwap = this.vaultActionsService.encodeBatchSwap({
            swapType: swapType,
            swaps: swaps,
            assets: assets,
            funds: funds,
            limits: limits.map((l) => l.toString()),
            deadline: constants.MaxUint256,
            value: '0',
            outputReferences: outputReferences,
        });
        return [encodedBatchSwap, ...unwrapCalls];
    }
    encodeUnwrapCalls(wrappedTokens, assets, funds) {
        const outputReferences = [];
        const unwrapCalls = [];
        wrappedTokens.forEach((wrappedToken, i) => {
            const linearPool = this.getRequiredLinearPoolForWrappedToken(wrappedToken);
            const linearPoolType = this.getLinearPoolType(linearPool);
            // Find index of wrappedToken in asset array. This is used as ref in Relayer.
            const index = assets.findIndex((token) => token.toLowerCase() === wrappedToken.toLowerCase());
            // There may be cases where swap isn't possible for wrappedToken
            if (index === -1)
                return;
            const key = Relayer.toChainedReference(i);
            outputReferences.push({
                index: index,
                key: key,
            });
            // console.log(`Unwrapping ${wrappedToken} with amt: ${key.toHexString()}`);
            switch (linearPoolType) {
                case 'aave':
                    unwrapCalls.push(this.aaveWrappingService.encodeUnwrap({
                        staticToken: wrappedToken,
                        sender: funds.recipient,
                        recipient: funds.sender,
                        amount: key,
                        toUnderlying: true,
                        outputReferences: 0,
                    }));
                    break;
                case 'yearn':
                    unwrapCalls.push(this.yearnWrappingService.encodeUnwrap({
                        vaultToken: wrappedToken,
                        sender: funds.recipient,
                        recipient: funds.sender,
                        amount: key,
                        outputReference: 0,
                    }));
                    break;
                case 'boo':
                    unwrapCalls.push(this.booMirrorWorldStaking.encodeLeave({
                        sender: funds.recipient,
                        recipient: funds.sender,
                        amount: key,
                        outputReference: 0,
                    }));
                    break;
            }
        });
        return { unwrapCalls, outputReferences };
    }
}
Relayer.CHAINED_REFERENCE_PREFIX = 'ba10';

class Subgraph {
    constructor(config) {
        this.url = getNetworkConfig(config).urls.subgraph;
        this.client = this.initClient();
    }
    initClient() {
        const client = new graphqlRequest.GraphQLClient(this.url);
        return getSdk(client);
    }
}

class BalancerSDK {
    constructor(config) {
        this.config = config;
        this.sor = new Sor(this.config);
        this.subgraph = new Subgraph(this.config);
        this.swaps = new Swaps(this.sor);
        this.relayer = new Relayer(this.swaps, this.networkConfig);
    }
    get networkConfig() {
        return getNetworkConfig(this.config);
    }
}

Object.defineProperty(exports, 'PoolFilter', {
    enumerable: true,
    get: function () { return sor.PoolFilter; }
});
Object.defineProperty(exports, 'SOR', {
    enumerable: true,
    get: function () { return sor.SOR; }
});
Object.defineProperty(exports, 'SwapTypes', {
    enumerable: true,
    get: function () { return sor.SwapTypes; }
});
Object.defineProperty(exports, 'phantomStableBPTForTokensZeroPriceImpact', {
    enumerable: true,
    get: function () { return sor.phantomStableBPTForTokensZeroPriceImpact; }
});
Object.defineProperty(exports, 'queryBatchSwapTokensIn', {
    enumerable: true,
    get: function () { return sor.queryBatchSwapTokensIn; }
});
Object.defineProperty(exports, 'queryBatchSwapTokensOut', {
    enumerable: true,
    get: function () { return sor.queryBatchSwapTokensOut; }
});
Object.defineProperty(exports, 'stableBPTForTokensZeroPriceImpact', {
    enumerable: true,
    get: function () { return sor.stableBPTForTokensZeroPriceImpact; }
});
Object.defineProperty(exports, 'weightedBPTForTokensZeroPriceImpact', {
    enumerable: true,
    get: function () { return sor.weightedBPTForTokensZeroPriceImpact; }
});
exports.AaveHelpers = AaveHelpers;
exports.AssetHelpers = AssetHelpers;
exports.BalancerErrors = BalancerErrors;
exports.BalancerSDK = BalancerSDK;
exports.ManagedPoolEncoder = ManagedPoolEncoder;
exports.Relayer = Relayer;
exports.RelayerAuthorization = RelayerAuthorization;
exports.Sor = Sor;
exports.StablePoolEncoder = StablePoolEncoder;
exports.Subgraph = Subgraph;
exports.Swaps = Swaps;
exports.WeightedPoolEncoder = WeightedPoolEncoder;
exports.accountToAddress = accountToAddress;
exports.getLimitsForSlippage = getLimitsForSlippage;
exports.getPoolAddress = getPoolAddress;
exports.getPoolNonce = getPoolNonce;
exports.getPoolSpecialization = getPoolSpecialization;
exports.isNormalizedWeights = isNormalizedWeights;
exports.isSameAddress = isSameAddress;
exports.signPermit = signPermit;
exports.splitPoolId = splitPoolId;
exports.toNormalizedWeights = toNormalizedWeights;
//# sourceMappingURL=index.js.map
