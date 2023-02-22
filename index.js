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