const express = require('express'),

const app = express();

// serving all static files from public folder
app.use(express.static(__dirname + '/public'));

// top 10 movies JSON object
let topTenMovies = [
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

