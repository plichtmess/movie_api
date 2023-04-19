const mongoose = require('mongoose'),
    bcrypt = require('bcrypt');

// defining the schema for movie and user documents to keep collections uniform
let movieSchema = mongoose.Schema({
    // additional "required:" property = each user document must have a username field and value must be a string!
    title: { type: String, required: true },
    description: { type: String, required: true },
    // value is a subdocument containing keys for Name and Description/Bio, which have a value of String
    genre: {
        name: String,
        description: String
    },
    director: {
        name: String,
        bio: String
    },
    // key and an array, with the array containing values of a certain data type (all movie documents would have an actors key whose value would be an array of strings)
    actors: [String],
    // simple key (field) value (data type) pair
    imagePath: String,
    featured: Boolean
});

let userSchema = mongoose.Schema({
    // additional "required:" property = each user document must have a username field and value must be a string!
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    birthday: Date,
    // key contains an array of IDs that each refer to a document within the “db.movies” collection. this is done by way of the ref attribute
    favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

//bcrypt
userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.Password);
};

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;