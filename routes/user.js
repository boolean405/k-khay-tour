const router = require('express').Router();
const controller = require('../controllers/user');
const { UserSchema } = require('../utils/schema');
const { validateBody, validateRole, validateToken } = require('../utils/validator');

router.get('/', controller.all);
router.post('/register', [validateBody(UserSchema.register), controller.register]);
router.post('/login', [validateBody(UserSchema.login), controller.login]);
router.post('/addrole', [validateToken(), validateRole('Owner'), validateBody(UserSchema.addRole), controller.addRole]);
router.post('/removerole', [validateToken(), validateRole('Owner'), validateBody(UserSchema.removeRole), controller.removeRole]);
router.post('/addpermit', [validateToken(), validateRole('Owner'), validateBody(UserSchema.addPermit), controller.addPermit]);
router.post('/removepermit', [validateToken(), validateRole('Owner'), validateBody(UserSchema.removePermit), controller.removePermit]);

module.exports = router;