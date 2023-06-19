const express = require('express');
const router = express.Router();
const sequelize  = require('sequelize');
const { Op, Sequelize } = require('sequelize');
const { User, Spot, Review, SpotImages, Booking, ReviewImages } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

router.delete('/:id', requireAuth, async (req, res, next) => {
    const id = req.params.id;
    const user = req.user;
    const reviewImage = await ReviewImages.findByPk(id);
    const reviewId = reviewImage.review_id;
    const reviews = await Review.findByPk(reviewId);


    if(!reviewImage) {
        const err = new Error("Review Image couldn't be found");
        err.status = 404;
        return next(err);
    };

    if(user.id === reviews.user_id) {
        reviewImage.destroy();
        return res.status(200).json({ message: 'Successfully deleted'});
    } else return res.status(403).json({ message: "Forbidden!"});
});

module.exports = router;
