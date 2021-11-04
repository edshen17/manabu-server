const scheduler = require('../../components/scheduler/schedule');

// route to redirect paypal
router.get('/calendar/:hostedBy/:tId', (req, res) => {
  res.redirect(`${getHost('client')}/calendar/${req.params.hostedBy}/${req.params.tId}`);
});

router.get('/cancel', (req, res) => {
  res.redirect(`${getHost('client')}/payment`);
});

module.exports = router;
