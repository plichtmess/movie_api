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

// GET requests
app.get('/movies', (reg, res) => {
    res.json(topTenMovies);
});

app.get('/', (req, res) => {
    res.send('Welcome to your personal movie collection!');
});

//error handling middleware function
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error detected!');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });