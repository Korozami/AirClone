const express = require('express');
const router = express.Router();
const sequelize  = require('sequelize');
const { User, Spot, Review, SpotImages, Booking, ReviewImages } = require('../../db/models')
const { requireAuth } = require('../../utils/auth');

router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const reviews = await Review.findAll({
        where: { ownerId: userId },
        include: [
            {
                model: User,
                attributes: ["id", "firstName", "lastName",]
            },
            {
                model: ReviewImages,
                attributes: ["review_id", "url"],
            }
        ],
        group: ['ReviewImages.id']
    });

    return res.status(200).json({ Reviews: reviews })
});

module.exports = router;
