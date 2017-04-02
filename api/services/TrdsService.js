module.exports = {

	getAffectedWagers: function(finalRaceId) {
		return Wagers.find(
			{finalRaceId: finalRaceId, cancelled: false, scored: false}
		).then(function(affectedWagers) {
			return affectedWagers;
		}).catch(function(err) {
			return {success: false, reason: 'invalid finalRaceId'};
		});
	},

	scoreWager: function(wagerId, result) {
		return Wagers.update(
			{id: wagerId},
			{result: result, scored: true},
			false, 
			false
		).then(function(wager) {
			return {success: true};
		}).catch(function(err) {
			return {success: false, err: err};
		});
	},

	getTournamentId: function(trdId) {
		return Tournaments.find(
			{assocTrackId: trdId}
		).then(function(tournamentData) {
			return {tournamentId: tournamentData[0].id};
		}).catch(function(err) {
			return {success: false, err: err};
		});
	},

	updateCredits: function(tournamentId, customerId, result) {
console.log('updatecredits() called with '+result+' credits');
		return Tournaments.find({id: tournamentId}).then(function(tournamentData) {
			var newCustomers = [];
			tournamentData[0].customers.forEach(function(customer) {
				if(customer.customerId === customerId) {
					var credits = parseFloat((parseFloat(customer.credits) + parseFloat(result)));
					var newCustomer = {}
					newCustomer.customerId = customer.customerId;
					newCustomer.credits = credits;
					newCustomers.push(newCustomer);
				} else {
					newCustomers.push(customer);
				}
			});

			return Tournaments.update(
				{id: tournamentId},
				{customers: newCustomers},
				false, 
				false
			).then(function(tournament) {
				return {success: true};
			}).catch(function(err) {
				return {success: false, err: err};
			});
		});
	}

};

