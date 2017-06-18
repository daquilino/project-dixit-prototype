const Socket = require('socket.io');

let user = function(name, socketID)
{
	this.ID = socketID;
	this.name = name;
	this.room = "Main";
	this.hand = [];
}

let users = [];

const Deal = require('./deal');

module.exports = function (server){

	//envokes socket.io
	const IO = Socket(server);

	//listens for connection then executes callback
	IO.on("connection", OnConnection );

	// callback function for IO.on
	function OnConnection(socket)
	{
		//listens for incoming data named "message" from client
		socket.on("message", getMessage);

		socket.on("name", saveName);

		socket.on("disconnect", disconnect);
		
		function getMessage(data)
		{		
			// finds and saves user by socket.id
			let currentUser = getUserByID(socket.id);

			//get room user is in
			let room = currentUser.room;
			data.name = currentUser.name;

			//this send the data globally (to everyone) in room
			IO.sockets.in(room).emit("message", data);
		}

		function saveName(name)
		{
			users.push(new user(name, socket.id));
			joinRoom();
		}

		function joinRoom()
		{	
			let room = "Main";
			socket.join(room);
			
			// gets user by socket.id
			let user = getUserByID(socket.id)
			
			let data = {};
			data.name = user.name;
			data.room = user.room;

			IO.sockets.in(socket.id).emit("room", data);

			if (usersInRoom(room) === 3){
				Deal.deal(users);
				sendHandToPlayers();
			}
		}

		//if a user disconnect their username is out with message.
		function disconnect()
		{
			// could add code to remove user from users when disconnected.
			console.log(getUserByID(socket.id).name, 'disconnected');
		}

		// returns number of users in room
		function usersInRoom(room)
		{
			let usersInRoom = Object.keys(IO.sockets.adapter.rooms[room].sockets);
			console.log("users in room", usersInRoom.length);
			return usersInRoom.length;
		}


		//emits to each user their dealt hand
		function sendHandToPlayers(){
			for(let i = 0; i < users.length; i++)
			{
				let user = users[i];
				IO.sockets.in(user.ID).emit("hand", user.hand);
			}	

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

