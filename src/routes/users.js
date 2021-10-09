const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('Users route works');
});

router.get('/:userId', (req, res) => {
  console.log(req.params);
  res.send('User with id: ' + req.params.userId + ' route works');
});

router.post('/', (req, res) => {});

router.post('/:userId', (req, res) => {});

router.put('/:userId', (req, res) => {});

module.exports = router;
