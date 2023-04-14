const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    mongoose = require('mongoose');

// require models.js file
const Models = require('./models.js');

// express validator
const { check, validationResult } = require('express-validator');

// require models
const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;

// mongoose.connect('mongodb://localhost:27017/myFlixDB', {
//     useNewUrlParser: true, useUnifiedTopology: true
// });

mongoose.connect(process.env.CONNECTION_URI, {
    useNewUrlParser: true, useUnifiedTopology: true
});

const app = express();

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS
const cors = require('cors');

// allow all domains
app.use(cors());

// allow allowedOrigins array
// app.use(cors({
//     origin: (origin, callback) => {
//         if(!origin) return callback(null, true);
//         if(allowedOrigins.indexOf(origin) === -1){ // if a specific origin isn't found on the list
//         let message = "The CORS policy for this application doesn't allow access from origin " + origin;
//         return callback(new Error(message), false);
//         }
//     return callback(null, true);
//     }
// }));

// importing the auth.js file with login endpoint
let auth = require('./auth')(app);

// requiring the passport module and importing passport.js file
const passport = require('passport');
require('./passport');

// logging requests via morgan
app.use(morgan('common'));

// serving all static files from public folder
app.use(express.static(__dirname + '/public'));

// welcome text
app.get('/', (req, res) => {
    res.send('Welcome to your personal movie collection!');
});

// get all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error ' + err);
        });
});

// get all user data
// app.get('/users', (req, res) => {
//     Users.find()
//         .then((users) => {
//             res.status(201).json(users);
//         })
//         .catch((err) => {
//             console.error(err);
//             res.status(500).send('Error: ' + err);
//         });
// });

// get user data by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.json({ Username: user.Username, Email: user.Email });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// get movie data by title
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// get genre data by name
/* app.get('/genres/:Name', (req, res) => {
//     Genres.findOne({ Name: req.params.Name })
//     .then((genre) => {
//         res.json(genre);
//     })
//     .catch((err) => {
//         console.error(err);
//         res.status(500).send('Error: ' + err);
//     });
// });

// Return data about a director (bio, birth year, death year) by name
// app.get('/directors/:name', (req, res) => {
//     res.json(directors.find((director) => {
//         return director.name === req.params.name
//     }));
// });
*/

// add a user
/* we'll expect JSON in this format:
{
    ID: Integer,
    Username: String,
    Password: String,
    Email: String,
    Birthday: Date
} */
app.post('/users',
    // validation logic
    [
        check('Username', 'Username must be at least 5 characters long.').isLength({ min: 5 }),
        check('Username', 'Username contains non-alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ], (req, res) => {

        // check the validation object for errors
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let hashedPassword = Users.hashPassword(req.body.Password);

        Users.findOne({ Username: req.body.Username }) // search to see if username already exists
            .then((user) => {
                if (user) {
                    // if the user is found, send response that it already exists
                    return res.status(400).send(req.body.Username + 'already exists');
                } else {
                    Users
                        .create({
                            Username: req.body.Username,
                            Password: hashedPassword,
                            Email: req.body.Email,
                            Birthday: req.body.Birthday
                        })
                        .then((user) => { res.status(201).json(user) })
                        .catch((error) => {
                            console.error(error);
                            res.status(500).send('Error: ' + error);
                        })
                }
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            });
    });

// update a user's info, by username
/* we'll expect JSON in this format:
{
    Username: String,
    (required)
    Password: String,
    (required)
    Email: String,
    (required)
    Birthday: Date
} */
app.put('/users/:Username',
    // validation logic
    [
        check('Username', 'Username must be at least 5 characters long.').isLength({ min: 5 }),
        check('Username', 'Username contains non-alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ],
    passport.authenticate('jwt', { session: false }), (req, res) => {

        // check the validation object for errors
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let hashedPassword = Users.hashPassword(req.body.Password);

        Users.findOneAndUpdate({ Username: req.params.Username }, {
            $set:
            {
                Username: req.body.Username,
                Password: hashedPassword,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            }
        },
            { new: true }, // this line makes sure that the updated document is returned
            (err, updatedUser) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error: ' + err);
                } else {
                    res.json(updatedUser);
                }
            });
    });

// add a movie to a user's list of favorites
app.put('/users/:Username/movies/:_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $push: { FavoriteMovies: req.params.MovieID }
    },
        { new: true }, // this line makes sure that the updated document is returned
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        });
});

// delete a movie from favorites by title
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $pull: { FavoriteMovies: req.params.MovieID }
    },
        { new: true }, // this line makes sure that the updated document is returned
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        });
});

// delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//error handling middleware function
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error detected!');
});

// listening on current port (enviromental variable)
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on port ' + port);
});