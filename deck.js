// creates and returns an array of 100 cards.

module.exports =  function(users){
	
	// array for dummy deck for 100 cards
	let deck = new Array(100);

	// constructor function for card
	let Card = function(name)
	{
		this.name = name;
		this.owner = null;
		this.guesses = 0;
	}

	// populates dummy deck
	for(let i = 0; i < deck.length; i++)
	{
		deck[i] = new Card("Card " + i);
	} 

	return deck;

}