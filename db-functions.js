const handleGetMessages = (req, res, db) => {
    db.select('id', 'name', 'text', 'date', 'edited')
        .from('messages')
        .orderBy('id', 'desc')
        .then(messages => {
            res.json(messages);
        })
        .catch(err => res.status(400).json('unable to get messages'))
}

const handleCreateMessage = (req, res, db) => {
	if (req.body.name !== '' && req.body.text !== ''){
		const { name, text } = req.body;
		db('messages')
			.returning(['id', 'name', 'text', 'date', 'edited'])
			.insert({
				name: name,
				text: text,
				date: new Date(),
				edited: null
			})
			.then(message => {
				res.json(message[0]);
			})
			.catch(err => res.status(400).json('unable to store message'))
	} else {
		res.status(400).json('invalid input');
	}	
}

const handleUpdateMessage = (req, res, db) => {
    if (req.body.text !== ''){
		const { id, text } = req.body;
		db('messages').where({id})
			.update({ 
				text: text,
				edited: new Date()
			 })
			.then(() => handleGetMessages(req, res, db))	
			.catch(err => res.status(400).json('unable to edit message'))
	}
}

const handleDeleteMessage = (req, res, db) => {
    const { id } = req.body;
	db('messages')
		.where({id})
		.del()
		.then(() => handleGetMessages(req, res, db))
		.catch(err => res.status(400).json('unable to delete message'))
}

module.exports = {
    handleGetMessages: handleGetMessages,
    handleCreateMessage: handleCreateMessage,
    handleUpdateMessage: handleUpdateMessage,
    handleDeleteMessage: handleDeleteMessage
}