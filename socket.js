const Socket = require('socket.io');
const Deal = require('./deal');

const numPlayers = 4;  // Sets number of players in game.



let user = function(name, socketID)
{
	this.ID = socketID;
	this.name = name;
	this.room = "Main";
	this.hand = [];
	this.position;  //(p)layer,  (s)toryteller or (o)bserver *May not need
	this.score = 0;
}

//ALL users in room
let users = []

// Only User who are playing
let players = []

let currentClue = {
	card: null,
	clue: null
};

// stores index of players array of user who is current storyteller;
let storyteller;

let currentRound = 1;

module.exports = function (server){

	//envokes socket.io
	const IO = Socket(server);

	//listens for connection then executes callback
	IO.on("connection", OnConnection );

	// callback function for IO.on
	function OnConnection(socket)
	{
		//listens for incoming data from user on socket.
		socket.on("message", emitMessage);
		socket.on("name", saveName);
		socket.on("disconnect", disconnect);
		socket.on("clue", getClue);
		
		//emits message from user in room to others in room.
		function emitMessage(data)
		{		
			// finds and saves user by socket.id
			let currentUser = getUserByID(socket.id);

			//get room user is in
			let room = currentUser.room;
			data.name = currentUser.name;

			//this send the data globally (to everyone) in room
			IO.sockets.in(room).emit("message", data);
		}

		// instantiates new user with name and socket.id and saves to user array.
		// Pushes first 'numPlayers' to players array.
		// When players array has corrent number of users, deals cards
		// All other players joining room will be observers.  
		function saveName(name)
		{
			let newUser = new user(name, socket.id)

			users.push(newUser);	

			if(players.length < numPlayers)
			{
				players.push(newUser);
				
				if (players.length === numPlayers){
					Deal.deal(players);
					sendHandToPlayers();
				}
			}
			else
			{
				IO.sockets.in(socket.id).emit("hand", "observer");
			}	
			
			joinRoom();
		}

		// joins user to room
		function joinRoom()
		{	
			let room = "Main";
			
			// joins user 'socket' to room.
			socket.join(room);

			// this code just gets user to send to client to display
			// 'hello ___ welcome to the ____ room' in the front-end chat-box.			
			let user = getUserByID(socket.id)			
			let data = {};
			data.name = user.name;
			data.room = user.room;
			IO.sockets.in(socket.id).emit("room", data);
									
		}

		//if a user disconnect their username is out with message.
		function disconnect()
		{
			// could add code to remove user from users when disconnected.
			console.log(getUserByID(socket.id).name, 'disconnected');
		}

		//emits to each user their dealt hand
		function sendHandToPlayers()
		{
			for(let i = 0; i < players.length; i++)
			{
				let user = players[i];
				IO.sockets.in(user.ID).emit("hand", user.hand);
			}	
		}

		// when clue is sent to socket this is done.
		function getClue(data)
		{
			let room = "Main";
			
			currentClue.card = data.card;
			currentClue.clue = data.clue;
			
			IO.sockets.in(room).emit("clue", data.clue);
			
			
		}


	}//END OnConnection

	function getUserByID(id)
	{
		for(var i = 0; i < users.length; i++)
		{
			if(users[i].ID == id)
				return users[i];
		}	
		return "Anonymous"
	}

	
}// END module.exports

/*
	Dont need any more.  Use players array instead.

	// returns number of users in room 
	function usersInRoom(room)
	{
		let usersInRoom = Object.keys(IO.sockets.adapter.rooms[room].sockets);
		console.log("users in room", usersInRoom.length);
		return usersInRoom.length;
	}

*/		