"use strict";

const Voter = artifacts.require('Voter');

contract('Voter', (accounts) => {
    let voter;
    let firstAccount;

    beforeEach(async () => {
        firstAccount = accounts[0];
        voter = await Voter.new();
        await setOptions(firstAccount, ['coffee', 'tea']);
    });

    it('has no votes by default', async () => {
        let votes = await voter.getVotes.call();
        expect(toNumbers(votes)).to.deep.equal([0, 0]);
    });

    it('can vote with a string option', async () => {
        const tx = await voter.contract.methods['vote(string)'](
            'coffee'
        );
        await tx.send({
            from: firstAccount
        });
        const votes = await voter.getVotes.call();
        expect(toNumbers(votes)).to.deep.equal([1, 0]);
    });

    it('can vote with a number option', async () => {
        const tx = await voter.contract.methods['vote(uint256)'](
            0
        );
        await tx.send({
            from: firstAccount
        });
        const votes = await voter.getVotes.call();
        expect(toNumbers(votes)).to.deep.equal([1, 0]);
    });

    it('cannot vote twice from the same contract',async () => {
        const exceptionTestFunc = async ()=>{
            const tx1 = await voter.contract.methods['vote(uint256)'](
                0
            );
            await tx1.send({
                from: firstAccount
            });
            const tx2 = await voter.contract.methods['vote(uint256)'](
                0
            );
            await tx2.send({
                from: firstAccount
            });
        }
        try {
            await exceptionTestFunc();
            expect.fail();
        } catch (error) {
            expect(error.message).to.include('VM Exception while processing transaction: revert Account has already voted');
        }
    });
    const setOptions = async function (account, options) {
        for (const pos in options) {
            await voter.addOption(options[pos], { from: account });
        }
        await voter.startVoting({ from: account, gas: 600000 });
    }

    const toNumbers = function (bigNumbers) {
        return bigNumbers.map((bigNumber) => {
            return bigNumber.toNumber();
        });
    };
});
