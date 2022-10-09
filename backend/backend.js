import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
import cors from 'cors';



//Retrieving credentials, creating URI, Creating client instance
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
const uri = `mongodb+srv://${username}:${password}@cluster0.iklsr8u.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);


app.use(cors());
app.use(express.json());

//To handle the get request for the initial score upon page load
app.get('/getScores', async(req, res) => {
    try {
        await client.connect();
        const rankings = await returnAllRanks(client);
        res.json(rankings); 
    } catch (e) {
        console.error(e)
    } 
})

//To update the score once a new high score has been logged 
app.put('/recordNew', async(req, res) => {
    try {
        await client.connect();
        console.log('Hello! I\'m connected!') 
        const rank = req.body.rank;
        const name = req.body.name;
        const score = req.body.score;
        updateScore(client, rank, {name: name, score: score})
    } catch (e) {
        console.error(e);
    }
})
client.close()

//Retrieving All Ranks from MongoDB
const returnAllRanks = async(client) => {
    const cursor = client.db("tictactoe_scoreboard").collection('rank').find().sort({score: -1});
    const result = await cursor.toArray();
    return result
}

//Updating Name and Score of MongoDB collection
const updateScore = async(client, rank, updateScoreAndName) =>{
    const result = await client.db("tictactoe_scoreboard").collection('rank').updateOne({rank: rank}, {$set: updateScoreAndName});
    console.log(result);
}


//Start server listing on a Dynamic Port or Static Port 3000
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is listening on port: ${process.env.PORT}`)
});
