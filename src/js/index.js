// Global app controller
import Search from './models/Serach';
import Recipe from './models/Recipe';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';//Importing * (everything) fom searchView.js and renaming as searchView here.
import * as recipeView from './views/recipeView';//Importing everything as recipeView here.
/*
Global state of the app
    *** Search object - the object that we get when we search for some recipe
    *** Current recipe object - the recipe that we searched.
    *** Shopping list object - The items that we have added to the shopping cart
    *** Liked recipes - The recipes that we have marked as liked.
*/
const state = {};

//********************************************* */
//Search controller
//********************************************* */
const controlSearch = async () => {
    //Get query form the view (UI)
    const query = searchView.getInput(); //Getting the search term from the search form on the UI
    if (query) {
        //Make a new search object and add it to the object state
        state.search = new Search(query);
        //Prepare UI for the result
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResultContainer);//renderLoader is a function in the file base.js
        try {
            //Search for recipes
            await state.search.getResults();
            //Render results on UI
            clearLoader();//imported above from base.js //Clear the spinning loader
            if (state.search.result) {
                searchView.renderRecipes(state.search.result);
            }

        } catch (error) {
            //console.log(error);
            alert(`index.js says: ${error}`);
            clearLoader();//imported above from base.js //Clear the spinning loader
        }

    }
};
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault(); //Prevents navigating to another page when the Search button is clicked
    controlSearch();
});
//We can not attach event listner to the pagination buttons as they are not there when the page loads, so
//we attach it to the parent container which has a class of '.results__pages' and there we see recipes too.
elements.searchResultPages.addEventListener('click', e => {
    //What was clicked in that container that has a class '.results__pages'
    //To find that out, we use the method closest so that we can get hold of the button that has a class '.btn-inline'
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        //10 is for base ten to parse the string to integer
        const goToPage = parseInt(btn.dataset.goto, 10);// <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        searchView.clearResults();
        searchView.renderRecipes(state.search.result, goToPage);//10 means show ten recipes per page
    }
});
//********************************************* */
//Recipe controller
//********************************************* */
const controlRecipe = async () => {
    //window.location is the entire url. We want the id which is in the hash part, so window.location.hash.replace
    //
    const id = window.location.hash.replace('#', '');

    if (id) {
        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);//We pass the parent for the loader which is the one with the class name 'recipe' in file index.html

        if (state.recipe) {
            searchView.highlightSelectedRecipe(id, state.recipe.id);
        } else if (state.search) {//We can select a searched item, once a user has searched a recipe, so if(state.search)
            searchView.highlightSelectedRecipe(id); //Highlight selected search item/recipe.
        }

        //Create new Recipe object
        state.recipe = new Recipe(id);//Passing id of the recipe that we want to search to the constructor.

        try {
            //Get recipe data
            // getRecipe() method of class Recipe in file Recipe.js will populate the recipe object properties: title, author, image, url and ingredients
            await state.recipe.getRecipe();//We need it inside a try catch block in case getRecipe() promise results in reject instead of resolve.
            console.log(state.recipe);
            //parse ingredients by calling the method in the model class Recipe in file Recipe.js
            state.recipe.parseIngredients();
            //Calculate servings and recipe preparation time
            state.recipe.calculateCookingTime();//This will populate the property this.time for object recipe.
            state.recipe.calculateServings();//This will populate the property this.servings of object recipe.
            //Render recipe
            //console.log(state.recipe);
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch (error) {
            alert(`index.js says: ${error}`);
        }
    }
};

//Attaching two or more events to the event listener when they call the same function.
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
