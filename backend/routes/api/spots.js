const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { requireAuth } = require('../../utils/auth');

router.get('/', async (req, res) => {
    const { spot } = req;
    if(spot) {
        const place = {
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createAt: spot.createAt,
            updateAt: spot.updateAt,
            avgRating: spot.avgRating,
            previewImage: spot.previewImage
        };

        return res.json({
            spot: place
        });
    }
});

module.exports = router;
