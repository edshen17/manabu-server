const mongoose = require('mongoose');
const dbHandler = require('./dbHandler');
const User = require('../models/User');

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => await dbHandler.connect());

/**
 * Clear all test data after every test.
 */
afterEach(async () => await dbHandler.clearDatabase());

/**
 * Remove and close the db and server.
 */
afterAll(async () => await dbHandler.closeDatabase());

/**
 * Product test suite.
 */
describe('product ', () => {
  /**
   * Tests that a valid product can be created through the productService without throwing any errors.
   */
  //   it('can be created correctly', async () => {
  //     expect(async () => await productService.create(productComplete)).not.toThrow();
  //   });
});
