const express = require('express');
const router = express.Router();
const sequelize  = require('sequelize');
const { Op, Sequelize } = require('sequelize');
const { User, Spot, Review, SpotImages, Booking, ReviewImages } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

router.delete('/:id', requireAuth, async (req, res, next) => {
    const review_id = req.params.id;

    const reviewImage = await ReviewImages.findByPk(review_id);

    if(!reviewImage) {
        const err = new Error("Review Image couldn't be found");
        err.status = 404;
        return next(err);
    };

    await reviewImage.destroy();

    return res.status(200).json({ message: 'Successfully deleted'});
});

module.exports = router;
