db = new Mongo().getDB('twist');

function getUnfinishedGames() {
	var cursor = db.games.find({completed: false});
	while(cursor.hasNext()) {
		var trdData = cursor.next();
		var trackId = (trdData._id.toString()).substring(10,34);
		getTournamentsByAssocTrackId(trackId);
	}
}

function getTournamentStandingsByTournamentId(tournamentId, tournamentCredits) {
	var newCustomers = [];
	var cursor = db.tournamentstandings.find({tournamentId: tournamentId});
	while(cursor.hasNext()) {
		var tsData = cursor.next();
		tsData.customers.forEach(function(customer) {
			var thisCustomer = {};
			thisCustomer.customerId = customer.customerId;
			thisCustomer.credits = getCustomerTournamentCredits(customer.customerId, tournamentId, tournamentCredits);
			newCustomers.push(thisCustomer);
		});
print(' ');
print('tournamentId: '+tournamentId);
print('tournamentCredits: '+tournamentCredits);
print('newCustomers:');
print(JSON.stringify(newCustomers));
		db.tournamentstandings.update(
			{tournamentId: tournamentId},
			{$set: {customers: newCustomers}},
			false,
			false
		)
	}
}










