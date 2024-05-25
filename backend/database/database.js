const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function CheckLowestEmptyNoteId(startNoteId) {
	try {
		await client.connect();

		const database = client.db('discord-bot');
		const collection = database.collection('Notes');

		let currentNoteId = startNoteId;
		let result = await collection.findOne({ id: currentNoteId });

		while (result) {
			currentNoteId++;
			result = await collection.findOne({ id: currentNoteId });
		}

		return currentNoteId;
	}
	catch (error) {
		console.error('Error checking note ID:', error);
	}
	finally {
		await client.close();
	}
}

module.exports = {
	CheckLowestEmptyNoteId,
};