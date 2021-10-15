import { BaseClass } from "./baseClass";

export class LessonType extends BaseClass{
    name = '';
    active = true;

    constructor(data){
        super();
        if(data){
            this.mapData(data);
        }
    }
}