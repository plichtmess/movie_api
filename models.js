const mongoose = require('mongoose');

// defining the schema for movie and user documents to keep collections uniform
let movieSchema = mongoose.Schema({
    // additional "required:" property = each user document must have a username field and value must be a string!
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    // value is a subdocument containing keys for Name and Description/Bio, which have a value of String
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String
    },
    // key and an array, with the array containing values of a certain data type (all movie documents would have an actors key whose value would be an array of strings)
    Actors: [String],
    // simple key (field) value (data type) pair
    ImagePath: String,
    Featured: Boolean
});

