const express = require('express');
const router = express.Router();
const sequelize  = require('sequelize');
const { User, Spot, Review, SpotImages, Booking, ReviewImages } = require('../../db/models')
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateReview = [
    check('review')
    .exists( { checkFalsy: true })
    .withMessage('Review text is required'),
    check('stars')
    .exists( { checkFalsy: true })
    .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const reviews = await Review.findAll({
        where: { user_id: userId },
        include: [
            {
                model: User,
                attributes: ["id", "firstName", "lastName",]
            },
            {
                model: Spot,
                attributes: ["id", "ownerId", "address", "city", "state", "country", "lat", "lng", "name", "price", "previewImage"],
            },
            {
                model: ReviewImages,
                attributes: ["review_id", "url"],
            }
        ],
        group: ['User.id','Spot.id','ReviewImages.id']
    });

    return res.status(200).json({ Reviews: reviews })
});

router.post('/:reviewId/images', requireAuth, async(req, res, next) => {
    const review_id = req.params.reviewId;
    const { url } = req.body;
    const user = req.user;

    const review = await Review.findByPk(review_id);

    if(review) {
        if(user.id === review.user_id) {
            const imageAmount = await ReviewImages.count({
                where: { review_id }
            });
            if(imageAmount > 10) {
                const err = new Error("Maximum number of images for this resource was reached");
                err.status = 403;
                return next(err);
            }
            const newImage = await ReviewImages.create({
                review_id: review_id,
                url
            });
            return res.status(200).json(newImage);
        } else return res.status(403).json({ message: "Forbidden"});
    } else return res.status(404).json({ message: "Review couldn't be found "});
});

router.put('/:reviewId', requireAuth, validateReview, async (req, res, next) => {
    const id = req.params.reviewId;
    const { review, stars } = req.body;
    const user = req.user;

    const reviews = await Review.findByPk(id);
    if(reviews) {
        if(user.id === reviews.user_id) {
            reviews.review = review;
            reviews.stars = stars;

            await reviews.save();

            return res.status(200).json(reviews);
        } else return res.status(403).json ({ message: "Forbidden!"});
    } else return res.status(404).json({ message: "Review couldn't be found"})

});

router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    const reviewId = req.params.reviewId;
    const user = req.user;

    const reviews = await Review.findByPk(reviewId);

    if(!reviews) {
    const err = new Error("Review couldn't be found");
    err.status = 404;
    return next(err);
    };

    if(user.id === reviews.user_id) {
        reviews.destroy();
        return res.status(200).json( {message: 'Successfully deleted'});
    } else return res.status(403).json({ message: "Forbidden!"});

});

module.exports = router;
