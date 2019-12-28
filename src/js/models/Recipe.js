import axios from 'axios';
import { urlGetById } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }
    //methods of class Recipe
    async getRecipe() {
        try {
            const res = await axios(`${urlGetById}${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher
            this.image = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            //console.log(error);
            alert(`Recipe.js says: ${error}`);
        }
    }

    calculateCookingTime() {
        //Assuming that we need 15 minutes for each 3 ingredients.
        const numIngredients = this.ingredients.length;
        const periods = Math.ceil(numIngredients / 3);
        this.time = periods * 15;//15 is minutes
    }

    calculateServings() {
        this.servings = 4; //Hardcoding untill we find some algorithm
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'Tbsp', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds', 'liters', 'liter', 'grams', 'gram', 'kilograms', 'kilogram'];
        const unitsShort = ['tbsp', 'tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound', 'liter', 'liter', 'g', 'g', 'kg', 'kg'];
        const newIngredients = this.ingredients.map(element => {
            //Uniform units
            let ingredient = element.toLowerCase();//e.g., Tablespoon becomes tablespoon
            unitsLong.forEach((unit, indexNum) => {
                ingredient = ingredient.replace(unit, unitsShort[indexNum]);//e.g., replacing tablespoon to tsp in this element/ingredient
            });
            //Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' '); //https://repl.it/@anoldwebsite/replace-parentheses-in-string
            //Parse ingredients into count, unit and ingredient e.g. 1 Teaspoon of salt ==> count is 1, unit is Teaspoon and ingredient is salt
            const arrayOfWordsInThisIngredient = ingredient.split(' ');/*
            '1 1/2 Teaspoon of love (if you can find it) otherwise 2 tsp of sexwould do.' would give
            [ '1',  '1/2',  'tsp',  'of', 'love',  'otherwise',  '2',  'tsp', 'of', 'sex', 'would',  'do.' ]
            */
            const indexOfMeasurementUnits = arrayOfWordsInThisIngredient.findIndex(oneWord => unitsShort.includes(oneWord));
            /* 
            "1 1/2 tsp of love (if you can find it) otherwise 2 tsp of sex would do." would give 2 as the index of tsp is 2.
            "1-3/4 tsp of milk (buffallow's milk) thick with 2 1/2 percent cream" would give 1 as the index of tsp is 1.
            "1 1/2 of love (if you can find it) otherwise 2 tsp of sex would do." would give -1 as the function includes(oneWord) can not find any measurement units in the string, so it would return -1 for false. 
            */
            let ingredientObj;
            if (indexOfMeasurementUnits > -1) {
                //units of measurement for the ingredient was found in the string.
                //How many? Is it like 1 tsp or 1 1/2 tsp. In the later case, both at index 0 and index 1, we have a unit.
                //[ '1',  '1/2',  'tsp',  'of', 'love',  'otherwise',  '2',  'tsp', 'of', 'sex', 'would',  'do.' ]
                //Slice starts at index zero and ends at index 1 in the example in the line above.
                const arrCount = arrayOfWordsInThisIngredient.slice(0, indexOfMeasurementUnits);//1 1/2 would become arrCount === [1, 1/2]
                let count;
                if (arrCount.length === 1) {
                    //If the units are written like 1-1/2 instead of 1 1/2 then replace - with +
                    count = eval(arrayOfWordsInThisIngredient[0].replace('-', '+'));
                } else {
                    //Function eval evaluates js code and executes it. Example: Join 1 and 1/2 togther so that it becomes 1.5
                    let stringThatContainsNumbersAndPlusSign = arrayOfWordsInThisIngredient.slice(0, indexOfMeasurementUnits).join('+');//e.g., slice gives [1, 1/2] and then join gives 1+1/2
                    count = eval(stringThatContainsNumbersAndPlusSign);//e.g., eval function will change 1+1/2 to 1.5 
                    if (!count) {
                        count = 1;
                    }
                }
                ingredientObj = {
                    count: count,//e.g., 1 or 1.5 etc.
                    unit: arrayOfWordsInThisIngredient[indexOfMeasurementUnits],//e.g., tsp
                    //[ '1',  '1/2',  'tsp',  'of', 'love',  'otherwise',  '2',  'tsp', 'of', 'sex', 'would',  'do.' ]
                    //Slice starts at index 3 because of  indexOfMeasurementUnits + 1 and ends at the last index. 
                    //join(' ') will make a sentence from the resulting array inserting spaces between each pair of words.
                    //ingredient: tsp of love otherwise 2 tsp of sex would do.
                    ingredient: arrayOfWordsInThisIngredient.slice(indexOfMeasurementUnits + 1).join(' ')
                };
            } else if (parseInt(arrayOfWordsInThisIngredient[0], 10)) {
                //First element i.e., element at index zero in the arrayOfWordsInThisIngredient is a number but no units of measurement e.g., 2 whole eggs or 2 onions.
                ingredientObj = {
                    count: parseInt(arrayOfWordsInThisIngredient[0], 10),
                    unit: '',
                    ingredient: arrayOfWordsInThisIngredient.slice(1).join(' ')//Start slicing the array from index 1 up to the end and then make a string (text with spaces between words) from all the words.
                };
            } else if (indexOfMeasurementUnits === -1) {
                //Unit of measure for the ingredient was not found in the string.
                ingredientObj = {
                    count: 1,//Even if no count was found, we assign 1 to count as the minimum
                    unit: '',
                    ingredient//This is the same as ingredient: ingredient. In ES6 this is a shortcut
                };
            }
            //If an ingredient begins with the word a to represent the quantity of one, delete it.
            if (ingredientObj.ingredient.toLowerCase().startsWith('a ')) {
                ingredientObj.ingredient = ingredientObj.ingredient.substring(2);
            }
            return ingredientObj;//Each iteration of the map function must return.
        });//method map ends here.
        this.ingredients = newIngredients;
    }
}