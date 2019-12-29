import { elements } from './base';

export const renderShoppingListItem = item => {
    const markup = `
        <li class="shopping__item" data-itemid=${item.id}>
            <div class="shopping__count">
                <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value" min="0">
                <p>${item.unit}</p>
            </div>
            <p class="shopping__description">${item.ingredient}</p>
            <button class="shopping__delete btn-tiny">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
    `;
    elements.shopping.insertAdjacentHTML('beforeend', markup);
};

export const deleteItemFromUI = id => {
    const itemNode = document.querySelector(`[data-itemid="${id}"]`);//Select the item using its id.
    if(itemNode) itemNode.parentElement.removeChild(itemNode);//We have to move up to the parent level to remove the child.
};
