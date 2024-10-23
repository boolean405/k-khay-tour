const router = require('express').Router();
const controller = require('../controllers/child_category');
const { uploadSingleFile } = require('../utils/gallery');
const { ChildCategorySchema, AllSchema } = require('../utils/schema');
const { validateBody, validateParam } = require('../utils/validator');

router.get('/', controller.all);
router.post('/', [validateBody(ChildCategorySchema.add), uploadSingleFile, controller.add]);

router.route('/:id')
    .get(validateParam(AllSchema.id, 'id'), controller.get)
    .patch([validateParam(AllSchema.id, 'id'), validateBody(ChildCategorySchema.patch), uploadSingleFile], controller.patch)
    .delete(validateParam(AllSchema.id, 'id'), controller.drop)
module.exports = router;