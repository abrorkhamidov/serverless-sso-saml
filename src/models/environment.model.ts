import { v4 as UUID } from 'uuid';

// Interfaces
interface IProps {
    environment_id: string;
    name: string;
    version: string;
    author: IAuthor;
    status: string;
    cost: number;
    costDescription: string;
    type: string;
    vendor: string;
    product: string;
    image_small: string;
    images: Array<string>;
    tags:Array<string>;
    documents: Array<string>;
    pipeline_details: IPipelineDetails
}

interface IAuthor {
    user_id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

interface IPipelineDetails {
    token: string;
    pipeline_link: string;
    ref: string;
}


interface IEnvironmentInterface extends IProps {
    created_at: number;
}

enum Status {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    STOPPED = 'STOPPED',
}

const STATUS_MESSAGES = {
    "DRAFT": Status.DRAFT,
    "PUBLISHED": Status.PUBLISHED,
    "STOPPED": Status.STOPPED
}
export default class EnvironmentModel {

    private _environment_id: string;
    private _name: string;
    private _version: string;
    private _author: IAuthor;
    private _status: string;
    private _cost: number;
    private _costDescription: string;
    private _type: string;
    private _vendor: string;
    private _product: string;
    private _image_small: string;
    private _images: Array<string>;
    private _tags: Array<string>;
    private _documents: Array<string>;
    private _pipeline_details: IPipelineDetails;


    constructor({environment_id = UUID(), name = '', version = '',author, status = "DRAFT", cost = 0, costDescription = '', type = '', vendor = '', product = '', image_small = '',images = [], tags = [], documents = [],pipeline_details}: IProps) {
        this._environment_id = environment_id;
        this._name = name;
        this._version = version;
        this._author = author;
        this._status = STATUS_MESSAGES[status];
        this._cost = cost;
        this._costDescription = costDescription;
        this._type = type;
        this._vendor = vendor;
        this._product = product;
        this._image_small = image_small;
        this._images = images;
        this._tags = tags;
        this._documents = documents;
        this._pipeline_details = pipeline_details;
    }

    setId(value: string) {
        this._environment_id = value !== '' ? value : null;
    }

    getId() {
        return this._environment_id;
    }

    setName(value: string) {
        this._name = value !== '' ? value : null;
    }

    getName() {
        return this._name;
    }

    setVersion(value: string) {
        this._version = value !== '' ? value : null;
    }

    getVersion() {
        return this._version;
    }

    setStatus(value: string) {
        this._status = value ? value : null;
    }

    getStatus() {
        return this._status;
    }

    setCost(value: number) {
        this._cost = value ? value : null;
    }
    getCost() {
        return this._cost;
    }

    setCostDescription(value: string) {
        this._costDescription = value ? value : null;
    }
    getCostDescription() {
        return this._costDescription;
    }
    
    setAuthor(value: IAuthor) {
        this._author = value ? value : null;
    }
    getAuthor() {
        return this._author;
    }

    setType(value: string) {
        this._type = value ? value : null;
    }

    getType() {
        return this._type;
    }
    
    setVendor(value: string) {
        this._vendor = value ? value : null;
    }

    getVendor() {
        return this._vendor;
    }

    setProduct(value: string) {
        this._product = value ? value : null;
    }

    getProduct() {
        return this._product;
    }

    setImageSmall(value: string) {
        this._image_small = value ? value : null;
    }

    getImageSmall() {
        return this._image_small;
    }

    setImages(value: Array<string>) {
        this._images = value ? value : [];
    }

    getImages() {
        return this._images;
    }
    setTags(value: Array<string>) {
        this._tags = value ? value : [];
    }

    getTags() {
        return this._tags;
    }
    setDocuments(value: Array<string>) {
        this._documents = value ? value : [];
    }

    getDocuments() {
        return this._documents;
    }

    setPipelineDetails(value: IPipelineDetails) {
        this._pipeline_details = value ? value : null;
    }
    getPipelineDetails() {
        return this._pipeline_details;
    }

    getEntityMappings(): IEnvironmentInterface {
        return {
            environment_id: this.getId(),
            name: this.getName(),
            version: this.getVersion(),
            author: this.getAuthor(),
            status: this.getStatus(),
            cost: this.getCost(),
            costDescription: this.getCostDescription(),
            type: this.getType(),
            vendor: this.getVendor(),
            product: this.getProduct(),
            image_small: this.getImageSmall(),
            images: this.getImages(),
            tags: this.getTags(),
            documents: this.getDocuments(),
            pipeline_details: this.getPipelineDetails(),
            created_at: new Date().getTime(),
        };
    }

}
