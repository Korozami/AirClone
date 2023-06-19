const express = require('express');
const router = express.Router();
const sequelize  = require('sequelize');
const { Op, Sequelize } = require('sequelize');
const { User, Spot, Review, SpotImages, Booking, ReviewImages } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

router.delete('/:id', requireAuth, async (req, res, next) => {
    const id = req.params.id;
    const user = req.user;
    const spotImage = await SpotImages.findByPk(id);
    const spotId = spotImage.spot_id;
    const currentSpot = await Spot.findByPk(spotId);

    if(!spotImage) {
        const err = new Error("Spot Image couldn't be found");
        err.status = 404;
        return next(err);
    };

    if(user.id === currentSpot.ownerId) {
        spotImage.destroy();
        return res.status(200).json({ message: 'Successfully deleted'});
    } else return res.status(403).json({ message: "Forbidden!"});

});

module.exports = router;
