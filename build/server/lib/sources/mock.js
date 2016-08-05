'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.fetchTransactions = exports.fetchAccounts = exports.SOURCE_NAME = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _helpers = require('../../helpers');

var _errors = require('../../shared/errors.json');

var _errors2 = _interopRequireDefault(_errors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _helpers.makeLogger)('sources/mock'); // This modules mocks output generated by weboob.


var TIME_TO_GENERATE_OPERATIONS_MS = 500;

var hashAccount = function hashAccount(uuid) {
    var hash = uuid.charCodeAt(0) + uuid.charCodeAt(3) + uuid.charCodeAt(uuid.length - 1);
    return {
        main: hash + '1',
        second: hash + '2',
        third: hash + '3'
    };
};

var SOURCE_NAME = exports.SOURCE_NAME = 'mock';

var fetchAccounts = exports.fetchAccounts = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(access) {
        var bankuuid, obj, main, second, third, values;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        bankuuid = access.bank;
                        obj = hashAccount(bankuuid);
                        main = obj.main;
                        second = obj.second;
                        third = obj.third;
                        values = [{
                            accountNumber: main,
                            label: 'Compte bancaire ' + main,
                            balance: '150',
                            iban: '235711131719',
                            currency: 'EUR'
                        }, {
                            accountNumber: second,
                            label: 'Livret A ' + second,
                            balance: '500',
                            currency: 'USD'
                        }, {
                            accountNumber: third,
                            label: 'Plan Epargne Logement ' + third,
                            balance: '0'
                        }];


                        if (Math.random() > .8) {
                            values.push({
                                accountNumber: '0147200001',
                                label: 'Assurance vie',
                                balance: '1000'
                            });
                        }

                        return _context.abrupt('return', values);

                    case 8:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function fetchAccounts(_x) {
        return _ref.apply(this, arguments);
    };
}();

var randomLabels = [['Café Moxka', 'Petit expresso rapido Café Moxka'], ['MerBnB', 'Paiement en ligne MerBNB'], ['Tabac Debourg', 'Bureau de tabac SARL Clopi Cloppa'], ['Rapide PSC', 'Paiement sans contact Rapide'], ['MacDollars PSC', 'Paiement sans contact Macdollars'], ['FNAK', 'FNAK CB blabla'], ['CB Sefaurat', 'Achat de parfum chez Sefaurat'], ['Polyprix CB', 'Courses chez Polyprix'], ['Croisement CB', 'Courses chez Croisement'], ['PRLV UJC', 'PRLV UJC'], ['CB Spotifaille', 'CB Spotifaille London'], ['Antiquaire', 'Antiquaire'], ['Le Perroquet Bourré', 'Le Perroquet Bourré SARL'], ['Le Vol de Nuit', 'Bar Le Vol De Nuit SARL'], ['Impots fonciers', 'Prelevement impots fonciers numero reference\n    47839743892 client 43278437289'], ['ESPA Carte Hassan Cehef', 'Paiement carte Hassan Cehef'], ['Indirect Energie', 'ESPA Indirect Energie SARL'], ['', 'VIR Mr Jean Claude Dusse'], ['Nuage Douillet', 'ESPA Abonnement Nuage Douillet'], ['Glagla Frigidaire', 'CB GLAGLA FRIGIDAIRE'], ['Digiticable', 'ESPA Digiticable'], ['NOGO Sport', 'CB NOGO Sport'], ['FramaHard', 'ESPA Don FramaHard'], ['Sergent Tchoutchou', 'CB online Sergent Tchoutchou'], ['RAeTP', 'CB Raleurs Ambulants et Traficoteurs Patentés']];

var randomLabelsPositive = [['VIR Nuage Douillet', 'VIR Nuage Douillet REFERENCE Salaire'], ['Impots', 'Remboursement impots en votre faveur'], ['', 'VIR Pots de vin et magouilles pas claires'], ['Case départ', 'Passage par la case depart'], ['Assurancetourix', 'Remboursement frais médicaux pour plâtre généralisé']];

var rand = function rand(low, high) {
    return low + (Math.random() * (high - low) | 0);
};

var randInt = function randInt(low, high) {
    return rand(low, high) | 0;
};

var randomArray = function randomArray(arr) {
    return arr[randInt(0, arr.length)];
};

var randomType = function randomType() {
    return randInt(0, 10);
};

var generateDate = function generateDate(lowDay, highDay, lowMonth, highMonth) {
    return (0, _moment2.default)().month(rand(lowMonth, highMonth)).date(rand(lowDay, highDay)).format('YYYY-MM-DDT00:00:00.000[Z]');
};

var generateOne = function generateOne(account) {

    var n = rand(0, 100);
    var now = (0, _moment2.default)();
    var type = randomType();

    // with a 2% rate, generate a special operation to test duplicates
    // (happening on 4th of current month).
    if (n < 2) {
        return {
            account: account,
            amount: '-300',
            title: 'Loyer',
            raw: 'Loyer habitation',
            date: generateDate(4, 4, now.month(), now.month()),
            type: type
        };
    }

    var date = generateDate(1, now.date(), 0, now.month());

    if (n < 15) {
        var _randomArray = randomArray(randomLabelsPositive);

        var _randomArray2 = (0, _slicedToArray3.default)(_randomArray, 2);

        var _title = _randomArray2[0];
        var _raw = _randomArray2[1];

        var _amount = (rand(100, 800) + rand(0, 100) / 100).toString();

        return {
            account: account,
            amount: _amount,
            title: _title,
            raw: _raw,
            date: date,
            type: type
        };
    }

    var _randomArray3 = randomArray(randomLabels);

    var _randomArray4 = (0, _slicedToArray3.default)(_randomArray3, 2);

    var title = _randomArray4[0];
    var raw = _randomArray4[1];

    var amount = (-rand(0, 60) + rand(0, 100) / 100).toString();

    var binary = null;
    if (rand(0, 100) > 90) {
        log.info('Generating a binary attached to the operation.');
        binary = {
            fileName: '__dev_example_file'
        };
    }

    return {
        account: account,
        amount: amount,
        title: title,
        raw: raw,
        date: date,
        type: type,
        binary: binary
    };
};

var generateRandomError = function generateRandomError() {
    var errorTable = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = (0, _getIterator3.default)((0, _keys2.default)(_errors2.default)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var error = _step.value;

            errorTable.push(_errors2.default[error]);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return errorTable[randInt(0, errorTable.length - 1)];
};

var selectRandomAccount = function selectRandomAccount(uuid) {

    var n = rand(0, 100);
    var accounts = hashAccount(uuid);

    if (n < 90) return accounts.main;

    if (n < 95) return accounts.second;

    return accounts.third;
};

var generate = function generate(uuid) {
    var operations = [];

    var i = 5;
    while (i--) {
        operations.push(generateOne(selectRandomAccount(uuid)));
    }

    while (rand(0, 100) > 70 && i < 3) {
        operations.push(generateOne(selectRandomAccount(uuid)));
        i++;
    }

    // Generate exact same operations imported at the same time
    // These operations shall not be considered as duplicates.
    if (rand(0, 100) > 85 && operations.length) {
        log.info('Generate a similar but non-duplicate operation.');
        operations.push(operations[0]);
    }

    // Generate always the same operation, so that it is considered
    // as a duplicate.
    if (rand(0, 100) > 70) {
        log.info('Generate a possibly duplicate operation.');
        var duplicateOperation = {
            title: 'This is a duplicate operation',
            amount: '13.37',
            raw: 'This is a duplicate operation',
            account: hashAccount(uuid).main
        };
        // The date is one day difference, so it is considered a duplicate by
        // the client
        var date = (0, _moment2.default)(new Date('05/04/2020'));
        if (rand(0, 100) <= 50) {
            date = date.add(1, 'days');
        }
        duplicateOperation.date = date.format('YYYY-MM-DDT00:00:00.000[Z]');
        operations.push(duplicateOperation);
    }

    // Sometimes generate a very old operation, probably older than the oldest
    // one.
    if (rand(0, 100) > 90) {
        log.info('Generate a very old transaction to trigger balance resync.');
        var op = {
            title: 'Ye Olde Transaction',
            raw: 'Ye Olde Transaction - for #413 testing',
            amount: '42.12',
            account: hashAccount(uuid).main,
            date: new Date('01/01/2000')
        };
        operations.push(op);
    }

    log.info('Generated ' + operations.length + ' fake operations:');
    var accountMap = new _map2.default();
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = (0, _getIterator3.default)(operations), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _op = _step2.value;

            var prev = accountMap.has(_op.account) ? accountMap.get(_op.account) : [0, 0];
            accountMap.set(_op.account, [prev[0] + 1, prev[1] + +_op.amount]);
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = (0, _getIterator3.default)(accountMap), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var _step3$value = (0, _slicedToArray3.default)(_step3.value, 2);

            var account = _step3$value[0];

            var _step3$value$ = (0, _slicedToArray3.default)(_step3$value[1], 2);

            var num = _step3$value$[0];
            var amount = _step3$value$[1];

            log.info('- ' + num + ' new operations (' + amount + ') for account ' + account + '.');
        }
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
        }
    }

    return operations;
};

var fetchTransactions = exports.fetchTransactions = function fetchTransactions(access) {
    var bankuuid = access.bank;
    return new _promise2.default(function (accept, reject) {
        setTimeout(function () {
            // Generate a random error
            if (rand(0, 100) <= 10) {
                var errorCode = generateRandomError();
                var error = new _helpers.KError('New random error: ' + errorCode, 500, errorCode);
                reject(error);
            }
            accept(generate(bankuuid));
        }, TIME_TO_GENERATE_OPERATIONS_MS);
    });
};