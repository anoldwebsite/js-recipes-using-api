export const elements = {
    searchForm: document.querySelector('.search'), //<form class="search">
    searchInput: document.querySelector('.search__field'), //<input type="text" class="serach-field">
    searchResultList: document.querySelector('.results__list'),
    searchResultContainer: document.querySelector('.results'),
    searchResultPages: document.querySelector('.results__pages'),//<div class="results__pages"> is the container for pagination buttons in index.html
    recipe: document.querySelector('.recipe'),
    recipeLinks: document.querySelectorAll('.results__link'),
    shopping: document.querySelector('.shopping__list')
};
//We have a separate object defined below for the loader because the loader is not on the page when the page is loaded untill we search for some recipe.
export const elementStrings = {
    loader: 'loader' //class name of the spinner that spins before the recipes are shown to the user.
};
export const renderLoader = parent => {//parent is a reference to the container inside which this child element will live.
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></user>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);//https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
};
export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if(loader){
        loader.parentElement.removeChild(loader);    
    }
};