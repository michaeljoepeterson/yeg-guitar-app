import { BaseClass } from "./baseClass";

export class Lesson extends BaseClass{
    date = null;
    type = null;
    notes = '';
    students = [];
    teacher = null;
    time = null;
    id = null;

    constructor(data){
        super();
        if(data){
            this.mapData(data);
        }

        if(!this.date){
            this.date = new Date();
        }
    }

    getReq(){
        let dateTime  = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), this.time.getHours(), this.time.getMinutes(),0); 
        let data = {
            date:dateTime,
            lessonType:this.lessonType,
            notes:this.notes,
            teacher:this.teacher,
            students:this.students.map(student => student.id),
            id:this.id
        };

        return data;
    }
}