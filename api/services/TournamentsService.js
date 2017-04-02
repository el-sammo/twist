
var Promise = require('bluebird');

module.exports = {
	getWagers: function(finalRaceId) {
		return Wagers.find(
			{finalRaceId: finalRaceId}
		).then(function(wagerData) {
			return {success: true, wagers: wagerData};
		}).catch(function(err) {
			return {success: false, reason: 'invalid customerId'};
		});
	},

	getCustomerBalance: function(customerId) {
		return Customers.find(
			{id: customerId}
		).then(function(customerData) {
			var dollars = 0;
			if(customerData[0].dollars) {
				dollars = customerData[0].dollars;
			}
			return {success: true, balance: dollars};
		}).catch(function(err) {
			return {success: false, reason: 'invalid customerId'};
		});
	},

	updateCustomerBalance: function(customerId, previousBalance, amount, doWhat) {
		if(doWhat === 'subtract') {
			var newBalance = parseFloat(parseFloat(previousBalance) - parseFloat(amount));
		}
		if(doWhat === 'add') {
			var newBalance = parseFloat(parseFloat(previousBalance) + parseFloat(amount));
		}
		return Customers.update(
			{id: customerId},
			{dollars: newBalance},
			false, 
			false
		).then(function(updatedCustomer) {
			return {success: true, updatedCustomer: updatedCustomer};
		}).catch(function(err) {
			console.log(err);
			return {success: false, reason: 'invalid customerId'};
		});
	},

	updateTS: function(tournamentId, customerId, credits) {
		return TournamentStandings.find({tournamentId: tournamentId}).then(function(tsData) {
			var customers = tsData[0].customers;
			var newCustomers = [];
			customers.forEach(function(customer) {
				if(customer.customerId === customerId) {
					newCustomers.push(
						{customerId: customerId, credits: parseFloat(credits)}
					);
				} else {
					newCustomers.push(customer);
				}
			});
			return TournamentStandings.update(
				{tournamentId: tournamentId},
				{customers: newCustomers},
				false, 
				false
			).then(function(updatedTSData) {
				return {success: true, updatedTSData: updatedTSData};
			}).catch(function(err) {
				console.log(err);
				return {success: false, reason: 'invalid tournamentId'};
			});
		}).catch(function(err) {
			console.log(err);
			return {success: false, reason: 'invalid tournamentId'};
		});
	},

	getFinalStandings: function(
		tournamentId,
		tournamentName,
		tournamentDate,
		startingCredits,
		entryFee,
		siteFee,
		customerIds
	) {
		var updatedCustomersCredits = [];
		var customerIdsCount = customerIds.length;
		customerIds.forEach(function(customerId) {
			var thisCustomer = {};
			getCustomerCredits(
				tournamentId,
				customerId,
				startingCredits
			).then(function(customerCredits) {
				thisCustomer.customerId = customerId;
				thisCustomer.credits = customerCredits.credits;
			}).then(function() {
				// this populates the uCC array
				updatedCustomersCredits.push(thisCustomer);

				if(updatedCustomersCredits.length == customerIdsCount) {
					updatedCustomersCredits.sort(dynamicSort("credits"));
					updatedCustomersCredits.reverse();
					var prizePool = parseFloat(parseFloat(entryFee) * customerIdsCount);
					var rank = 1;
					updatedCustomersCredits.forEach(function(customerCredit) {
						var customerFinalStanding = {};
						customerFinalStanding.customerId = customerCredit.customerId;
						customerFinalStanding.rank = rank;
						customerFinalStanding.credits = customerCredit.credits;
						var payout = getPayout(rank, prizePool, customerIdsCount);

						customerFinalStanding.payout = payout;
//console.log(' ');
//console.log('customerFinalStanding:');
//console.log(customerFinalStanding);

						TournamentResults.create({
							tournamentId: tournamentId,
							tournamentName: tournamentName,
							tournamentDate: tournamentDate,
							tournamentEntryFee: entryFee,
							tournamentSiteFee: siteFee,
							customerId: customerCredit.customerId,
							credits: customerCredit.credits,
							payout: payout
						}).then(function() {
							if(payout > 0) {
								TournamentsService.getCustomerBalance(customerCredit.customerId).then(function(balanceData) {
									TournamentsService.updateCustomerBalance(customerCredit.customerId, balanceData.balance, payout, 'add').then(function(updatedCustomerData) {
									}).catch(function(err) {
console.log(' ');
console.log('getFinalStandings - updateCustomerBalance err:');
										console.log(err);
									});
								}).catch(function(err) {
console.log(' ');
console.log('getFinalStandings - getCustomerBalance err:');
									console.log(err);
								});
							}
						}).catch(function(err) {
console.log(' ');
console.log('getFinalStandings - TournamentResults.create err:');
							console.log(err);
						});

						if(rank == customerIdsCount) {
//console.log(' ');
//console.log('done');
//console.log(' ');
						}

						rank ++;
					});
				}
			});
		});
	},

	getTournamentByTrackId: function(trackId) {
		return Tournaments.find(
			{assocTrackId: trackId}
		).then(function(tournamentData) {
			return {success: true, tournamentData: tournamentData[0]};
		}).catch(function(err) {
			return {success: false, reason: 'invalid trackId'};
		});
	},

	getTournamentResultsByCustomerId: function(customerId) {
		return TournamentResults.find(
			{customerId: customerId}
		).then(function(resultsData) {
			return {success: true, resultsData: resultsData};
		}).catch(function(err) {
			return {success: false, reason: 'invalid customerId'};
		});
	},

	addCustomer: function(tournamentId, customerId, tournamentCredits) {
		var credits = tournamentCredits || 500;
		return TournamentStandings.find(
			{tournamentId: tournamentId}
		).then(function(tsDataResults) {
			var tsData = tsDataResults[0];
			tsData.customers.push({customerId: customerId, credits: credits});
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
		).then(function(tsDataResults) {
			var tsData = tsDataResults[0];
			var updatedCustomers = [];
			tsData.customers.forEach(function(customer) {
				if(customer.customerId !== customerId) {
					updatedCustomers.push(customer)
				}
			});
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
	},

	createCustomTournament: function(tournamentData) {
		var assocTrackId = tournamentData.assocTrackId;
		var name = tournamentData.name;
		var tournyDate = tournamentData.tournyDate;
		var max = tournamentData.max;
		var entryFee = tournamentData.entryFee;
		var siteFee = tournamentData.siteFee;
		var startTime = tournamentData.startTime;
		var closed = false;
		var customers = tournamentData.customers;
		var credits = tournamentData.credits;
		var pubPriv = tournamentData.pubPriv;
		var custom = true;

		return Tournaments.create({
			assocTrackId: assocTrackId,
			name: name,
			tournyDate: tournyDate,
			max: max,
			entryFee: entryFee,
			siteFee: siteFee,
			startTime: startTime,
			closed: closed,
			customers: customers,
			credits: credits,
			pubPriv: pubPriv,
			custom: custom
		}).then(function(cctiResponse) {
			var tournamentId = cctiResponse.id;
			var newCustomers = [];
			customers.forEach(function(customer) {
				var newCustomer = {};
				newCustomer.customerId = customer;
				newCustomer.credits = credits;
				newCustomers.push(newCustomer);
			});
			return TournamentStandings.create({
				tournamentId: tournamentId,
				customers: newCustomers
			}).then(function(tsiResponse) {
				return {success: true, tournamentData: cctiResponse};
			}).catch(function(err) {
console.log(' ');
console.log('createCustomTournament - TournamentStandings.create err:');
console.log(err);
				return {success: false, reason: 'invalid tournamentId or customers'};
			});
		}).catch(function(err) {
console.log(' ');
console.log('createCustomTournament - Tournaments.create err:');
console.log(err);
			return {success: false, reason: 'invalid tournamentData'};
		});
	}
},

getCustomerCredits = function(tournamentId, customerId, credits) {
	return Wagers.find({
		tournamentId: tournamentId,
		customerId: customerId
	}).then(function(customerWagers) {
		customerWagers.forEach(function(wager) {
			if(wager.scored) {
				credits += parseFloat(wager.result - wager.wagerTotal);
			} else {
				if(!wager.cancelled) {
					credits -= parseFloat(wager.wagerTotal);
				}
			}
		});
		return {success: true, credits: credits};
	}).catch(function(err) {
		console.log(err);
		return {success: false, reason: 'invalid tournamentId or customerId'};
	});
},

getPayout = function(rank, prizePool, entryCount) {
	var payoutStructure = [
		// 2 or less players
		[
			1 // 1st
		],
		// 3-10 players
		[
			.7000, // 1st
			.3000  // 2nd
		],
		// 11-30 players
		[
			.5000, // 1st
			.3000, // 2nd
			.2000  // 3rd
		],
		// 31-40 players
		[
			.4000, // 1st
			.2500, // 2nd
			.2000, // 3rd
			.1500  // 4th
		],
		// 41-50 players
		[
			.3700, // 1st
			.2500, // 2nd
			.1500, // 3rd
			.1200, // 4th
			.1100  // 5th
		],
		// 51-60 players
		[
			.3500, // 1st
			.2200, // 2nd
			.1500, // 3rd
			.1100, // 4th
			.0900, // 5th
			.0800  // 6th
		],
		// 61-75 players
		[
			.3100, // 1st
			.2100, // 2nd
			.1300, // 3rd
			.1000, // 4th
			.0860, // 5th
			.0650, // 6th
			.0550, // 7th
			.0450  // 8th
		],
		// 76-100 players
		[
			.3000, // 1st
			.2000, // 2nd
			.1200, // 3rd
			.0950, // 4th
			.0800, // 5th
			.0600, // 6th
			.0500, // 7th
			.0400, // 8th
			.0300, // 9th
			.0250  // 10th
		],
		// 101-150 players
		[
			.2800, // 1st
			.1700, // 2nd
			.1060, // 3rd
			.0860, // 4th
			.0760, // 5th
			.0530, // 6th
			.0430, // 7th
			.0330, // 8th
			.0270, // 9th
			.0210, // 10th
			.0210, // 11th
			.0210, // 12th
			.0210, // 13th
			.0210, // 14th
			.0210  // 15th
		],
		// 151-200 players
		[
			.2700, // 1st
			.1600, // 2nd
			.1000, // 3rd
			.0800, // 4th
			.0700, // 5th
			.0490, // 6th
			.0390, // 7th
			.0290, // 8th
			.0240, // 9th
			.0190, // 10th
			.0190, // 11th
			.0190, // 12th
			.0190, // 13th
			.0190, // 14th
			.0190, // 15th
			.0130, // 16th
			.0130, // 17th
			.0130, // 18th
			.0130, // 19th
			.0130  // 20th
		],
		// 201-250 players
		[
			.2650, // 1st
			.1550, // 2nd
			.0980, // 3rd
			.0780, // 4th
			.0680, // 5th
			.0460, // 6th
			.0360, // 7th
			.0280, // 8th
			.0220, // 9th
			.0165, // 10th
			.0165, // 11th
			.0165, // 12th
			.0165, // 13th
			.0165, // 14th
			.0165, // 15th
			.0110, // 16th
			.0110, // 17th
			.0110, // 18th
			.0110, // 19th
			.0110, // 20th
			.0100, // 21st
			.0100, // 22nd
			.0100, // 23rd
			.0100, // 24th
			.0100  // 25th
		],
		// 251-300 players
		[
			.2600, // 1st
			.1500, // 2nd
			.0960, // 3rd
			.0760, // 4th
			.0660, // 5th
			.0450, // 6th
			.0350, // 7th
			.0260, // 8th
			.0210, // 9th
			.0150, // 10th
			.0150, // 11th
			.0150, // 12th
			.0150, // 13th
			.0150, // 14th
			.0150, // 15th
			.0100, // 16th
			.0100, // 17th
			.0100, // 18th
			.0100, // 19th
			.0100, // 20th
			.0090, // 21st
			.0090, // 22nd
			.0090, // 23rd
			.0090, // 24th
			.0090, // 25th
			.0080, // 26th
			.0080, // 27th
			.0080, // 28th
			.0080, // 29th
			.0080  // 30th
		],
		// 301-350 players
		[
			.2550, // 1st
			.1475, // 2nd
			.0940, // 3rd
			.0740, // 4th
			.0640, // 5th
			.0440, // 6th
			.0340, // 7th
			.0240, // 8th
			.0195, // 9th
			.0140, // 10th
			.0140, // 11th
			.0140, // 12th
			.0140, // 13th
			.0140, // 14th
			.0140, // 15th
			.0095, // 16th
			.0095, // 17th
			.0095, // 18th
			.0095, // 19th
			.0095, // 20th
			.0085, // 21st
			.0085, // 22nd
			.0085, // 23rd
			.0085, // 24th
			.0085, // 25th
			.0075, // 26th
			.0075, // 27th
			.0075, // 28th
			.0075, // 29th
			.0075, // 30th
			.0065, // 31st
			.0065, // 32nd
			.0065, // 33rd
			.0065, // 34th
			.0065  // 35th
		],
		// 351-400 players
		[
			.2500, // 1st
			.1450, // 2nd
			.0920, // 3rd
			.0720, // 4th
			.0620, // 5th
			.0430, // 6th
			.0330, // 7th
			.0230, // 8th
			.0185, // 9th
			.0140, // 10th
			.0140, // 11th
			.0140, // 12th
			.0140, // 13th
			.0140, // 14th
			.0140, // 15th
			.0090, // 16th
			.0090, // 17th
			.0090, // 18th
			.0090, // 19th
			.0090, // 20th
			.0080, // 21st
			.0080, // 22nd
			.0080, // 23rd
			.0080, // 24th
			.0080, // 25th
			.0070, // 26th
			.0070, // 27th
			.0070, // 28th
			.0070, // 29th
			.0070, // 30th
			.0060, // 31st
			.0060, // 32nd
			.0060, // 33rd
			.0060, // 34th
			.0060, // 35th
			.0055, // 36th
			.0055, // 37th
			.0055, // 38th
			.0055, // 39th
			.0055  // 4oth
		],
		// 401-500 players
		[
			.2450, // 1st
			.1425, // 2nd
			.0900, // 3rd
			.0700, // 4th
			.0600, // 5th
			.0420, // 6th
			.0320, // 7th
			.0220, // 8th
			.0165, // 9th
			.0125, // 10th
			.0125, // 11th
			.0125, // 12th
			.0125, // 13th
			.0125, // 14th
			.0125, // 15th
			.0085, // 16th
			.0085, // 17th
			.0085, // 18th
			.0085, // 19th
			.0085, // 20th
			.0075, // 21st
			.0075, // 22nd
			.0075, // 23rd
			.0075, // 24th
			.0075, // 25th
			.0065, // 26th
			.0065, // 27th
			.0065, // 28th
			.0065, // 29th
			.0065, // 30th
			.0055, // 31st
			.0055, // 32nd
			.0055, // 33rd
			.0055, // 34th
			.0055, // 35th
			.0050, // 36th
			.0050, // 37th
			.0050, // 38th
			.0050, // 39th
			.0050, // 40th
			.0040, // 41st
			.0040, // 42nd
			.0040, // 43rd
			.0040, // 44th
			.0040, // 45th
			.0040, // 46th
			.0040, // 47th
			.0040, // 48th
			.0040, // 49th
			.0040 // 50th
		]
	];

	if(entryCount < 3) {
		var payoutMap = payoutStructure[0];
	}
	if(entryCount > 2 && entryCount < 11) {
		var payoutMap = payoutStructure[1];
	}
	if(entryCount > 10 && entryCount < 31) {
		var payoutMap = payoutStructure[2];
	}
	if(entryCount > 30 && entryCount < 41) {
		var payoutMap = payoutStructure[3];
	}
	if(entryCount > 40 && entryCount < 51) {
		var payoutMap = payoutStructure[4];
	}
	if(entryCount > 50 && entryCount < 61) {
		var payoutMap = payoutStructure[5];
	}
	if(entryCount > 60 && entryCount < 76) {
		var payoutMap = payoutStructure[6];
	}
	if(entryCount > 75 && entryCount < 101) {
		var payoutMap = payoutStructure[7];
	}
	if(entryCount > 100 && entryCount < 151) {
		var payoutMap = payoutStructure[8];
	}
	if(entryCount > 150 && entryCount < 201) {
		var payoutMap = payoutStructure[9];
	}
	if(entryCount > 200 && entryCount < 251) {
		var payoutMap = payoutStructure[10];
	}
	if(entryCount > 250 && entryCount < 301) {
		var payoutMap = payoutStructure[11];
	}
	if(entryCount > 300 && entryCount < 351) {
		var payoutMap = payoutStructure[12];
	}
	if(entryCount > 350 && entryCount < 401) {
		var payoutMap = payoutStructure[13];
	}
	if(entryCount > 400 && entryCount < 501) {
		var payoutMap = payoutStructure[14];
	}

	if(payoutMap[rank -1] > 0) {
		return parseFloat(payoutMap[rank -1] * prizePool);
	} else {
		return parseFloat(0);
	}
},

dynamicSort = function(property) {
	var sortOrder = 1;
	if(property[0] === "-") {
		sortOrder = -1;
		property = property.substr(1);
	}
	return function (a,b) {
		var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
		return result * sortOrder;
	}
}

