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

		it('should call a winner even when there is an unbreakable tie for first', function() {
			var results = irv.calculate(threeWayRaceWithTieForFirst);
			assert(results.only.winner === 'tie' || results.only.winner === 'dye');

			var winner = results.only.winner;

			results = irv.calculate(tieForSecond);
			assert.equal(winner, results.only.winner);

			results = irv.calculate(tieForSecond);
			assert.equal(winner, results.only.winner);

			results = irv.calculate(tieForSecond);
			assert.equal(winner, results.only.winner);

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
			assert(results.only.winner === 'tie' || results.only.winner === 'dye');

			var winner = results.only.winner;

			results = irv.calculate(tieForSecond);
			assert.equal(winner, results.only.winner);

			results = irv.calculate(tieForSecond);
			assert.equal(winner, results.only.winner);

			results = irv.calculate(tieForSecond);
			assert.equal(winner, results.only.winner);

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
					['joey','winner']
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
					['joey','sheila']				]
			}
		};

		it('should successfully break a tie based on australian rules', function() {
			var results = irv.calculate(tieForSecondJoey);
			assert('joey', results.only.winner);

			results = irv.calculate(tieForSecondSheila);
			assert('sheila', results.only.winner);

		});

		var doubleRace = {
			elections: ['first', 'second'],
			candidates: ['winner','loser'],
			votes: {
				"first": [
					['winner','loser'],
					['winner','loser'],
					['loser','winner']
				],
				"second": [
					['winner','loser'],
					['winner','loser'],
					['loser','winner']
				]
			}
		};

		it('should pick a new winner given a cascade', function() {
			var results = irv.calculate(doubleRace);
			assert.equal('winner', results.first.winner);
			assert.equal('loser', results.second.winner);
		});

	});


});