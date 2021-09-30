import * as chai from 'chai';

import {
    validateAgainstConstraints,
    createChunks,
    createFilterObject,
    createFilterExpressionString,
    printShortDate,
    printTotalPeriod
} from '../../../src/utils/util';

const expect = chai.expect;

describe('Util Functions', () => {

    describe('validateAgainstConstraints function', () => {
        const mockData = {
            name: "Test"
        }
        const constraints = {
            "name": {
                "presence": {
                    "allowEmpty": false
                },
                "type": "string"
            }
        };
        it('should resolve if there are no validation errors', () => {
            validateAgainstConstraints(mockData, constraints)
                .then(() => {
                    expect(true).to.eql(true);
                })
                .catch(() => {
                    expect(true).to.eql(false);
                });
        });
        it('should return a response containing validation errors if the data provided is incorrect', (done) => {
            const mockData = {
                 name: 123
            }
            validateAgainstConstraints(mockData, constraints)
                .then(() => {
                    expect(true).to.eql(false);
                    done();
                })
                .catch(() => {
                    expect(true).to.eql(true);
                    done();
                });
        });
    })

    describe('createChunks function', () => {
        const mockData = [
            { user_id: "USER 1" },
            { user_id: "USER 2" },
            { user_id: "USER 3" },
            { user_id: "USER 4" },
            { user_id: "USER 5" },
            { user_id: "USER 6" },
            { user_id: "USER 7" },
            { user_id: "USER 8" },
            { user_id: "USER 9" },
            { user_id: "USER 10" },
            { user_id: "USER 11" },
            { user_id: "USER 12" }
        ]
        const dataCount = mockData.length;
        const chunkSize = 3;
        it('should return array of chunks', async function () {
            const chunks = await createChunks(mockData, chunkSize);
            expect(chunks.length).to.eql(dataCount/chunkSize);
        });
    })
})
