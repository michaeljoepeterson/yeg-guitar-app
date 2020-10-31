export let API_BASE_URL = "https://yeg-guitar-api.herokuapp.com/api";

export let superAdmin = 0;
export let admin = 1;
export let teacher = 2
export let possibleLinks = [
    {
        link:'/create-lesson',
        display:'New Lesson',
        level:2
    },
    {
        link:'/lesson-dash',
        display:'View Lessons',
        level:0
    },
    {
        link:'/create-student',
        display:'Create Student',
        level:1
     },
     {
        link:'/create-type',
        display:'New Class',
        level:1
     },
     {
        link:'/my-lessons',
        display:'My Lessons',
        level:2
     },
     {
        link:'/summary',
        display:'Summary',
        level:1
     },
     {
        link:'/student-lessons',
        display:'Student Lessons',
        level:1
     }
];

//export const API_BASE_URL = 'http://localhost:8080/api';
//set url to test api url
export function setTestUrl(){
    API_BASE_URL = 'https://yeg-guitar-test-server.herokuapp.com/api';
}