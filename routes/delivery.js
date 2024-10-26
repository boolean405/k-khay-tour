const router = require("express").Router();
const controller = require("../controllers/delivery");
const { uploadSingleFile } = require("../utils/gallery");
const { DeliverySchema, AllSchema } = require("../utils/schema");
const { validateBody, validateParam } = require("../utils/validator");

router.get("/", controller.all);
router.post("/", [
  uploadSingleFile,
  validateBody(DeliverySchema.add),
  controller.add,
]);

router
  .route("/:id")
  .get(validateParam(AllSchema.id, "id"), controller.get)
  .patch(
    [
      validateParam(AllSchema.id, "id"),
      uploadSingleFile,
      validateBody(DeliverySchema.patch),
    ],
    controller.patch,
  )
  .delete(validateParam(AllSchema.id, "id"), controller.drop);
module.exports = router;
