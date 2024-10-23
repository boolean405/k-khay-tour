const router = require('express').Router();
const controller = require('../controllers/category');
const { CategorySchema, AllSchema } = require('../utils/schema');
const { validateBody, validateParam } = require('../utils/validator');
const { uploadSingleFile } = require('../utils/gallery');

router.get('/', controller.all);
router.post('/', [validateBody(CategorySchema.add), uploadSingleFile, controller.add]);

router.route('/:id')
    .get(validateParam(AllSchema.id, 'id'), controller.get)
    .patch([validateParam(AllSchema.id, 'id'), validateBody(CategorySchema.patch), uploadSingleFile], controller.patch)
    .delete(validateParam(AllSchema.id, 'id'), controller.drop)
module.exports = router;