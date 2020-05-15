export let API_BASE_URL = "https://yeg-guitar-api.herokuapp.com/api";

export let superAdmin = 0;
export let admin = 1;
export let teacher = 2

//export const API_BASE_URL = 'http://localhost:8080/api';
//set url to test api url
export function setTestUrl(){
    API_BASE_URL = 'https://yeg-guitar-test-server.herokuapp.com/api';
}