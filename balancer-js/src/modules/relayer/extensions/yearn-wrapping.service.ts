import { EncodeUnwrapYearnVaultTokenInput } from '@/modules/relayer/types';
import { Interface } from '@ethersproject/abi';
import yearnWrappingAbi from '@/lib/abi/YearnWrapping.json';

export class YearnWrappingService {
    public encodeWrap(params: EncodeUnwrapYearnVaultTokenInput): string {
        const yearnWrappingLibrary = new Interface(yearnWrappingAbi);

        return yearnWrappingLibrary.encodeFunctionData('wrapYearnVaultToken', [
            params.vaultToken,
            params.sender,
            params.recipient,
            params.amount,
            params.outputReference,
        ]);
    }

    public encodeUnwrap(params: EncodeUnwrapYearnVaultTokenInput): string {
        const yearnWrappingLibrary = new Interface(yearnWrappingAbi);

        return yearnWrappingLibrary.encodeFunctionData(
            'unwrapYearnVaultToken',
            [
                params.vaultToken,
                params.sender,
                params.recipient,
                params.amount,
                params.outputReference,
            ]
        );
    }
}
