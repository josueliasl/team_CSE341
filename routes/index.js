const router = require('express').Router();

router.use('/', require('./swagger'));


router.get('/', (req, res) => {
    //#swagger.tags=['Final Project']
    res.send('Final Project');
});

router.use('/players', require('./authors'));
router.use('/teams', require('./books'));


module.exports = router;