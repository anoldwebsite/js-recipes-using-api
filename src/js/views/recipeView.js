import { elements } from './base';
import { Fraction } from 'fractional';

export const clearRecipe = () => {
    elements.recipe.innerHTML = '';
};
export const renderError = () => {
    const markup = `
        <h1>The recipe you searched for is not available. We might add it soon!</h1>
    `;
    elements.recipe.insertAdjacentHTML('afterbegin', markup);
};
const formatCount = countRecieved => {

    if (!countRecieved) {
        alert("Method formatcount says: Some problem with the count of the ingredient!");
        return '?';
    }
    const count = Math.round(countRecieved * 10000) / 10000;//Decimal part up to four digits, so 10000
    if (count) {
        //count = 2.5 should give 2 1/2 but 0.5 should give 1/2
        const [integerPart, decimalPart] = count.toString().split('.').map(x => parseInt(x, 10));
        if (!decimalPart) return count;
        if (integerPart === 0) {
            //case count has value like 0.5, 0.9, 0.1 etc.
            const fraction = new Fraction(count);
            return `${fraction.numerator}/${fraction.denominator}`;
        }
        //case where we have both the integer and decimal part e.g., 2.4
        const fraction = new Fraction(count - integerPart);
        return `${integerPart} ${fraction.numerator}/${fraction.denominator}`;
    }
    return '?';
};

const createIngredient = ingredient => `
    <li class="recipe__item">
        <svg class="recipe__icon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__count">${formatCount(ingredient.count)}</div>
        <div class="recipe__ingredient">
            <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.ingredient}
        </div>
    </li>
`;
export const renderRecipe = (recipe, isLiked) => {
    const markup = `
    <figure class="recipe__fig">
        <img src="${recipe.image}" alt="${recipe.title}" class="recipe__img">
        <h1 class="recipe__title">
            <span>${recipe.title}</span>
        </h1>
    </figure>

    <div class="recipe__details">
        <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="img/icons.svg#icon-stopwatch"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
            <span class="recipe__info-text"> minutes</span>
        </div>
        <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="img/icons.svg#icon-man"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
            <span class="recipe__info-text"> servings</span>

            <div class="recipe__info-buttons">
                <button class="btn-tiny btn-decrease">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-minus"></use>
                    </svg>
                </button>
                <button class="btn-tiny btn-increase">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-plus"></use>
                    </svg>
                </button>
            </div>

        </div>
        <button class="recipe__love">
            <svg class="header__likes">
                <use href="img/icons.svg#icon-heart${isLiked ? '' : '-outlined'}"></use>
            </svg>
        </button>
        <button class="recipe__hate">
            <svg class="header__likes">
                <use href="img/icons.svg#icon-circle-with-cross'}"></use>
            </svg>
            <span>Unlike All</span>
        </button>
    </div>

    <div class="recipe__ingredients">
        <ul class="recipe__ingredient-list">
            ${recipe.ingredients.map(oneIngredient => createIngredient(oneIngredient)).join('')}
        </ul>

        <button class="btn-small recipe__btn recipe__btn--add">
            <svg class="search__icon">
                <use href="img/icons.svg#icon-shopping-cart"></use>
            </svg>
            <span>Add to shopping list</span>
        </button>

    </div>
    <div class="recipe__directions">
        <h2 class="heading-2">How to cook it</h2>
        <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
        </p>
        <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
            <span>Directions</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-right"></use>
            </svg>

        </a>
    </div>
    `;
    elements.recipe.insertAdjacentHTML('afterbegin', markup);
};// function renderRecipe ends here.

export const updateServingsIngredients = recipe => {
    //Update servings
    document.querySelector('.recipe__info-data--people').textContent = recipe.servings;
    //Update ingredients
    const countElements = Array.from(document.querySelectorAll('.recipe__count'));
    recipe.ingredients.forEach((oneIngredient, index) => {
        countElements[index].textContent = formatCount(oneIngredient.count);
    });
};