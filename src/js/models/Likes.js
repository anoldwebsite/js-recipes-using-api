export default class Likes{
    constructor(){
        this.likes = [];
    }
    addLike(id, title, author, image){
        //Make a like object
        const like = {
            id, //This is the same as this.like = like;
            title,
            author,
            image
        };
        this.likes.push(like);
        return like;
    }
    deleteLike(id){
        const index = this.likes.findIndex(element => element.id === id);
        if(index !== -1){//Item was found in the likes array.
            this.likes.splice(index, 1);//1 means remove one item.
        }
    }
    getNumLikes(){
        return this.likes.length;
    }
    isLiked(id){//-1 !== -1 is false, so the item is not liked.
        return ( this.likes.findIndex(element => element.id === id) ) !== -1;
    }
}//class Likes ends here.