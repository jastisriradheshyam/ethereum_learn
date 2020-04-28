"use strict";
const util = require('util');
const CrowdFundingWithDeadline = artifacts.require('TestCrowdFundingWithDeadline');

contract('CrowdFundingWithDeadline', (accounts) => {
    let contract;
    let contractCreator = accounts[0];
    let beneficiary = accounts[1];

    const ONE_ETH = 10 ** 18;
    const ERROR_MSG = 'VM Exception while processing transaction: revert';

    const STATE_ONGOING = 0;
    const STATE_FAILED = 1;
    const STATE_SUCCEEDED = 2;
    const STATE_PAID_OUT = 3;

    beforeEach(async () => {
        contract = await CrowdFundingWithDeadline.new(
            'funding',
            1,
            10,
            beneficiary,
            {
                from: contractCreator,
                gas: 2000000
            }
        );
    });

    it('contract is initialized', async () => {
        const campaignName = await contract.name.call();
        expect(campaignName).to.equal('funding');

        const targetAmount = await contract.targetAmount.call();
        expect(targetAmount.toString()).to.equal(ONE_ETH.toString());

        const actualBeneficiary = await contract.beneficiary.call();
        expect(actualBeneficiary).to.equal(beneficiary);

        const state = await contract.state.call();
        expect(state.toNumber()).to.equal(STATE_ONGOING);

        const fundingDeadline = await contract.fundingDeadline.call();
        expect(fundingDeadline.toNumber()).to.equal(600);
    });

    it('funds are contributed', async function () {
        await contract.contribute({
            value: ONE_ETH,
            from: contractCreator
        });

        const contributed = await contract.amounts.call(contractCreator);
        expect(contributed.toString()).to.equal(ONE_ETH.toString());

        const totalCollected = await contract.totalCollected.call();
        expect(totalCollected.toString()).to.equal(ONE_ETH.toString());
    })

    it('cannot contribute after deadline', async () => {
        try {
            await contract.setCurrentTime(601);
            await contract.sendTransaction({
                value: ONE_ETH,
                from: contractCreator
            });
            expect.fail();
        } catch (error) {
            expect(error.message).to.include(ERROR_MSG);
        }
    });

    it('crowdfunding succeeded', async () => {
        await contract.contribute({
            value: ONE_ETH,
            from: contractCreator
        });

        await contract.setCurrentTime(601);
        await contract.finishCrowdFunding();

        const state = await contract.state.call();
        expect(state.toNumber()).to.equal(STATE_SUCCEEDED);
    })

    it('crowdfunding failed', async () => {
        await contract.setCurrentTime(601);
        await contract.finishCrowdFunding();

        const state = await contract.state.call();

        expect(state.toNumber()).to.equal(STATE_FAILED);
    })

    it('collected money paid out', async () => {
        await contract.contribute({
            value: ONE_ETH,
            from: contractCreator
        });

        await contract.setCurrentTime(601);
        await contract.finishCrowdFunding();

        const initAmount = await web3.eth.getBalance(beneficiary);
        await contract.collect({ from: contractCreator });

        const newBalance = await web3.eth.getBalance(beneficiary);
        expect((newBalance - initAmount).toString()).to.equal(ONE_ETH.toString());

        const fundingState = await contract.state.call();
        expect(fundingState.toNumber()).to.equal(STATE_PAID_OUT);
    });

    it('withdraw funds from the contract', async () => {
        await contract.contribute({
            value: ONE_ETH - 100,
            from: contractCreator
        });

        await contract.setCurrentTime(601);
        await contract.finishCrowdFunding();

        await contract.withdraw({
            from: contractCreator
        });

        const amount = await contract.amounts.call(contractCreator);
        expect(amount.toNumber()).to.equal(0);
    });

    it('event is emitted', async () => {
        await contract.setCurrentTime(601);
        await contract.finishCrowdFunding();
        const events = await contract.getPastEvents('CampaignFinished');
        const event = events[0];
        expect(event.args.totalCollected.toNumber()).to.equal(0);
        expect(event.args.succeeded).to.equal(false);
    });
})