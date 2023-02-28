const express = require('express'),
morgan = require('morgan'),
bodyParser = require('body-parser'),
uuid = require('uuid'),
mongoose = require('mongoose');

// require models.js file
const Models = require('./models.js');

// require models
const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;

mongoose.connect('mongodb://localhost:27017/myFlixDB', {
    useNewUrlParser: true, useUnifiedTopology: true
});

const app = express();

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// importing the auth.js file with login endpoint
let auth = require('./auth')(app);

// logging requests via morgan
app.use(morgan('common'));

// serving all static files from public folder
app.use(express.static(__dirname + '/public'));

// movies JSON object
let movies = [
    {
        title: 'The Godfather',
        director: 'Francis Ford Coppola',
        genre: 'Crime'
    },
    {
        title: 'The Departed',
        director: 'Martin Scorcese',
        genre: 'Thriller'
    },
    {
        title: 'Road to Perdition',
        director: 'Sam Mendes',
        genre: 'Drama'
    },
    {
        title: 'Heat',
        director: 'Michael Mann',
        genre: 'Drama'
    },
    {
        title: 'Casino',
        director: 'Martin Scorsese',
        genre: 'Crime'
    },
    {
        title: 'Goodfellas',
        director: 'Martin Scorsese',
        genre: 'Crime'
    },
    {
        title: 'American Gangster',
        director: 'Ridley Scott',
        genre: 'Drama'
    },
    {
        title: 'Reservoir Dogs',
        director: 'Quentin Tarantino',
        genre: 'Crime'
    },
    {
        title: 'Pulp Fiction',
        director: 'Quentin Tarantino',
        genre: 'Crime'
    },
    {
        title: 'Scarface',
        director: 'Brian De Palma',
        genre: 'Drama'
    }
];

// genres JSON object
let genres = [
    {
        name: 'Drama',
        description: 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.[1] Drama of this kind is usually qualified with additional terms that specify its particular super-genre, macro-genre, or micro-genre,[2] such as soap opera, police crime drama, political drama, legal drama, historical drama, domestic drama, teen drama, and comedy-drama (dramedy).'
    },
    {
        name: 'Thriller',
        description: 'Thriller is a genre of fiction with numerous, often overlapping, subgenres, including crime, horror and detective fiction. Thrillers are characterized and defined by the moods they elicit, giving their audiences heightened feelings of suspense, excitement, surprise, anticipation and anxiety.'
    },
    {
        name: 'Crime',
        description: 'Crime films, in the broadest sense, is a film genre inspired by and analogous to the crime fiction literary genre. Films of this genre generally involve various aspects of crime and its detection. Stylistically, the genre may overlap and combine with many other genres, such as drama or gangster film,[1] but also include comedy, and, in turn, is divided into many sub-genres, such as mystery, suspense or noir.'
    }
];

// directors JSON object
let directors = [
    {
        name: 'Francis Ford Coppola',
        born: 'April 7, 1939',
        bio: "Francis Ford Coppola is an American film director, producer, and screenwriter. He is considered one of the major figures of the New Hollywood filmmaking movement of the 1960s and 1970s.[5] Coppola is the recipient of five Academy Awards, six Golden Globe Awards, two Palmes d'Or, and a British Academy Film Award (BAFTA)."
    },
    {
        name: 'Martin Scorsese',
        born: 'November 17, 1942',
        bio: 'Martin Scorsese is an American film director, producer, screenwriter and actor. Scorsese emerged as one of the major figures of the New Hollywood era. He is the recipient of many major accolades, including an Academy Award, four BAFTA Awards, three Emmy Awards, a Grammy Award, three Golden Globe Awards, and two Directors Guild of America Awards.'
    }
];

// users JSON object
let users = [];

app.get('/', (req, res) => {
    res.send('Welcome to your personal movie collection!');
});

// get all movies
app.get('/movies', (req, res) => {
    Movies.find()
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error ' + err);
    });
});

// get all users
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

// get a user by username
app.get('/users/:Username', (req, res) => {
    Users.findOne({ Username: req.params.Username })
    .then((user) => {
        res.json(user);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// get movie data by title
app.get('/movies/:Title', (req, res) => {
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
// app.get('/genres/:Name', (req, res) => {
//     Genres.findOne({ Name: req.params.Name })
//     .then((genre) => {
//         res.json(genre);
//     })
//     .catch((err) => {
//         console.error(err);
//         res.status(500).send('Error: ' + err);
//     });
// });

// // Return data about a genre (description) by name/title (e.g., “Thriller”)
// app.get('/genres/:name', (req, res) => {
//     res.json(genres.find((genre) => {
//         return genre.name === req.params.name
//     }));
// });

// Return data about a director (bio, birth year, death year) by name
// app.get('/directors/:name', (req, res) => {
//     res.json(directors.find((director) => {
//         return director.name === req.params.name
//     }));
// });

// add a user
/* we'll expect JSON in this format:
{
    ID: Integer,
    Username: String,
    Password: String,
    Email: String,
    Birthday: Date
} */
app.post('/users', (req, res) => {
    Users.findOne({ Username: req.body.Username })
    .then((user) => {
        if(user) {
            return res.status(400).send(req.body.Username + 'already exists');
        } else {
            Users
            .create({
                Username: req.body.Username,
                Password: req.body.Password,
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
app.put('/users/:Username', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
    }
},
{ new: true }, // this line makes sure that the updated document is returned
(err, updatedUser) => {
    if(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    } else {
        res.json(updatedUser);
    }
});
});

// add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $push: { FavoriteMovies: req.params.MovieID }
    },
    { new: true }, // this line makes sure that the updated document is returned
    (err, updatedUser) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

// delete a movie from favorites by title
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
    Movies.findOneAndRemove({ Username: req.params.Username })
    .then((movie) => {
        if (!movie) {
            res.status(400).send(req.params.MovieID + ' was not found.')
        } else {
            res.status(200).send(req.params.MovieID + ' was removed.');
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// delete a user by username
app.delete('/users/:Username', (req, res) => {
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

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });