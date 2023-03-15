export default function buildQuery(options,ignoreList){
    let query = '?';
    ignoreList = ignoreList ? ignoreList : [];
    for(let key in options){
        if(options[key] && !ignoreList.includes(key)){
            query += `${key}=${options[key]}&`;
        }   
    }
    query = query.substring(0, query.length - 1);
    return query;
}