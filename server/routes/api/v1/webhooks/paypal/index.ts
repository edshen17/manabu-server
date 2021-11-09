import express from 'express';

const paypal = express.Router();

paypal.post('/', (req, res, next) => {
  console.log('hi');
  console.dir(req.body, { depth: null });
});

export { paypal };
