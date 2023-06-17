const express = require('express');
const router = express.Router();
const sequelize  = require('sequelize');
const { Op, Sequelize } = require('sequelize');
const { User, Spot, Review, SpotImages, Booking, ReviewImages } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

router.delete('/:id', requireAuth, async (req, res, next) => {
    const spot_id = req.params.id;

    const spotImage = await SpotImages.findByPk(spot_id);

    if(!spotImage) {
        const err = new Error("Spot Image couldn't be found");
        err.status = 404;
        return next(err);
    };

    await spotImage.destroy();

    return res.status(200).json({ message: 'Successfully deleted'});
});

module.exports = router;
