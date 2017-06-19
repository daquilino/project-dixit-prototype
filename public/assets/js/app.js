const socket = io.connect(window.location.href);// gets location from window object

let storyteller = false;

//listens for incoming data named "message" from server
socket.on("message", addToChat );

// listens for room data. Not neccessary just used just to display room name in chat.
socket.on("room", displayRoom );

// Receives the players hand from the socket.io on server.
socket.on("hand", createHand);

// Triggers storyteller mode.
socket.on("setAsStoryTeller", toggleStoryTeller);

socket.on("clue", displayClue)

// used to submit message to socket.io on server
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

$('#clue-form').submit(function(e){
	e.preventDefault();
	
	// need to get card.
	let data = {
		clue: $("#clue").val().trim(),
		card: "some card"
	}

	socket.emit('clue', data);	
	
	// hides clue submit form.
	$('#clue-form').css("display", "none");

});

//function to sent message to socket.io on server
function postMessage(message)
{
	let data = {
		text: message
	};
	//this sends the data object to the server with the name "message"
	socket.emit('message', data);
}

////function to sent name to socket.io on server
function postName(name)
{
	//sends user input name to socket
	socket.emit('name', name);	
}

// displays message received from socket.io on server to chatbox.
function addToChat(message)
{

	let p = $('<p>');
	p.html(message.name + "> "+ message.text);
	$("#chat-box").append(p);

	//this adjusts scroll to bottom of div.
 	let elem = document.getElementById('chat-box');
 	elem.scrollTop = elem.scrollHeight;

}

// displays user's room received from socket.io on server to chatbox.
function displayRoom(data)
{	
	let p = $('<p style="text-align: center">');
	p.html("Hello " + data.name + " welcome to the " + data.room + " room.");
	$("#chat-box").append(p);

	//this adjusts scroll to bottom of div.
 	let elem = document.getElementById('chat-box');
 	elem.scrollTop = elem.scrollHeight;
}

// on click function when user clicks on card.
// set some flag here to enable or disable
$('.card').on('click', function(){
	console.log("clicked", $(this).attr('id'));
	/*
		flag if player or if storyteller
		

	*/

});

// array of cards comes in.
function createHand(hand){
	
	if(hand !== "observer")
	{	
		for(let i = 0; i < hand.length; i++)
		{
			let card = $('<div>');
			card.addClass('col-xs-2 card');
			card.text(hand[i].name);

			$("#hand").append(card);

		}	
	}
	else{
		$("#hand").html('<div class="text-center"> <h1>OBSERVER </h1></div>');
	}
}

// toggle storyteller functions (right now just clue input form.)
function toggleStoryTeller(){

	if(storyteller)		
	{	
		$('#clue-form').css("display", "initial");
	}
	
}

function displayClue(clue)
{
	$("#clue-span").text("clue: " + clue);
}

