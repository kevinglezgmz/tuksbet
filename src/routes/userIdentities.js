const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('User identities route works');
});
router.get('/:identityId', (req, res) => {
  res.send('Identity with id: ' + req.params.identityId + ' route works');
});
router.post('/', (req, res) => {});
router.post('/:identityId', (req, res) => {});

module.exports = router;
