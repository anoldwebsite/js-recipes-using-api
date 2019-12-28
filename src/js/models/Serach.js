import axios from 'axios';
import { urlQuery } from '../config';

export default class Search {
    //Constructor method
    constructor(query) {
        this.query = query;
    }
    //method of class Search
    async getResults() {
        try {
            const res = await axios(`${urlQuery}${this.query}`);
            this.result = res.data.recipes;
            //console.log(this.result.forEach(element => console.log(`Id: ${element.recipe_id}, Title: ${element.title}`)));
        } catch (error) {
            alert(`Search.js says: ${error}`);
            //To Do ????
            //Handle status 400 page not found and other such errors 
        }
    }
}