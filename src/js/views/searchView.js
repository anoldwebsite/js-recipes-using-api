import { elements } from './base';
import { recipeNotFound } from './recipeView';
import Recipe from '../models/Recipe';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {//Using the {} to avoid the implicit return statement when one does not use them.
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResultPages.innerHTML = '';//<div class="results__pages"> is the container for buttons
    //Line below I did - ????????????
    elements.recipe.innerHTML = '';//<div class="recipe"> is the container for showing the details of one selected recipe.
};

export const highlightSelected = id => {
    //Remove the previous highlightings first. Loop over all the recipe links in the left side menu and remove highligtings.
    //const recipesLinksArray = Array.from(elements.recipeLinks)  -- does not work.
    const recipesLinksArray = Array.from(document.querySelectorAll('.results__link'));
    recipesLinksArray.forEach(el => {
        el.classList.remove('results__link--active');
    });
    //In the search result, select the link that has id === the id passed to this function. # is part of url for any recipe and id is for the id of the recipe.
    const itemToSelect = document.querySelector(`.results__link[href*="${id}"]`);
    if (itemToSelect) {
        itemToSelect.classList.add('results__link--active');
    }
    //Jonas did the following:
    //document.querySelector('a[href="#${id}"]').classList.add('results__link--active');//Add the class with class name results__link--active to the already existing classes in the DOM.
};

export const highlightSelectedRecipe = (id, prevId = '') => {
    const prevSelectedItem = document.querySelector(`.results__link[href*="${prevId}"]`);
    if (prevId && prevSelectedItem) {//Remove the previous highlighting.
        prevSelectedItem.classList.remove('results__link--active');
    }
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');//Highlight the currently selected recipe.
};

export const limitRecipeTitle = (recipeTitle, limitChar = 17) => {
    const newTitle = [];
    if (recipeTitle.length > limitChar) {
        recipeTitle.split(' ').reduce((accumulator, currentWord) => {
            if (accumulator + currentWord.length <= limitChar) {
                newTitle.push(currentWord);
            }
            return accumulator + currentWord.length;//This line updates the value of accumulator with each iteration.
        }, 0);
        //Make a sentence from the words in the array newTitle
        return `${newTitle.join(' ')} ...`;//The three dots are just a way to show to the user that the title is longer than shown on the UI
    }
    return recipeTitle;
};

const renderOneRecipe = recipe => {
    //Adding a list item to the unordered list (class="results__list") in index.html left column
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);//just inside the UL element after its last child. https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
};
//The following method has been written by me and is not used right now in the app.
/* const renderRandomRecipe = () => {
    //The search term was not found, so showing just a random recipe
    //Adding a list item to the unordered list (class="results__list") in index.html left column
    const markup = `
        <li>
            <a class="results__link" href="#35169">
                <figure class="results__fig">
                    <img src="http://forkify-api.herokuapp.com/images/Buffalo2BChicken2BChowder2B5002B0075c131caa8.jpg" alt="Buffalo Chicken Chowder">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle("Buffalo Chicken Chowder")}</h4>
                    <p class="results__author">Closet Cooking</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);//just inside the UL element after its last child. https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
}; */

//private function to create markup for the next/previous buttons
//type could be either 'prev' or 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>    
    </button>
`;

//Private function - Don't need to export as it will be only used in this file.
const renderPaginationButtons = (pageNum, totalRecipes, recipesPerPage) => {
    const pages = Math.ceil(totalRecipes / recipesPerPage);//Rounding 4.4 to 5 e.g.
    let button;
    if (pageNum === 1 && pages > 1) {
        //Show only next page button
        button = createButton(pageNum, 'next');
    } else if (pageNum < pages) {
        //Show both the next page and previous page button
        button = `
            ${createButton(pageNum, 'prev')}
            ${createButton(pageNum, 'next')}
        `;
    }
    else if (pageNum === pages && pages > 1) {//User is on the last page
        //Show only the previous page button
        button = createButton(pageNum, 'prev');
    }
    elements.searchResultPages.insertAdjacentHTML('afterbegin', button);
};

export const renderRecipes = (recipes, page = 1, recipesPerPage = 10) => {//The anonymous function gets parameter recipes
    //I added the if condition below: ????
    if (recipes) {
        //Render results (i.e., recipes) of current page
        const start = (page - 1) * recipesPerPage;
        const end = page * recipesPerPage;
        recipes.slice(start, end).forEach(renderOneRecipe);//recipes.slice(start, end).forEach(renderOneRecipe);//This code is the same as the commented code below.
        //Render pagination buttons
        renderPaginationButtons(page, recipes.length, recipesPerPage);
    } 
};