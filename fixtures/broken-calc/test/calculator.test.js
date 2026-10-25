import test from 'node:test';
import assert from 'node:assert/strict';
import { add, subtract, multiply, divide } from '../src/calculator.js';

test('add: adds two positive numbers', () => {
  assert.equal(add(2, 3), 5);
});

test('subtract: subtracts two numbers', () => {
  assert.equal(subtract(10, 4), 6);
});

test('multiply: multiplies two numbers', () => {
  assert.equal(multiply(3, 7), 21);
});

test('divide: correctly divides two numbers', () => {
  assert.equal(divide(20, 4), 5);
});

test('divide: throws RangeError on division by zero', () => {
  assert.throws(() => {
    divide(10, 0);
  }, /^RangeError: Division by zero/);
});
