
var Promise = require('bluebird');

module.exports = {
	addCustomer: function(tournamentId, customerId) {
		return TournamentStandings.find(
			{tournamentId: tournamentId}
		).then(function(tsData) {
console.log(' ');
console.log('tsData:');
console.log(tsData);
			tsData.customers.push({customerId: customerId, credits: 500});
console.log(' ');
console.log('tsData.customers:');
console.log(tsData.customers);
			return TournamentStandings.update(
				{tournamentId: tournamentId},
				{customers: tsData.customers},
				false,
				false
			).then(function(updatedTSData) {
				return {success: true, updatedTSData: updatedTSData};
			}).catch(function(err) {
				return {success: false, reason: 'invalid tournamentId or customers'};
			});
		}).catch(function(err) {
			return {success: false, reason: 'invalid tournamentId or customerId'};
		});
	},

	removeCustomer: function(tournamentId, customerId) {
		return TournamentStandings.find(
			{tournamentId: tournamentId}
		).then(function(tsData) {
console.log(' ');
console.log('tsData:');
console.log(tsData);
			var updatedCustomers = [];
			tsData.customers.forEach(function(customer) {
				if(customer.customerId !== customerId) {
					updatedCustomers.push(customer)
				}
			});
console.log(' ');
console.log('updatedCustomers:');
console.log(updatedCustomers);
			return TournamentStandings.update(
				{tournamentId: tournamentId},
				{customers: updatedCustomers},
				false,
				false
			).then(function(updatedTSData) {
				return {success: true, updatedTSData: updatedTSData};
			}).catch(function(err) {
				return {success: false, reason: 'invalid tournamentId or customers'};
			});
		}).catch(function(err) {
			return {success: false, reason: 'invalid tournamentId or customerId'};
		});
	}
}
