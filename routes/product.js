const router = require("express").Router();
const controller = require("../controllers/product");
const { ProductSchema, AllSchema } = require("../utils/schema");
const { validateBody, validateParam } = require("../utils/validator");
const { uploadMultipleFile } = require("../utils/gallery");

router.post("/", [
  // uploadMultipleFile,
  validateBody(ProductSchema.add),
  controller.add,
]);
router.get("/paginate/:page", controller.all);
router.get("/paginate/:type/:id/:page", controller.filterBy);

router
  .route("/:id")
  .get(validateParam(AllSchema.id, "id"), controller.get)
  .patch(
    [
      validateParam(AllSchema.id, "id"),
      // uploadMultipleFile,
      validateBody(ProductSchema.patch),
    ],
    controller.patch,
  )
  .delete(validateParam(AllSchema.id, "id"), controller.drop);
module.exports = router;
