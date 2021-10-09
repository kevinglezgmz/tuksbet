const router = require('express').Router();

router.get('/:chatRoomId', (req, res) => {
  res.send('ChatRoom: ' + req.params.chatRoomId + ' route works');
});
router.post('/:chatRoomId', (req, res) => {});

module.exports = router;
