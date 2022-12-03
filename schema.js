const mongo = require("mongoose");

const books = new mongo.Schema({
    user:{type:String,require:true},
    title:{type:String,require:true},
    ISBN:String,
    author:{type:String,require:true},
    description:String,
    publish_date:String,
    published_by:{type:String,require:true}
})

module.exports = mongo.model("books",books);