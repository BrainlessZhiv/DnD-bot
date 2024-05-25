const { MongoClient } = require('mongodb');
const { CheckLowestEmptyNoteId } = require('./database.js');

let currentNoteId = 1;

async function SubmitDataToNotes(title, content, imageLink = '') {

	currentNoteId = await CheckLowestEmptyNoteId(currentNoteId);
	const uri = 'mongodb://localhost:27017';
	const client = new MongoClient(uri);

	const data = {
		id: currentNoteId,
		title: title,
		content: content,
		imageLink: imageLink,
	};

	try {
		await client.connect();

		const database = client.db('discord-bot');
		const collection = database.collection('Notes');

		const result = await collection.insertOne(data);
		console.log('Data submitted successfully:', result.insertedId);
	}
	catch (error) {
		console.error('Error submitting data:', error);
	}
	finally {
		await client.close();
	}
}

async function SubmitDataToLoot(data) {
	const uri = 'mongodb://localhost:27017';
	const client = new MongoClient(uri);

	try {
		await client.connect();

		const database = client.db('discord-bot');
		const collection = database.collection('Loot');

		const result = await collection.insertOne(data);
		console.log('Data submitted successfully:', result.insertedId);
	}
	catch (error) {
		console.error('Error submitting data:', error);
	}
	finally {
		await client.close();
	}
}

async function SubmitDataToCharacters(data) {
	const uri = 'mongodb://localhost:27017';
	const client = new MongoClient(uri);

	try {
		await client.connect();

		const database = client.db('discord-bot');
		const collection = database.collection('Characters');

		const result = await collection.insertOne(data);
		console.log('Data submitted successfully:', result.insertedId);
	}
	catch (error) {
		console.error('Error submitting data:', error);
	}
	finally {
		await client.close();
	}
}

module.exports = {
	SubmitDataToNotes,
	SubmitDataToLoot,
	SubmitDataToCharacters,
};