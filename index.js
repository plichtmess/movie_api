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
        director: 'Francis Ford Coppola'
    },
    {
        title: 'The Departed',
        director: 'Martin Scorcese'
    },
    {
        title: 'Road to Perdition',
        director: 'Sam Mendes'
    },
    {
        title: 'Heat',
        director: 'Michael Mann'
    },
    {
        title: 'Casino',
        director: 'Martin Scorsese'
    },
    {
        title: 'Goodfellas',
        director: 'Martin Scorsese'
    },
    {
        title: 'American Gangster',
        director: 'Ridley Scott'
    },
    {
        title: 'Reservoir Dogs',
        director: 'Quentin Tarantino'
    },
    {
        title: 'Pulp Fiction',
        director: 'Quentin Tarantino'
    },
    {
        title: 'Scarface',
        director: 'Brian De Palma'
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