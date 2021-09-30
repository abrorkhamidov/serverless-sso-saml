import { v4 as UUID } from 'uuid';

// Interfaces
interface IProps {
    booking_id: string;
    user: IUser;
    environment: IEnvironment;
    name: string;
    startDate: number;
    endDate: number;
    reason: string;
    status: string;
    pipeline_status: string;
}

interface IUser {
    email: string;
    firstName: string;
    lastName: string;
}

interface IPipelineDetails {
    token: string;
    pipeline_link: string;
    ref: string;
}
interface IEnvironment {
    environment_id: string;
    name: string;
    version: string;
    type: string;
    vendor: string;
    product: string;
    cost: number;
    status: string;
    pipeline_details: IPipelineDetails;
}
interface IBookingInterface extends IProps {
    created_at: number;
}


enum Status {
    ACTIVE = 'ACTIVE',
    DELETING = 'DELETING',
    CREATING = 'CREATING',
    FAILED = 'FAILED',
    FUTURE = 'FUTURE',
    PAST = 'PAST',
    PAUSED = 'PAUSED'
}

const STATUS_MESSAGES = {
    "ACTIVE": Status.ACTIVE,
    "DELETING": Status.DELETING,
    "CREATING": Status.CREATING,
    "FAILED": Status.FAILED,
    "FUTURE": Status.FUTURE,
    "PAST": Status.PAST,
    "PAUSED": Status.PAUSED
}

enum PipelineStatus {
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    INPROGRESS = 'IN PROGRESS'
}

const PIPELINE_STATUS_MESSAGES = {
    "SUCCESS": PipelineStatus.SUCCESS,
    "FAILED": Status.FAILED,
    "IN PROGRESS": PipelineStatus.INPROGRESS,
}

export default class BookingModel {

    private _booking_id: string;
    private _user: IUser;
    private _environment: IEnvironment;
    private _name: string;
    private _startDate: number;
    private _endDate: number;
    private _reason: string;
    private _status: string;
    private _pipeline_status: string;

    constructor({booking_id = UUID(),user,environment, name = '', startDate = new Date().getTime(),endDate, reason = '', status = 'FUTURE',pipeline_status = "IN PROGRESS"}: IProps) {
        this._booking_id = booking_id;
        this._user = user;
        this._environment = environment;
        this._name = name;
        this._startDate = startDate;
        this._endDate = endDate;
        this._reason = reason;
        this._status = STATUS_MESSAGES[status];
        this._pipeline_status = PIPELINE_STATUS_MESSAGES[pipeline_status];
    }

    setId(value: string) {
        this._booking_id = value !== '' ? value : null;
    }

    getId() {
        return this._booking_id;
    }

    setName(value: string) {
        this._name = value !== '' ? value : null;
    }

    getName() {
        return this._name;
    }

    setStartDate(value: number) {
        this._startDate = value ? value : null;
    }

    getStartDate() {
        return this._startDate;
    }

    setEndDate(value: number) {
        this._endDate = value ? value : null;
    }

    getEndDate() {
        return this._endDate;
    }   
    setUser(value: IUser) {
        this._user = value ? value : null;
    }
    getUser() {
        return this._user;
    }
    setEnvironment(value: IEnvironment) {
        this._environment = value ? value : null;
    }
    getEnvironment() {
        return this._environment;
    }
    setReason(value: string) {
        this._reason = value !== '' ? value : null;
    }

    getReason() {
        return this._reason;
    }

    setStatus(value: string) {
        this._status = value ? value : null;
    }

    getStatus() {
        return this._status;
    }

    setPipelineStatus(value: string) {
        this._pipeline_status = value ? value : null;
    }

    getPipelineStatus() {
        return this._pipeline_status;
    }

    getEntityMappings(): IBookingInterface {
        return {
            booking_id: this.getId(),
            user: this.getUser(),
            environment:this.getEnvironment(),
            name: this.getName(),
            startDate: this.getStartDate(),
            endDate: this.getEndDate(),
            reason: this.getReason(),
            status: this.getStatus(),
            pipeline_status: this.getPipelineStatus(),
            created_at: new Date().getTime(),
        };
    }

}
