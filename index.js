const express = require('express'),
morgan = require('morgan'),
bodyParser = require('body-parser'),
uuid = require('uuid');

const app = express();

// logging requests via morgan
app.use(morgan('common'));

// body-parser
app.use(bodyParser.json());

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

// Return a list of ALL movies to the user
app.get('/movies', (req, res) => {
    res.json(movies);
});

app.get('/users', (req, res) => {
    res.json(users);
});

// Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
app.get('/movies/:title', (req, res) => {
    res.json(movies.find((movie) => {
        return movie.title === req.params.title
    }));
});

// Return data about a genre (description) by name/title (e.g., “Thriller”)
app.get('/genres/:name', (req, res) => {
    res.json(genres.find((genre) => {
        return genre.name === req.params.name
    }));
});
//error handling middleware function
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error detected!');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });