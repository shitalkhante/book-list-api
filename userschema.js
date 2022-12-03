const { hash } = require("bcrypt");
const mongo = require("mongoose");

const user = new mongo.Schema({
   email:{type:String,require:true,unique:true},
   pass:{type:String,require:true}
})

module.exports = mongo.model("user",user);