// Global app controller
import Search from './models/Serach';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';//Importing * (everything) fom searchView.js and renaming as searchView here.
import * as recipeView from './views/recipeView';//Importing everything as recipeView here.
import * as listView from './views/listView';
import * as likesView from './views/likesView';
/*
Global state of the app
    *** Search object - the object that we get when we search for some recipe
    *** Current recipe object - the recipe that we searched.
    *** Shopping list object - The items that we have added to the shopping cart
    *** Liked recipes - The recipes that we have marked as liked.
*/
const state = {};
//Testing starts
//window.state = state;
//Testing ends
//********************************************* */
//Search controller
//********************************************* */
const controlSearch = async () => {
    //Get query form the view (UI)
    const query = searchView.getInput(); //Getting the search term from the search form on the UI
    if (query) {
        //Make a new search object and add it to the object state
        state.search = new Search(query.toLowerCase());
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
    //************************************************ */
    //These steps were required before we wrote the code for persisting data in the local storage of the broswer.
    //const numLikes = (state.likes) ? state.likes.getNumLikes() : 0;
    //likesView.toggleLikeMenu(numLikes);//Delete this and the line above after browser persistance step ?????
    //************************************************ */
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
            //console.log(state.recipe);
            //parse ingredients by calling the method in the model class Recipe in file Recipe.js
            state.recipe.parseIngredients();
            //Calculate servings and recipe preparation time
            state.recipe.calculateCookingTime();//This will populate the property this.time for object recipe.
            state.recipe.calculateServings();//This will populate the property this.servings of object recipe.
            //Render recipe
            //console.log(state.recipe);
            clearLoader();
                //************************************************ */
                //These steps were required before we wrote the code for persisting data in the local storage of the broswer.
                //const isLikedAlready = (state.likes) ? state.likes.isLiked(id) : false;//Delete this line after browser persistence
                //recipeView.renderRecipe(state.recipe, isLikedAlready);
            //************************************************ */
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        } catch (error) {
            alert(`index.js says: ${error}`);
        }
    }
};

//Attaching two or more events to the event listener when they call the same function.
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//********************************************* */
//List controller -- Manages the Shopping list 
//********************************************* */
const controlList = () => {
    //Create a new Shopping list if thre is none.
    if (!state.list) {
        state.list = new List();
    }

    state.recipe.ingredients.forEach(element => {
        //Add each ingredient to the list
        const item = state.list.addItem(element.count, element.unit, element.ingredient);
        //Add each ingredient to the User Interface.
        listView.renderShoppingListItem(item);
        //listView.rednerItem(item);
    });

};//controlList ends here.

//********************************************* */
//Like controller -- Manages the likes menu and the heart shaped button for likes. 
//********************************************* */
const controlLike = () => {
    if (!state.recipe) return;
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    if (!state.likes.isLiked(currentID)) {
        //User has not liked the current recipe
        //Add like to the state object
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.image
        );
        //Togle the heart shaped button on the UI
        //likesView.toggleLikeBtn(state.likes.isLiked(currentID));
        //Add like to the UI list
        likesView.renderLike(newLike);
        //console.log(state.likes);
    } else {
        //User has already liked the current recipe
        //Remove like from the state object
        state.likes.deleteLike(currentID);
        //Togle the heart shaped button on the UI
        //likesView.toggleLikeBtn(state.likes.isLiked(currentID));
        //Remove like from UI list
        likesView.deleteLike(currentID);
        //console.log(state.likes);
    }
    likesView.toggleLikeBtn(state.likes.isLiked(currentID));
    likesView.toggleLikeMenu(state.likes.getNumLikes());
}
//********************************************* */

//Handle delete and update list item events.
elements.shopping.addEventListener('click', e => {
    //Get the id of the item on the shopping list that got the click
    const id = e.target.closest('.shopping__item').dataset.itemid;
    //Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        //Delete the item form the state object state={};
        const deletedItem = state.list.deleteItem(id)
        //Delete the item from the UI
        if (deletedItem) listView.deleteItemFromUI(id);
    } else if (e.target.matches('.shopping__count-value')) {
        const newValue = parseFloat(e.target.value, 10);//10 means decimal system of numbers.
        state.list.updateCount(id, newValue);
    }

});
//****************************************************************************************** */
//Restore LIKED recipes on page load from the local storage of Browser, saved by us formerly.
//****************************************************************************************** */
window.addEventListener('load', () => {
    state.likes = new Likes();//Creating a new object of type Likes() in the file Likes.js
    state.likes.readDataFromBrowserStorage();//Restoring likes from the Broswer local storage.
    //Toggle the likes menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    //Render the existing likes so that the user can see them in the likes menu and click on them.
    //state.likes.likes is an array in the class Likes in file Likes.js and it stores likes.
    for (const like of state.likes.likes) {
        likesView.renderLike(like);
    }
});
//****************************************************************************************** */
/* By the time we load the page, the buttons + and - to increase/decrease the ingredients 
and the buttons to increase/decrease count of items in the shopping list are 
not there. So, we have to use event delegation. Since the recipe element is there at
the load time, and we can attach the event to it and then use the target propery of the
 event to find out if + was clicked or -. */
//Handling recipe button + and - clicks
elements.recipe.addEventListener('click', e => {//e is for event
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {//* means any child of .btn-decrease element
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');//updateSErvings is method of class Recipe in Recipe.js
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        if (state.recipe.servings < 10) {//This app allows up to 10 servings
            state.recipe.updateServings('inc');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {//* means any sub class of class .recipe__btn--add
        controlList();//Add ingredients to shopping list.
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();//Add recipe to likes.
    }
}
);

//window.list = new List();//For testing go to console in browser and test creating an item and then deleting/updating.