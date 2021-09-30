import { v4 as UUID } from 'uuid';

// Interfaces
interface IProps {
    billing_info_id: string;
    environment: IEnvironment;
    user: IUser;
    booking: IBooking;
    cost: number;
    spent_hours: number;
}
interface IUser {
    email: string;
    firstName: string;
    lastName: string;
}
interface IEnvironment {
    environment_id: string;
    name: string;
    version: string;
    type: string,
    vendor: string,
    product: string,
    cost: number;
}

interface IBooking {
    booking_id: string;
    startDate: number;
    endDate: number;
}
interface IBillingInfoInterface extends IProps {
    created_at: number;
}
export default class UserModel {

    private _billing_info_id: string;
    private _environment: IEnvironment;
    private _user: IUser;
    private _booking: IBooking;
    private _cost: number;
    private _spent_hours: number;
    constructor({ billing_info_id = UUID(), environment, user, booking, cost = 0, spent_hours = 0}: IProps) {
        this._billing_info_id = billing_info_id;
        this._environment = environment;
        this._user = user;
        this._booking = booking;
        this._cost = cost;
        this._spent_hours = spent_hours;
    }

    setId(value: string) {
        this._billing_info_id = value !== '' ? value : null;
    }

    getId() {
        return this._billing_info_id;
    }

    setEnvironment(value: IEnvironment) {
        this._environment = value ? value : null;
    }

    getEnvironment() {
        return this._environment;
    }

    setUser(value: IUser) {
        this._user = value ? value : null;
    }

    getUser() {
        return this._user;
    }

    setBooking(value: IBooking) {
        this._booking = value ? value : null;
    }

    getBooking() {
        return this._booking;
    }

    setCost(value: number) {
        this._cost = value ? value : null;
    }
    getCost() {
        return this._cost;
    }

    setSpentHours(value: number) {
        this._spent_hours = value ? value : null;
    }
    getSpentHours() {
        return this._spent_hours;
    }

    getEntityMappings(): IBillingInfoInterface {
        return {
            billing_info_id: this.getId(),
            environment: this.getEnvironment(),
            user: this.getUser(),
            booking: this.getBooking(),
            cost: this.getCost(),
            spent_hours: this.getSpentHours(),
            created_at: new Date().getTime(),
        };
    }

}
