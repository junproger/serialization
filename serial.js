'use strict';

// original serials
const exampleSource = [0,1,2,3,1,2,3,4,2,3,4,5,3,4,5,6,4,5,6,7];
const exampleSerial = {'0':1,'1':2,'2':3,'3':4,'4':4,'5':3,'6':2,'7':1};

// optimal serials
const optimalSerial1 = '0:1,1:2,2:3,3:4,4:4,5:3,6:2,7:1';
/*
* IN CASES THEN REPEATING IS LOW, SHOLD BE REMOVE VALUE: 1
*/
const optimalSerial2 = '0,1:2,2:3,3:4,4:4,5:3,6:2,7';

// any duplicate values also should be optimized

const optimalSerial3 = '1:0,7;2:1,6;3:2,5;4:3,4';

/*
*
* @param {Number} digits - Digits of numbers
* @param {Number} amount - Amount of numbers
* @returns {Array} Array of numbers
*
*/
const source = (digits = 0, amount = 100) => {
	const limit = (digits) => {
		switch (digits) {
			case 0: return 300;
			case 1: return 9;
			case 2: return 99;
			case 3: return 999;
			default: return 300;
		};
	};
	const random = () => {
		return Math.floor(Math.random() * limit(digits) + 1);
	};
	const create = (amount) => {
		const result = [];
		while (amount) {
			amount -= 1;
			result.push(random());
		};
		return result;
	};
	return create(amount);
};

/*
*
* @param {Number} amount - Amount of numbers
* @returns {Array} Array of numbers
*
*/
const special = (number = 10, amount = 30) => {
	if (amount < 30) amount = 30;
	const create = (amount) => {
		const result = [];
		while (amount) {
			amount -= 3;
			result.push(number, number, number);
			number += 1;
		};
		return result;
	};
	return create(amount);
};

/*
*
* @param {Array} source - Array of numbers
* @returns {String} Serialized object
*
*/
const serialize1 = (source) => {
  const serial = {};
  (function() {
    source.forEach((item) => {
      if (serial[`${item}`]) {
        serial[`${item}`] += 1;
      } else {
        serial[`${item}`] = 1;
      }
    });
  }());
  const compress = (serial) =>{
    let result = '';
    for (let key in serial) {
      if (serial[key] > 1) {
        result += `${key}:${serial[key]},`;
      } else {
        result += `${key},`;
      }
    }
    return result;
  };
  return compress(serial);
};

/*
*
* @param {Array} source - Array of numbers
* @returns {String} Serialized object
*
*/
const serialize2 = (source) => {
  const serial = {};
  for (let i = 0; i < source.length; i++) {
    if (serial[`${source[i]}`]) {
      serial[`${source[i]}`] += 1;
    } else {
      serial[`${source[i]}`] = 1;
    }
  };
  const compress = (serial) =>{
    const prepare = {};
    for (let key in serial) {
      if (Object.hasOwn(prepare, serial[key])) {
        prepare[serial[key]] += `${key},`;
      } else {
        prepare[serial[key]] = `${key},`;
      }
    }
    let result = '';
    for (let key in prepare) {
      result += `${key}:${prepare[key].slice(0, -1)};`;
    }
    return result;
  };
  return compress(serial);
};

console.log('Checking with examples\n', JSON.stringify(exampleSource), (JSON.stringify(exampleSource)).length, serialize2(exampleSource), (serialize2(exampleSource)).length, (Math.trunc(((serialize2(exampleSource)).length / (JSON.stringify(exampleSource)).length) * 100) + '%'));

const outputTests = () => {
  // input: 50, 100 чисел;
  const amountTests1 = [
    {digits: 0, amount: 50},
    {digits: 0, amount: 100},
  ];
  // input: 500, 1000 чисел;
  const amountTests2 = [
    {digits: 0, amount: 500},
    {digits: 0, amount: 1000},
  ];
  // граничные - все числа 1 знака;
  const digits1Tests = [
    {digits: 1, amount: 50},
    {digits: 1, amount: 100},
    {digits: 1, amount: 500},
    {digits: 1, amount: 1000},
  ];
  // граничные - все числа из 2х знаков;
  const digits2Tests = [
    {digits: 2, amount: 50},
    {digits: 2, amount: 100},
    {digits: 2, amount: 500},
    {digits: 2, amount: 1000},
  ];
  // граничные - все числа из 3х знаков;
  const digits3Tests = [
    {digits: 3, amount: 50},
    {digits: 3, amount: 100},
    {digits: 3, amount: 500},
    {digits: 3, amount: 1000},
  ];
  // каждого числа по 3 - всего 30, 90, 300, 900 чисел;
  const numbersTests = [
    {number: 1, amount: 90},
    {number: 1, amount: 300},
    {number: 1, amount: 900},
    {number: 10, amount: 90},
    {number: 10, amount: 300},
    {number: 10, amount: 900},
    {number: 100, amount: 90},
    {number: 100, amount: 300},
    {number: 100, amount: 900}
  ];
  // output: исходная строка, сжатая строка, коэффициент сжатия;
  const randomTests = (amountTests) => {
    amountTests.forEach(({digits, amount}) => {
      const dumpSource = source(digits, amount);
      const dumpLength = (JSON.stringify(dumpSource)).length;
      const serialized = serialize2(dumpSource);
      const coefficient = Math.trunc((serialized.length / dumpLength) * 100) + '%';
      console.log('Checking with amountTests', dumpLength, serialized.length, coefficient);
    });
  };
  const specialTests = (numberTests) => {
    numberTests.forEach(({number, amount}) => {
      const dumpSpecial = special(number, amount);
      const dumpLength = (JSON.stringify(dumpSpecial)).length;
      const serialized = serialize2(dumpSpecial);
      const coefficient = Math.trunc((serialized.length / dumpLength) * 100) + '%';
      console.log('Checking with numberTests', dumpLength, serialized.length, coefficient);
    });
  };
  // start test 1
  console.log('start test1');
  console.log(amountTests1);
  randomTests(amountTests1);
  // start test 2
  console.log('start test2');
  console.log(amountTests2);
  randomTests(amountTests2);
  // start test 3
  console.log('start test3');
  console.log(digits1Tests);
  randomTests(digits1Tests);
  // start test 4
  console.log('start test4');
  console.log(digits2Tests);
  randomTests(digits2Tests);
  // start test 5
  console.log('start test5');
  console.log(digits3Tests);
  randomTests(digits3Tests);
  // start test 6
  console.log('start test6');
  console.log(numbersTests);
  specialTests(numbersTests);
};

outputTests();

// start script: node serial.js
