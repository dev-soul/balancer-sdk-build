import {
    EncodeXSonarBarEnterInput,
    EncodeXSonarBarLeaveInput,
} from '@/modules/relayer/types';
import { Interface } from '@ethersproject/abi';
import xSonarBarStakingAbi from '@/lib/abi/XSonarBarStaking.json';

export class XSonarBarStakingService {
    public encodeEnter(params: EncodeXSonarBarEnterInput): string {
        const xSonarBarStakingLibrary = new Interface(xSonarBarStakingAbi);

        return xSonarBarStakingLibrary.encodeFunctionData('xSonarBarEnter', [
            params.sender,
            params.recipient,
            params.amount,
            params.outputReference,
        ]);
    }

    public encodeLeave(params: EncodeXSonarBarLeaveInput): string {
        const xSonarBarStakingLibrary = new Interface(xSonarBarStakingAbi);

        return xSonarBarStakingLibrary.encodeFunctionData('xSonarBarLeave', [
            params.sender,
            params.recipient,
            params.amount,
            params.outputReference,
        ]);
    }
}
