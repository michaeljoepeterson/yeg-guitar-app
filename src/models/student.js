import { BaseClass } from "./baseClass";

export class Student extends BaseClass{
    active = null;
    category = [''];
    firstName = '';
    lastName = '';
    fullName = '';
    id = null;
    notes = '';

    constructor(data){
        super();
        if(data){
            this.mapData(data);
        }
    }
}