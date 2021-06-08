const express = require('express');
const cors = require('cors');
const knex = require('knex');

const app = express();

app.get('/', (req, res) => {
	res.send('success');
})

app.listen(process.env.PORT || 3001, () => {
	console.log(`app is running on port ${process.env.PORT}`);
})

// / --> res = success
// /postmessage --> POST = messageData
// /changemessage --> PUT = messageText/dateOfChange
// /deletemessage --> DELETE = messageID