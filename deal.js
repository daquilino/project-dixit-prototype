
// given array of players in room. Six random unique cards are dealt from deck to each player.

// retuns a deck of cards
const Deck = require('./deck.js')();

module.exports = {

deal: function(players)
{
	console.log("Dealing Cards");
	
	let cardsAlreadyDelt = [];	
	for(let i = 0; i < players.length; i++)
	{
		let count = 0;
		
		while( count < 6)
		{
			let card = Math.floor(Math.random() * Deck.length);

			if(cardsAlreadyDelt.indexOf(card) < 0)
			{
				cardsAlreadyDelt.push(card);
				players[i].hand.push(Deck[card]);
				count++;
			}	
		}	
	}
}

}//END module.exports	