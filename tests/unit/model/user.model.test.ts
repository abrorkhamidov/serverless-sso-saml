import * as chai from 'chai';

import UserModel from '../../../src/models/user.model';

import * as userMock from '../../mocks/user.mock.json';

const expect = chai.expect;

describe('Model/User.model', () => {

    describe('Ensure entity mapping', () => {
        it('should return an object with all of the entity values', () => {
            const userModel = new UserModel(userMock);

            expect(userModel.getEntityMappings()).to.eql({
                user_id: userMock.user_id,
                email: userMock.email,
                firstName: userMock.firstName,
                lastName: userMock.lastName,
                role: userMock.role,
                created_at: userModel.getEntityMappings().created_at
            });
        });
    });

    describe('Ensure entity hydration', () => {
        it('should be able to get-user the hydrated variables from the model', () => {
            const userModel = new UserModel(userMock);

            expect(userModel.getId()).to.eql(userMock.user_id);
            expect(userModel.getEmail()).to.eql(userMock.email);
            expect(userModel.getFirstName()).to.eql(userMock.firstName);
            expect(userModel.getLastName()).to.eql(userMock.lastName);
            expect(userModel.getRole()).to.eql(userMock.role);
        });
    })
})
