// Set up Socket.io variable
var	socket = io.connect(window.location.href);// gets location from window object


// 1- receive start
// 2- receive users hand of cards
// 3- receive who is story teller
// 4- receive story teller submission request
// 5- send story teller submissions
// 6- receive clue
// 7- receive player submissions request
// 8- send player submissions
// 9- receive scoring info
// 10- send finished displaying score
// 11- receive start new turn


// Socket.io Event Listeners
socket.on( "gameStart", gameStart );
socket.on( "initialHand", initialHand );
socket.on( "storyTeller", storyTeller );
socket.on( "storyTellerSubReq", storyTellerSubReq );
socket.on( "getClue", getClue );
socket.on( "playerSubReq", playerSubReq );
socket.on( "scoring", scoring );
socket.on( "newTurn", newTurn );



function gameStart(data) {
	// set up initial state for the play area and score board
	// Set up other players, like name colors and position
	// Set up the scoreboard
	//
}

function initialHand(data) {
	// give the player the cards in their hand and display them
}

function storyTeller(data) {
	// inform the room who is the storyteller for the round
}

function storyTellerSubReq(data) {
	// display the storyteller prompts and send to the backend
	// socket.emit('storyTellerChoices', data);
}

function getClue(data) {

}

function playerSubReq(data) {

}

function scoring(data) {
	// Update the scoreboard
}

function newTurn(data) {

}




































// Socket.io Event Listeners
socket.on("message", addToChat );
socket.on("room", displayRoom );
socket.on("hand", createHand);



//on click function
$('#message-form').submit(function(e){
	e.preventDefault();
	let message = $("#message").val().trim();	
	$("#message").val('');
	postMessage(message);
	
});

// handles log-in submit event.
$('#log-in').submit(function(e){
	e.preventDefault();
	let name = $("#log-in-name").val().trim();
	postName(name);
	$('#log-in').hide();
	$('#message-form').css("display", "initial");

	
});

//function to sent to server
function postMessage(message)
{
	let data = {
		text: message
	};
	//this sends the data object to the server with the name "message"
	socket.emit('message', data);
}

function postName(name)
{
	//sends user input name to socket
	socket.emit('name', name);
	
}


function addToChat(message)
{

	let p = $('<p>');
	p.html(message.name + "> "+ message.text);
	$("#chat-box").append(p);

	//this adjusts scroll to bottom of div.
 	let elem = document.getElementById('chat-box');
 	elem.scrollTop = elem.scrollHeight;

 	/*
	 	//Same as above but using Jquery.
	 	// .scrollHeight is a js property. so to get it in jquery we use .prop()
	 	let elem = $("#chat-box");
	 	elem.scrollTop(test.prop('scrollHeight'));
 	*/	
}

function displayRoom(data)
{
	
	let p = $('<p style="text-align: center">');
	p.html("Hello " + data.name + " welcome to the " + data.room + " room.");
	$("#chat-box").append(p);

	//this adjusts scroll to bottom of div.
 	let elem = document.getElementById('chat-box');
 	elem.scrollTop = elem.scrollHeight;
}


$('.card').on('click', function(){
	console.log("clicked", $(this).attr('id'));
});

// array of cards comes in.
function createHand(hand){
	
	console.log("hand", hand); //TEST CODE

	for(let i = 0; i < hand.length; i++)
	{
		let card = $('<div>');
		card.addClass('col-xs-2 card');
		card.text(hand[i].name);

		$("#hand").append(card);

	}	

}


