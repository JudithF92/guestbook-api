const express = require('express');
const cors = require('cors');
const knex = require('knex');

const dbFunctions = require('./db-functions');

const db = knex({
	client: 'pg',
	connection: {
		host: '127.0.0.1',
		user: 'postgres',
		password: 'hashi',
		database: 'guestbookDB'
	}
});

const app = express();
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {res.send('success')})
app.get('/getmessages', (req, res) => { dbFunctions.handleGetMessages(req, res, db)})
app.post('/createmessage', (req, res) => { dbFunctions.handleCreateMessage(req, res, db)})
app.put('/updatemessage', (req, res) => { dbFunctions.handleUpdateMessage(req, res, db)})
app.delete('/deletemessage', (req, res) => { dbFunctions.handleDeleteMessage(req, res, db)})

app.listen(process.env.PORT || 3001, () => {
	console.log(`app is running on port ${process.env.PORT}`);
})

// / --> res = 'success'
// /getmessages --> GET = messages
// /postmessage --> POST = message
// /changemessage --> PUT = messages
// /deletemessage --> DELETE = messages