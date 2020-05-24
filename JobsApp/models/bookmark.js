const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var bookmarkSchema = new Schema({
    _id : {
        type: mongoose.Schema.Types.ObjectId,
        default: new mongoose.Types.ObjectId() 
    },
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    bookmarks: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Jobs"
        },
        description: {
            type: String,
            ref: "Jobs"
        },
        bookmarkType : {
            type: String, // general / apply_later
        }        
    }]

});

var Bookmark = mongoose.model("bookmarks", bookmarkSchema);
module.exports = Bookmark;