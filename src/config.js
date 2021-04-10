export let API_BASE_URL = "https://yeg-guitar-test-server.herokuapp.com/api";
//export let API_BASE_URL = "http://localhost:8080/api";

export let superAdmin = 0;
export let admin = 1;
export let teacher = 2
export let possibleLinks = [
    {
      link:'/my-lessons',
      display:'My Lessons',
      level:2,
      query:{
        name:'teacher'
      }
    },
    {
      link:'/create-lesson',
      display:'New Lesson',
      level:2
    },
    {
      link:'/student-lessons',
      display:'Students',
      level:2
    },
    {
      link:'/summary',
      display:'Summary',
      level:2
    },
    {
      display:'Create',
      level:1,
      sublinks:[
        {
          link:'/create-student',
          display:'New Student'
        },
        {
          link:'/create-type',
          display:'New Class Type'
        }
      ]
    }
];

//export const API_BASE_URL = 'http://localhost:8080/api';
//set url to test api url
export function setTestUrl(){
    API_BASE_URL = 'https://yeg-guitar-test-server.herokuapp.com/api';
}