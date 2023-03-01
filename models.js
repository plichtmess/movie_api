const mongoose = require('mongoose'),
bcrypt = require('bcrypt');

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

let userSchema = mongoose.Schema({
    // additional "required:" property = each user document must have a username field and value must be a string!
    Username: {type: String, required: true, unique: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true, unique: true},
    Birthday: Date,
    // key contains an array of IDs that each refer to a document within the “db.movies” collection. this is done by way of the ref attribute
    FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

//bcrypt
userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
};


let genreSchema = mongoose.Schema({
    Name: {type: String, required: true},
    Description: {type: String, required: true}
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
let Genre = mongoose.model('Genre', genreSchema);

module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Genre = Genre;