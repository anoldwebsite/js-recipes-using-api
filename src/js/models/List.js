import uniqid from 'uniqid';

export default class List {
    constructor(){
        this.items = [];
    }

    addItem(count, unit, ingredient){
        const item = {
            id: uniqid(),
            count, //same as this.count = count
            unit,
            ingredient
        };
        this.items.push(item);
        return item;
    }

    deleteItem(id){
        const index = this.items.findIndex(element => element.id === id);
        if(index !== -1) {
            const deletedItem =  this.items.splice(index, 1);//Item deleted is returned. 1 means delte one item.
            return deletedItem;
        };
        return "";//Item was not deleted and not found.
        //mutates the original array [2,4,6].splice(1,2) returns [4,6] and the array mutates to [2]
        //mutates the original array [2,4,6].spice(1,2) returns [4] and does not mutate the original array.
    }

    updateCount(id, newCount){
        this.items.find(element => element.id === id).count = newCount;
    }
}