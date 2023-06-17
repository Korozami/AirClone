const express = require('express');
const router = express.Router();
const sequelize  = require('sequelize');
const { Op, Sequelize } = require('sequelize');
const { User, Spot, Review, SpotImages, Booking, ReviewImages } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const validateSpot = [
    check('address')
    .exists( { checkFalsy: true })
    .withMessage('Street address is required'),
    check('city')
    .exists( { checkFalsy: true })
    .withMessage('City is required'),
    check('state')
    .exists( { checkFalsy: true })
    .withMessage('State is required'),
    check('country')
    .exists( { checkFalsy: true })
    .withMessage('Country is required'),
    check('lat')
    .exists( { checkFalsy: true })
    .withMessage('Latitude is not valid'),
    check('lng')
    .exists( { checkFalsy: true })
    .withMessage('Longitude is not valid'),
    check('name')
    .exists( { checkFalsy: true })
    .withMessage('Name must be less than 50 characters'),
    check('description')
    .exists( { checkFalsy: true })
    .withMessage('Description is required'),
    check('price')
    .exists( { checkFalsy: true })
    .withMessage('Price per day is required'),
    handleValidationErrors
];

const validateReview = [
    check('reviews')
    .exists( { checkFalsy: true })
    .withMessage('Review text is required'),
    check('stars')
    .exists( { checkFalsy: true })
    .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];


router.get('/', async (req, res) => {

    let avgRating = sequelize.fn('AVG', sequelize.col('Reviews.stars'));

    const spots = await Spot.findAll({

        group: ['Spot.Id'],

        include: [
            {
                model: Review,
                attributes: []
            }
        ],
        attributes: [
            'id',
            'ownerId',
            'address',
            'city',
            'state',
            'country',
            'lat',
            'lng',
            'name',
            'description',
            'price',
            'createdAt',
            'updatedAt',
            [avgRating, 'avgRating']
        ]

    });

    return res.status(200).json(spots);
});

router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const spots = await Spot.findAll({
      where: { ownerId: userId },
      include: [
        {
          model: Review,
          attributes: []
        }
      ],
      attributes: {
        include: [
          [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating']
        ]
      },
      group: ['Spot.id']
    });

    return res.status(200).json({ Spots: spots})
  });

router.get('/:spotId', requireAuth, async (req, res, next) => {
    const spotid = req.params.spotId;

    const spots = await Spot.findByPk(spotid, {
        attributes: {
            include: [
            'id',
            'ownerId',
            'address',
            'city',
            'state',
            'country',
            'lat',
            'lng',
            'name',
            'description',
            'price',
            'createdAt',
            'updatedAt',
            [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating'],
            [sequelize.fn('AVG', sequelize.col('Reviews.id')), 'numReviews']
        ],
    },
        include: [
            {
                model: Review,
                attributes: ['id', 'spotId'],
            },
            {
                model: SpotImages,
                attributes: ['id', 'url', 'preview'],
            },
            {
                model: User,
                as: 'Owner',
                attributes: ['id', 'firstName', 'lastName']
            }
        ],
        group: ['Spot.Id', 'Owner.id', 'SpotImages.id'],
    });

    if(!spots) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    }

    return res.status(200).json(spots);

    //idk too
});


router.post('/', requireAuth, validateSpot, async (req, res, next) => {
    const ownerId = req.user.id;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const spot = await Spot.create({
        ownerId: ownerId,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    });

    return res.status(201).json(spot);
});

router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const spotId = req.params.spotId;
    const { url, preview } = req.body;

    if(!spotId) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    };

    const newImage = await SpotImages.create({
        spot_id: spotId,
        url,
        preview
    });

    return res.status(200).json(newImage);
});

router.put('/:spotId', validateSpot, requireAuth, async (req, res, next) => {
    const spotid = req.params.spotId;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const spot = await Spot.findByPk(spotid);

    if(!spot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    };



    spot.address = address;
    spot.city = city;
    spot.state = state;
    spot.country = country;
    spot.lat = lat;
    spot.lng = lng;
    spot.name = name;
    spot.description = description;
    spot.price = price;

    await spot.save();

    return res.status(200).json(spot);
});

router.delete('/:spotId' , requireAuth, async (req, res, next) => {
    const user = req.user;
    const spotId = req.params.spotId;

    const currentSpot = await Spot.findByPk(spotId)

    if(currentSpot) {
        if(user.id === currentSpot.ownerId) {
            currentSpot.destroy()
          return res.status(200).json('Successfully deleted')
        } else return res.status(403).json("Forbiden")
    } else return res.status(404).json("Spot couldn't be found")
});

router.get('/:spotId/reviews', requireAuth, async (req, res, next) => {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);
    if(!spot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    };

    const reviews = await Review.findAll({
        where: { spotId },
        include: [
            {
                model: User,
                attributes: ["id", "firstName", "lastName"],
            },
            {
                model: ReviewImages,
                attributes: ["id", "url"],
            },
        ],
    });

    return res.status(200).json ({ Reviews: reviews });
});

router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {
    const spotId = req.params.spotId;
    const user_id = req.user.id;
    const spot = await Spot.findByPk(spotId);
    const { reviews, stars } = req.body;
    if(!spot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    };
    const reviewExist = await Review.findOne({
        where: { spotId, user_id}
    });
    if(reviewExist) {
        const err = new Error("User already has a review for this spot");
        err.status = 500;
        return next(err);
    };
    const newReview = await Review.create({
        user_id: user_id,
        spotId: spotId,
        reviews,
        stars
    });

    return res.status(201).json(newReview);
});

router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);
    if(!spot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    };
    const ownerbookings = await Booking.findAll({
        where: {spotId},
        include: {
            model: User,
            attributes: ['firstName', 'lastName'],
        },
    });
    const booking = await Booking.findByPk(spotId);

    if(req.user.id === spot.ownerId) {
        return res.status(200).json({Bookings: ownerbookings})
    } else {
        return res.status(200).json({ Bookings: booking});
    }

});

router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const spotId = req.params.spotId;
    const user_id = req.user.id;
    const spot = await Spot.findByPk(spotId);
    const { startDate, endDate } = req.body;
    if(!spot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    };
    if(new Date(endDate) <= new Date(startDate)) {
        const err = new Error('endDate cannot be on or before startDate');
        err.status = 400;
        return next(err);
    };
    const existBooking = await Booking.findOne({
        where: {
            spotId: spot.id,
            [Op.or]:[
                {
                    startDate: {
                        [Op.lte]: endDate,
                    },
                    endDate: {
                        [Op.gte]: startDate,
                    },
                },
                {
                    startDate: {
                        [Op.between]: [startDate, endDate],
                    },
                },
                {
                    endDate: {
                        [Op.between]: [startDate, endDate],
                    },
                },
            ],
        },
    });
    if(existBooking) {
        const err = new Error("Sorry, this spot is already booked for the specified dates");
        err.status = 403;
        err.errors = {
            startDate: "Start date conflicts with an existing booking",
            endDate: "End date conflicts with an existing booking",
        };
        return next(err);
    };

    const newBooking = await Booking.create({
        userBooking: user_id,
        spotBooking: spotId,
        startDate,
        endDate
    });

    return res.status(200).json({
        id: newBooking.id,
        spotBooking: newBooking.spotBooking,
        userBooking: newBooking.userBooking,
        startDate: newBooking.startDate,
        endDate: newBooking.endDate,
        createdAt: newBooking.createdAt,
        updatedAt: newBooking.createdAt
    });
});


module.exports = router;
