const express = require('express');
const cors = require('cors');
const knex = require('knex');

const db = knex({
	client: 'pg',
	connection: {
		connectionString : process.env.DATABASE_URL,
		ssl: true
	}
});

const app = express();
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
	res.send('success')
})

app.get('/getmessages', (req, res) => {
	db.select('*').from('messages')
		.orderBy('id')
		.then(messages => {
			res.json(messages);
		})
		.catch(err => res.status(400).json('unable to get messages'))
})

app.post('/postmessage', (req, res) => {
	if (req.body.name !== '' && req.body.text !== ''){
		const { name, text } = req.body;
		db('messages')
			.returning('*')
			.insert({
				name: name,
				text: text,
				date: new Date(),
				edited: null
		})
		.orderBy('id')
		.then(message => {
			res.json(message[0]);
		})
		.catch(err => res.status(400).json('unable to store message'))
	} else {
		res.status(400).json('invalid input');
	}	
})

app.put('/changemessage', (req, res) => {
	if (req.body.text !== ''){
		const { id, text } = req.body;
		db('messages').where({id})
			.update({ 
				text: text,
				edited: new Date()
			 })
			.then(() => {
				db.select('*').from('messages')
					.orderBy('id')
					.then(messages => {
						res.json(messages);
					})
			})	
			.catch(err => res.status(400).json('unable to change message'))
	}
})

app.delete('/deletemessage', (req, res) => {
	const { id } = req.body;
	db('messages')
		.where({id})
		.del()
		.then(() => {
			db.select('*').from('messages')
				.orderBy('id')
				.then(messages => {
					res.json(messages);
				})
		})
		.catch(err => res.status(400).json('unable to delete message'))
})

app.listen(process.env.PORT || 3001, () => {
	console.log(`app is running on port ${process.env.PORT}`);
})

// / --> res = messages
// /postmessage --> POST = message
// /changemessage --> PUT = messages
// /deletemessage --> DELETE = messages