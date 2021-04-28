export class BaseClass{
    constructor(){
        
    }

    mapData(data){
        let keys = Object.keys(this);
        keys.forEach(key => {
            if(data[key] || data[key] === 0 || data[key] === false){
                this[key] = data[key];
            }
        });
    }
}