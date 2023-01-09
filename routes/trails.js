const express=require('express');
const router=express.Router();
const trails=require('../controllers/trails');
const catchAsync=require('../utils/catchAsync');
const { trailSchema, reviewSchema }=require('../validationSchema.js');
const { isLoggedIn, isAuthor, validateTrail }=require('../middleware');
const multer=require('multer');
const { storage }=require('../cloudinary');
const upload=multer({ storage });

const Trail=require('../models/trail');

router.route('/')
    .get(catchAsync(trails.index))
    .post(isLoggedIn, upload.array('image'), validateTrail, catchAsync(trails.createTrail))

router.get('/new', isLoggedIn, trails.renderNewForm)

router.route('/:id')
    .get(catchAsync(trails.showTrail))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateTrail, catchAsync(trails.updateTrail))
    .delete(isLoggedIn, isAuthor, catchAsync(trails.deleteTrail));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(trails.renderEditForm))

module.exports=router;