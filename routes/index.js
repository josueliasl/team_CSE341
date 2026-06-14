const router = require('express').Router();

router.use('/', require('./swagger'));


router.get('/', (req, res) => {
    //#swagger.tags=['Final Project']
    res.send('Final Project');
});

router.use('/authors', require('./authors'));
router.use('/books', require('./books'));
router.use('/users', require('./users'));
router.use('/libraries', require('./libraries'));
router.use('/auth', require('./auth'));


module.exports = router;