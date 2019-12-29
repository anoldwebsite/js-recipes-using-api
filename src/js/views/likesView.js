import { elements } from './base';
import { limitRecipeTitle } from './searchView';

export const toggleLikeBtn = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
};

export const toggleLikeMenu = numLikes => {
    elements.likesMenu.style.visibility = (numLikes > 0) ? 'visible' : 'hidden';
};

export const renderLike = like => {
    const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.image}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>
    `;
    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = id => {
    //Select all the LIKED links that has hrefs with the id passed to this function and have been marked as liked.
    const element = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
    /* We select the parent element because we want to delete the list item <li></li> too as
    that is not needed once the anchored/linked text for the previously LIKED item is deleted. */
    if(element){
        //To remove <li></li> move one level up to the parent, <ul></ul>, to be able to remove the child.
        element.parentElement.removeChild(element);
    }
};