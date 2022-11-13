import rewiremock from '../../../node';


describe('rewiremock issue 140', () => {
    it('stub function with rewiremock', () => {

        const mockFunc = () => {
            console.log('This is the stubbed function')
        };

        const subject = rewiremock.proxy(
            () => require('./A'),
            () => {
                rewiremock(() => require('./B'))
                    .with({ func: mockFunc })
            });
        subject.execFunc();
    })
})
