const { Router } = require('express');

const router = new Router();

router.route('/').get((req, res) => {
  res.send('');
});


module.exports = router;
