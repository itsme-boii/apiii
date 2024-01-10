// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const app = express();
// const port = process.env.PORT || 3000;

// app.use(cors());
// app.use(express.json());

// let gameScores = [];
// let sfIds = [];
// let userScores = {};


// app.post('/api/score', (req, res) => {
//     const { newScore ,sfId} = req.body;
//     if (!sfId) {
//         return res.status(400).json({ success: false, message: 'Authentication token is required' });
//     }
//     console.log('Received Score Data:', req.body);
//     console.log(newScore);
//     if (!userScores[sfId]) {
//         userScores[sfId] = [];
//     }

//     userScores[authToken].push(newScore);

//     res.json({ success: true, message: 'Score is Updated', scores: userScores[sfId] });
// });

// app.get('/api/score', (req, res) => {
//     res.json({ score: gameScores });
// });


// // Route to post sfId
// app.post('/api/sfId', (req, res) => {
//     const { sfId } = req.body;

//     if (sfId !== undefined) {
//         sfIds.push(sfId);
//         res.json({ success: true, message: 'sfId is Updated', sfIds });
//     } else {
//         res.status(400).json({ success: false, message: 'Invalid request format' });
//     }
// });

// // Route to get sfIds
// app.get('/api/sfId', (req, res) => {
//     res.json({ sfIds });
// });

// app.post('/api/index', (req, res) => {
//     const { index } = req.body;

//     if (index !== undefined) {
//         global.index = index;
//         res.json({ success: true, message: 'index is Updated', index: global.index });
//     } else {
//         res.status(400).json({ success: false, message: 'Invalid request format' });
//     }
// });

// app.get('/api/index', (req, res) => {
//     res.json( {index} );
// });



// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let userScores = {};
let sfIds = [];
let sfIdMapped={};
let authToken = [];


//this is used to update score
//input score and authtoken 
app.post('/api/score', (req, res) => {
    const { newScore, authToken } = req.body;
    
    if (!authToken) {
        return res.status(400).json({ success: false, message: 'Authentication token is required' });
    }

    console.log('Received Score Data:', req.body);
    console.log(newScore);

    if (!userScores[authToken]) {
        userScores[authToken] = [];
    }

    userScores[authToken].push(newScore);

    res.json({ success: true, message: 'Score is Updated', scores: userScores[authToken] });
});


// this will send all scores from backend to frontend
app.get('/api/score', (req, res) => {
    res.json({ scores: userScores });
});


// this will map my sf id with my authentication token and also this contain array of sfIds
//inputs are sfid and authtoken
app.post('/api/sfId', (req, res) => {
    const { sfId, authToken } = req.body;

    if (!authToken || sfIds.includes(authToken)) {
        return res.status(400).json({ success: false, message: 'Invalid request format or duplicate authToken' });
    }

    sfIds.push(sfId);
    sfIdMapped[authToken]=sfId;
    userScores[authToken] = [];

    res.json({ success: true, message: 'sfId is Updated', sfIds,sfIdMapped });
});


//will get mapped sfids from backend mapping authtoken and my sfid
//will be used by front end
app.get('/api/sfId', (req, res) => {
    res.json({ sfIdMapped });
});


//used by game to post authtoken
app.post('/api/authtoken',(req,res)=>{
    const { authtoken } = req.body;
    authToken.push(authtoken);
    res.json({ success: true, message: 'authtoken updated', authToken });
})

//called by front end to get the authtoken
app.get('/api/authtoken',(req,res)=>{
    res.json({authToken});
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
