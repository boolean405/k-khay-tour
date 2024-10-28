const fs = require("fs");

let uploadSingleFile = async (req, res, next) => {
  if (req.files) {
    if (req.files.file) {
      let filename = req.files.file.name;
      filename = new Date().valueOf() + "_" + filename;
      await req.files.file.mv(`./uploads/${filename}`);
      req.body["image"] = filename;
      next();
    } else {
      next(new Error("Need file to upload"));
    }
  } else {
    // next(new Error('Need file to upload'));
    next();
  }
};

let uploadMultipleFile = async (req, res, next) => {
  console.log(req.files.files);
  if (req.files) {
    if (req.files.files) {
      let filenames = [];
      if (req.files.files.length > 1){ 
        req.files.files.forEach(async (file) => {
          let filename = new Date().valueOf() + "_" + file.name;
          filenames.push(filename);
          await file.mv(`./uploads/${filename}`);
        });
        req.body["images"] = filenames;
        next();
      } else if(req.files.files){
        let filename = new Date().valueOf() + "_" + req.files.files.name;
        filenames.push(filename);
        await req.files.files.mv(`./uploads/${filename}`);
        req.body["images"] = filenames;
        next();
      }
    } else {
      next(new Error("Need files to upload"));
    }
  } else {
    next(new Error("Need file to upload"));
    // next();
  }
};

let deleteFile = async (filename) => {
  let filepath = `./uploads/${filename}`;
  await fs.unlinkSync(filepath);
};

let deleteMultipleFile = async (filenames) => {
  filenames.forEach(async (filename) => {
    await deleteFile(filename);
  });
};

module.exports = {
  uploadSingleFile,
  uploadMultipleFile,
  deleteFile,
  deleteMultipleFile,
};
