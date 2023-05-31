// backend/routes/api/index.js
//where all our routers go????
const router = require('express').Router();

router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
  });





module.exports = router;
