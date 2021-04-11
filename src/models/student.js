import { BaseClass } from "./baseClass";

export class Student extends BaseClass{
    active = true;
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

    getReq(){
        const student = {
            firstName:this.firstName,
            lastName:this.lastName,
            category:this.category,
            active:this.active
        };

        return student
    }
}