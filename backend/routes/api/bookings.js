const express = require('express');
const router = express.Router();
const { Op, sequelize}  = require('sequelize');
const { User, Spot, Review, SpotImages, Booking, ReviewImages } = require('../../db/models')
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

router.get('/current', requireAuth, async (req, res, next) => {
    const userId = req.user.id;
    const bookings = await Booking.findAll({
        where: { userId: userId },
        include: [
            {
                model: Spot,
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price', 'previewImage'],
            },
        ],
    });
    return res.status(200).json( { Bookings: bookings });
});

router.put('/:bookingsId', requireAuth, async (req, res, next) => {
    const id = req.params.bookingsId;
    const { startDate, endDate } = req.body;

    const booking = await Booking.findByPk(id);

    if(!booking) {
        const err = new Error("Booking couldn't be found");
        err.status = 404;
        return next(err);
    };

    const currentDate = new Date();
    if(currentDate > booking.endDate) {
        const err = new Error ("Past bookings can't be modified");
        err.status = 403;
        return next(err);
    };

    if(new Date(endDate) <= new Date(startDate)) {
        const err = new Error("endDate cannot come before startDate");
        res.status = 404;
        return next(err);
    };

    const spotId = booking.spotId;

    const booked = await Booking.findOne({
        where: {
            spotId,
            [Op.or]: [
                {
                    startDate: {
                        [Op.lte]: endDate,
                    },
                    endDate: {
                        [Op.gte]: startDate,
                    },
                },
            ],
        },
    });

    if(booked && booked.id !== id) {
        const err = new Error("Sorry this spot is already booked for the specified date");
        err.status = 403;
        err.errors = {
            startDate: "Start date conflicts with an existing booking",
            endDate: "End date conflicts with an exisiting booking",
        };
        return next(err);
    };

    booking.startDate = startDate;
    booking.endDate = endDate;

    await booking.save();

    return res.status(200).json(booking);
});

router.delete('/:id', requireAuth, async (req, res, next) => {
    const bookingId = req.params.id;

    const booking = await Booking.findByPk(bookingId);

    if(!booking) {
        const err = new Error("Booking couldn't be found");
        err.status = 404;
        return next(err);
    };

    const currentDate = new Date();
    if(currentDate >= booking.startDate) {
        const err = new Error("Bookings that have been started  can't be deleted");
        err.status = 403;
        return next(err);
    };

    await booking.destroy();

    return res.status(200).json({ message: 'Successfully deleted'});
});

module.exports = router;
