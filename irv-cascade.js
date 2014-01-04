var irvCascade;

if (typeof _ === 'undefined') {
	_ = require('lodash');
}

if (typeof seedRandom === 'undefined') {
	seedRandom = require('seed-random');
}


(function() {



	var calculateResults = function(votes) {

		var results = {};
		_.each(votes, function(vote) {
			if (vote.length === 0) { return; }
			var firstChoice = vote[0];
			if (!results[firstChoice]) { results[firstChoice] = 0; }
			results[firstChoice] += 1;
		});

		var resultsArray = [];

		_.each(_.keys(results), function(key) {
			resultsArray.push({
				candidate: key,
				total: results[key]
			});
		});

		return resultsArray;

	};

	var identifyWinner = function(results) {
		
		if (results.length === 1) {
			return results[0].candidate;
		}
		return null;

	};

	var findLowestCandidate = function(thisRound, allRounds) {

		// round is sorted ascending already
		
		var lowestTotal = thisRound[0].total;

		var lowestCandidates = [];

		_.each(thisRound, function(result) {
			if (result.total === lowestTotal) {
				lowestCandidates.push(result.candidate);
			}
		});

		// Easy, remove the lowest person
		if (lowestCandidates.length === 1) {
			return lowestCandidates[0];
		}

		var findMin = function(result) {
			if (lowestCandidates.indexOf(result.candidate) > -1) {
				return result.total;
			} 
		};

		var lowestRoundTotal = null;

		var matchLosers = function(result) {
			var index = lowestCandidates.indexOf(result.candidate);
			return (result.total === lowestRoundTotal && index > -1);
		};

		var mapToCandidate = function(result) {
			return result.candidate;
		};

		// ok, let's look at previous rounds until one person has the lowest results
		// the current round is the last entry in the array so let's skip it
		for (var roundsBack = 1; roundsBack < allRounds.length; roundsBack ++) {

			var currentRound = allRounds[allRounds.length - roundsBack - 1];

			lowestRoundTotal = _.min(currentRound, findMin).total;
			lowestCandidates = _.filter(currentRound, matchLosers).map(mapToCandidate);

			if (lowestCandidates.length === 1) {
				return lowestCandidates[0];
			}

		}

		// well, crap - let's use a consistent random number generator
		var seed = lowestCandidates.join(" vs. ");
		var index = Math.floor(seedRandom(seed)() * lowestCandidates.length);
		
		return lowestCandidates[index];

	};

	var removeLoser = function(loser, votes) {

		_.each(votes, function(vote) {
			var index = vote.indexOf(loser);

			if (index > -1) {
				vote.splice(index, 1);
			}
		});
	};

	var resultSortAscending = function(a,b) {
		return a.total - b.total;
	};

	var calculateElection = function(votes) {
		var roundTotals = [];
		var winner = null;

		while (!winner) {

			var results = calculateResults(votes);

			results.sort(resultSortAscending);

			roundTotals.push(results);
			winner = identifyWinner(results);

			if (!winner) {

				var lowestCandidate = findLowestCandidate(results, roundTotals);
				removeLoser(lowestCandidate, votes);

			} 
			
		}

		return {
			winner: winner,
		};

	};


	irvCascade = {
		calculate: function(cascade) {
			var results = {};
			var winners = [];



			_.each(cascade.elections, function(election) {
				var votes = cascade.votes[election];

				_.each(votes, function(vote, index) {
					votes[index] = _.filter(vote, function(v) {
						return winners.indexOf(v) === -1;
					});

				});

				results[election] = calculateElection(votes);

				winners.push(results[election].winner);
				
			});

			return results;
		}
	};

})();

if (typeof module === 'object' && module) {
	module.exports = irvCascade;
}