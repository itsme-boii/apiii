
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'manyag81@81',
    database: 'gamedb',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

let userScores = {};
let sfIdMapped = {};
let sfid2maxscore = {};

//this is used to update score
//input score and authtoken 
app.post('/api/score', (req, res) => {

    try {
        const { newScore, authtoken } = req.body;

        if (!authtoken) {
            return res.status(400).json({ success: false, message: 'Authentication token is required' });
        }

        console.log('Received Score Data:', req.body);
        console.log(newScore);

        if (!userScores[authtoken]) {
            userScores[authtoken] = [];
        }

        userScores[authtoken].push(newScore);

        res.json({ success: true, message: 'Score is Updated', scores: userScores });
    }
    catch (err) {
        return err;
    }
});


// this will send all scores from backend to frontend
app.get('/api/score', (req, res) => {
    try {
        res.json({ scores: userScores, sfidMappedtoauthtoken: sfIdMapped, maxscore: sfid2maxscore });
    }
    catch (err) {
        return err;
    }
});


// this will map my sf id with my authentication token and also this contain array of sfIds
//inputs are sfid and authtoken
app.post('/api/sfId2authtoken', (req, res) => {
    try {
        const { sfId, authToken } = req.body;

        if (!authToken) {
            return res.status(400).json({ success: false, message: 'Invalid request format or duplicate authToken' });
        }

        sfIdMapped[sfId] = authToken;
        userScores[authToken] = [];

        res.json({ success: true, message: 'sfId is Updated', sfIdMapped });
    }
    catch (err) {
        return err;
    }
});


//will get mapped sfids from backend mapping authtoken and my sfid
//will be used by front end
app.get('/api/sfId2authtoken', (req, res) => {
    try {
        res.json({ sfIdMapped });
    }
    catch (err) {
        return err;
    }
});

//sfid2score
app.post('/api/sfid2score', (req, res) => {
    try {
        const { sfId, maxscore } = req.body;
        if (!sfId) {
            return res.status(400).json({ success: false, message: 'Invalid sfId' });
        }
        sfid2maxscore[sfId] = maxscore;
        const insertQuery = `
            INSERT INTO sfid2score (sfId, maxscore) VALUES (?, ?)
            ON DUPLICATE KEY UPDATE maxscore = ?;
        `;

        db.query(insertQuery, [sfId, maxscore, maxscore], (err, result) => {
            if (err) {
                console.error('Error inserting sfid2score into the database:', err);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            } else {
                console.log('sfid2score inserted or updated successfully');
                res.json({ success: true, message: 'sfId mapped to max score in the database', sfid2maxscore });
            }
        });
    }
    catch (err) {
        return err;
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})