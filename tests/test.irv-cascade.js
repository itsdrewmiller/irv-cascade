var assert = require('assert');
var irv = require('./../irv-cascade');

describe('irvCascade', function() {
	describe('#calculate', function() {

		var twoWayRaceWithWinner = {
			elections: ['only'],
			candidates: ['winner','loser'],
			votes: {
				"only": [
					['winner','loser'],
					['winner','loser'],
					['loser','winner']
				]
			}
		};

		it('should call a winner when two candidates and one has more votes', function() {
			var results = irv.calculate(twoWayRaceWithWinner);
			assert.equal('winner', results.only.winner);
		});

		var threeWayRaceWithTieForFirst = {
			elections: ['only'],
			candidates: ['tie','dye','loser'],
			votes: {
				"only": [
					['tie','dye','loser'],
					['tie','dye','loser'],
					['tie','dye','loser'],
					['dye','tie','loser'],
					['dye','tie','loser'],
					['dye','tie','loser'],
					['loser','dye','tie'],
					['loser','tie','dye']
				]
			}
		};

		it('should call a tie when the final two candidates have the same number of votes', function() {
			var results = irv.calculate(threeWayRaceWithTieForFirst);
			assert.equal(2, results.only.winner.length);
			assert(results.only.winner.indexOf('tie') > -1);
			assert(results.only.winner.indexOf('dye') > -1);
		});

		var tieForSecond = {
			elections: ['only'],
			candidates: ['tie','dye','loser'],
			votes: {
				"only": [
					['tie','dye','loser'],
					['tie','dye','loser'],
					['tie','dye','loser'],
					['tie','dye','loser'],
					['dye','loser','tie'],
					['dye','loser','tie'],
					['loser','dye','tie'],
					['loser','dye','tie']
				]
			}
		};

		it('should find consistent winners when unbreakable ties occur for second', function() {

			var results = irv.calculate(tieForSecond);
			assert.equal(2, results.only.winner.length);

			var tieIndex = results.only.winner.indexOf('tie');

			assert(tieIndex > -1);

			var otherWinner = results.only.winner[1-tieIndex];

			results = irv.calculate(tieForSecond);
			assert(results.only.winner.indexOf(otherWinner) > -1);

			results = irv.calculate(tieForSecond);
			assert(results.only.winner.indexOf(otherWinner) > -1);

			results = irv.calculate(tieForSecond);
			assert(results.only.winner.indexOf(otherWinner) > -1);

		});

		var tieForSecondJoey = {
			elections: ['only'],
			candidates: ['winner','loser','joey','sheila'],
			votes: {
				"only": [
					['loser','sheila','joey'],
					['sheila','joey'],
					['sheila','joey'],
					['joey','winner'],
					['joey','winner'],
					['joey','winner'],
					['winner'],
					['winner'],
					['winner'],
					['winner'],
					['winner'],
					['winner']
				]
			}
		};

		var tieForSecondSheila = {
			elections: ['only'],
			candidates: ['winner','loser','joey','sheila'],
			votes: {
				"only": [
					['sheila','winner'],
					['sheila','winner'],
					['sheila','winner'],
					['loser','joey','sheila'],
					['joey','sheila'],
					['joey','sheila'],
					['winner'],
					['winner'],
					['winner'],
					['winner'],
					['winner'],
					['winner']
				]
			}
		};

		// it('should successfully break a tie based on australian rules', function() {
		// 	var results = irv.calculate(tieForSecondJoey);
		// 	assert(results.only.winner.indexOf('joey') > -1);

		// 	results = irv.calculate(tieForSecondSheila);
		// 	assert(results.only.winner.indexOf('sheila') > -1);

		// });

	});
});