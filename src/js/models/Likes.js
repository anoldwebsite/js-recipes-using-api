export default class Likes {
    constructor() {
        this.likes = [];
    }
    addLike(id, title, author, image) {
        //Make a like object
        const like = {
            id, //This is the same as this.like = like;
            title,
            author,
            image
        };
        this.likes.push(like);
        //Save this like in the Broswer local storage
        this.persistData();
        return like;
    }
    deleteLike(id) {
        const index = this.likes.findIndex(element => element.id === id);
        if (index !== -1) {//Item was found in the likes array.
            this.likes.splice(index, 1);//1 means remove one item.
            //Save this like in the Broswer local storage
            this.persistData();
        }
    }
    getNumLikes() {
        return this.likes.length;
    }
    isLiked(id) {//-1 !== -1 is false, so the item is not liked.
        return (this.likes.findIndex(element => element.id === id)) !== -1;//Returns true or false
    }
    persistData() {
        //Store likes array in JSON format in the browser for persistence
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }
    readDataFromBrowserStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        //Restoring likes from the local storage (Browser storage)
        if (storage) {
            //If storage is not null i.e., there are some likes for some recipes that were earlier stored in the local storage
            this.likes = storage;
        }
    }
}//class Likes ends here.