const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path'),
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
app.get('/users', (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// get user data by username
app.get('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOne({ username: req.params.username })
        .then((user) => {
            res.json({ username: user.Username, email: user.Email });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// get movie data by title
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ title: req.params.Title })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

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
        check('username', 'Username must be at least 5 characters long.').isLength({ min: 5 }),
        check('username', 'Username contains non-alphanumeric characters - not allowed.').isAlphanumeric(),
        check('password', 'Password is required').not().isEmpty(),
        check('email', 'Email does not appear to be valid').isEmail()
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
app.put('/users/:oldusername', [
    check('username', 'Username must be at least 5 characters long.').isLength({ min: 5 }),
    check('username', 'Username contains non-alphanumeric characters - not allowed.').isAlphanumeric(),
    check('password', 'Password is required').not().isEmpty(),
    check('email', 'Email does not appear to be valid').isEmail()
], passport.authenticate('jwt', { session: false }), (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    function updateUser() {
        let hashedPassword = Users.hashPassword(req.body.password);

        Users.findOneAndUpdate({ username: req.params.oldusername }, {
            $set: {
                username: req.body.username,
                password: hashedPassword,
                email: req.body.email,
                birthday: req.body.birthday
            }
        }, { new: true }, (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        });
    }

    if (req.params.oldusername === req.user.username) {
        if (req.body.username !== req.user.username) {
            Users.findOne({ username: req.body.username }).then(user => {
                if (user) {
                    return res.status(400).send(req.body.username + " already exists");
                } else {
                    updateUser();
                }
            });
        } else {
            updateUser();
        }
    } else {
        res.status(500).send("Unauthorized");
    }
});


// add a movie to a user's list of favorites
app.post('/users/:username/movies/:movieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.params.username === req.user.username) {
        Users.findOneAndUpdate({ username: req.params.username }, {
            $push: { favoriteMovies: req.params.movieID }
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
    } else {
        res.status(500).send("Unauthorized");
    }
});

// delete a movie from favorites by title
app.delete('/users/:username/movies/:movieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.params.username === req.user.username) {
        Users.findOneAndUpdate({ username: req.params.username }, {
            $pull: { favoriteMovies: req.params.movieID }
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
    } else {
        res.status(500).send("Unauthorized");
    }
});

// delete a user by username
app.delete('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.params.username === req.user.username) {
        Users.findOneAndRemove({ username: req.params.username })
            .then((user) => {
                if (!user) {
                    res.status(400).send(req.params.username + ' was not found');
                } else {
                    res.status(200).send(req.params.username + ' was deleted.');
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    } else {
        res.status(500).send("Unauthorized");
    }
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