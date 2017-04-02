
var Promise = require('bluebird');

module.exports = {
	getTrd: function(trId) {
		return Trds.find(
			{id: trId}
		).then(function(trds) {
			return {success: true, trd: trds[0]};
		}).catch(function(err) {
			return {success: false, reason: 'invalid trId'};
		});
	},

	getTournament: function(tournamentId) {
		return TournamentStandings.find(
			{tournamentId: tournamentId}
		).then(function(tournamentsData) {
			return {success: true, tournamentData: tournamentsData[0]};
		}).catch(function(err) {
			return {success: false, reason: 'invalid tournamentId'};
		});
	},

	getCustomerBalance: function(customerId) {
		return Customers.find(
			{id: customerId}
		).then(function(trds) {
			var balance = 0;
			if(trds[0].balance) {
				balance = trds[0].balance;
			}
			return {success: true, balance: balance};
		}).catch(function(err) {
			return {success: false, reason: 'invalid customerId'};
		});
	},

	getCustomerTournamentCreditBalance: function(tournamentId, customerId) {
		return TournamentStandings.find(
			{tournamentId: tournamentId}
		).then(function(tournamentData) {
			var customerFound = false;
			var credits;
			tournamentData[0].customers.forEach(function(customer) {
				if(customer.customerId === customerId) {
					customerFound = true;
					credits = customer.credits;
				}
			});
			if(customerFound) {
				return {success: true, balance: credits};
			} else {
				return {success: false, reason: 'customer not found'};
			}
		}).catch(function(err) {
			return {success: false, reason: 'invalid customerId'};
		});
	},

	updateCustomerBalance: function(customerId, previousBalance, wagerAmount, doWhat) {
		if(doWhat === 'subtract') {
			var newBalance = parseFloat(parseFloat(previousBalance) - parseFloat(wagerAmount));
		}
		if(doWhat === 'add') {
			var newBalance = parseFloat(parseFloat(previousBalance) + parseFloat(wagerAmount));
		}
		return Customers.update(
			{id: customerId},
			{balance: newBalance},
			false, 
			false
		).then(function(updatedCustomer) {
			return {success: true, updatedCustomer: updatedCustomer};
		}).catch(function(err) {
			console.log(err);
			return {success: false, reason: 'invalid customerId'};
		});
	},

	updateCustomerTournamentCreditBalance: function(tournamentId, customerId, previousBalance, wagerAmount, doWhat) {
		if(doWhat === 'subtract') {
			var newBalance = parseFloat(parseFloat(previousBalance) - parseFloat(wagerAmount));
		}
		if(doWhat === 'add') {
			var newBalance = parseFloat(parseFloat(previousBalance) + parseFloat(wagerAmount));
		}
		return Tournaments.find(
			{id: tournamentId}
		).then(function(tournamentData) {
			var newCustomers = [];
			tournamentData[0].customers.forEach(function(customer) {
				if(customer.customerId === customerId) {
					newCustomers.push({customerId: customer.customerId, credits: newBalance});
				} else {
					newCustomers.push(customer);
				}
			});

			return Tournaments.update(
				{id: tournamentId},
				{customers: newCustomers},
				false, 
				false
			).then(function(updatedTournament) {
				return {success: true, updatedTournament: updatedTournament};
			}).catch(function(err) {
				console.log(err);
				return {success: false, reason: 'updateCustomerTournamentCreditBalance() failed'};
			});
		});
	}

}
