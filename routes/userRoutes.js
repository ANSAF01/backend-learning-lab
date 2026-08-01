const router = require('express').Router();
router.get('/',(req,res)=>res.send('Get all Users'));
router.post('/',(req,res)=>res.send('Create User'));

module.exports = router;