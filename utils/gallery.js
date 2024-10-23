const fs = require('fs');

let uploadSingleFile = async (req, res, next) => {
    if (req.files) {
        if (req.files.file) {
            let filename = req.files.file.name;
            filename = new Date().valueOf() + "_" + filename;
            req.files.file.mv(`./uploads/${filename}`);
            req.body['image'] = filename;
            next();
        } else {
            next(new Error('Need file to upload'));
        }
    } else {
        // next(new Error('Need file to upload'));
        next();
    }
}

let uploadMultipleFile = async (req, res, next) => {
    if (req.files) {
        if (req.files.files) {
            let filenames = [];
            req.files.files.forEach(file => {
                filename = new Date().valueOf() + "_" + file.name;
                filenames.push(filename);
                file.mv(`./uploads/${filename}`);
            });
            req.body['images'] = filenames;
            next();
        } else {
            next(new Error('Need files to upload'));
        }
    } else {
        // next(new Error('Need file to upload'));
        next();
    }
}


let deleteFile = async (filename) => {
    let filepath = `./uploads/${filename}`;
    await fs.unlinkSync(filepath);
}

let deleteMultipleFile = async (filenames) => {
    filenames.forEach(async filename => {
        await deleteFile(filename);
    });
}

module.exports = {
    uploadSingleFile,
    uploadMultipleFile,
    deleteFile,
    deleteMultipleFile
}