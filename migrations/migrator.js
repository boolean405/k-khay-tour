const fs = require('fs');
const Helper = require('../utils/helper');
const UserDB = require('../models/user');
const RoleDB = require('../models/role');
const PermitDB = require('../models/permit');
const CategoryDB = require('../models/category');
const SubCategoryDB = require('../models/sub_category');
const ChildCategoryDB = require('../models/child_category');
const TagDB = require('../models/tag');
const ProductDB = require('../models/product');

const defaultDataMigrate = async () => {
    let data = fs.readFileSync('./migrations/default_data.json');
    if (data) {
        let defaultData = JSON.parse(data);

        if (defaultData.users) {
            defaultData.users.forEach(async (user) => {
                user.password = Helper.encode(user.password);
                let dbUserName = await UserDB.findOne({ name: user.name });
                if (dbUserName) {
                    console.log(`Skipped, ${user.name} User is already exist`);
                } else {
                    await new UserDB(user).save();
                    console.log(`Success, ${user.name} User migration`);
                }
            });
        }
        await Helper.timer(1);
        if (defaultData.roles) {
            defaultData.roles.forEach(async (role) => {
                let dbRoleName = await RoleDB.findOne({ name: role.name });
                if (dbRoleName) {
                    console.log(`Skipped, ${role.name} Role is already exist`);
                } else {
                    await new RoleDB(role).save();
                    console.log(`Success, ${role.name} Role migration`);
                }
            });
        }
        await Helper.timer(1);
        if (defaultData.permits) {
            defaultData.permits.forEach(async (permit) => {
                let dbPermitName = await PermitDB.findOne({ name: permit.name });
                if (dbPermitName) {
                    console.log(`Skipped, ${permit.name} Permit is already exist`);
                } else {
                    await new PermitDB(permit).save();
                    console.log(`Success, ${permit.name} Permit migration`);
                }
            });
        }
        await Helper.timer(1);
        if (defaultData.categories) {
            defaultData.categories.forEach(async (category) => {
                let dbCategoryName = await CategoryDB.findOne({ name: category.name });
                if (dbCategoryName) {
                    console.log(`Skipped, ${category.name} Category is already exist`);
                } else {
                    await new CategoryDB(category).save();
                    console.log(`Success, ${category.name} Category migration`);
                }
            });
        }
        await Helper.timer(1);
        if (defaultData.sub_categories) {
            defaultData.sub_categories.forEach(async (sub_category) => {
                let dbSubCategoryName = await SubCategoryDB.findOne({ name: sub_category.name });
                if (dbSubCategoryName) {
                    console.log(`Skipped, ${sub_category.name} Sub Category is already exist`);
                } else {
                    await new SubCategoryDB(sub_category).save();
                    console.log(`Success, ${sub_category.name} Sub Category migration`);
                }
            });
        }
        await Helper.timer(1);
        if (defaultData.child_categories) {
            defaultData.child_categories.forEach(async (child_category) => {
                let dbChildCategoryName = await ChildCategoryDB.findOne({ name: child_category.name });
                if (dbChildCategoryName) {
                    console.log(`Skipped, ${child_category.name} Child Category is already exist`);
                } else {
                    await new ChildCategoryDB(child_category).save();
                    console.log(`Success, ${child_category.name} Child Category migration`);
                }
            });
        }
        await Helper.timer(1);
        if (defaultData.tags) {
            defaultData.tags.forEach(async (tag) => {
                let dbTagName = await TagDB.findOne({ name: tag.name });
                if (dbTagName) {
                    console.log(`Skipped, ${tag.name} Tag is already exist`);
                } else {
                    await new TagDB(tag).save();
                    console.log(`Success, ${tag.name} Tag migration`);
                }
            });
        }
        await Helper.timer(1);
        if (defaultData.products) {
            defaultData.products.forEach(async (product) => {
                let dbProductName = await ProductDB.findOne({ name: product.name });
                if (dbProductName) {
                    console.log(`Skipped, ${product.name} Product is already exist`);
                } else {
                    await new ProductDB(product).save();
                    console.log(`Success, ${product.name} Product migration`);
                }
            });
        }
    }
    await Helper.timer(1);
    await addRoleToUser('Owner', 'Owner');
    await Helper.timer(1);
    await addCategoryToProduct('Phuket', 'Phi Phi Island');
    await Helper.timer(1);
    addSubCatToProduct('Island', 'Phi Phi Island');
    await Helper.timer(1);
    addTagToProduct('Popular', 'Phi Phi Island');
    // await Helper.timer(1);
    // await addSubCatToChildCat('Island', 'Phi Phi Island');
    // await Helper.timer(1);
    // await addChildCatToSubCat('Phi Phi Island', 'Island');
}

const addRoleToUser = async (roleName, userName) => {
    let dbUser = await UserDB.findOne({ name: userName });
    let dbRole = await RoleDB.findOne({ name: roleName });
    if (dbUser && dbRole) {
        if (dbUser.roles.length > 0) {
            dbUser.roles.forEach(async (role) => {
                if (role.equals(dbRole._id)) {
                    console.log(`Skipped, ${dbRole.name} Role is already exist in ${dbUser.name} User`);
                } else {
                    await UserDB.findByIdAndUpdate(dbUser._id, { $addToSet: { roles: dbRole._id } });
                    console.log(`Success, ${roleName} Role is added to ${userName} User`);
                }
            });
        } else {
            await UserDB.findByIdAndUpdate(dbUser._id, { $addToSet: { roles: dbRole._id } });
            console.log(`Success, ${roleName} Role is added to ${userName} User`);
        }
    }
}

const addCategoryToProduct = async (cat, product) => {
    let dbCat = await CategoryDB.findOne({ name: cat });
    let dbProduct = await ProductDB.findOne({ name: product });
    if (dbCat && dbProduct) {
        if (dbCat._id.equals(dbProduct.category)) {
            console.log(`Skipped, ${dbCat.name} Category is already exist in ${dbProduct.name} Product Category`);
        } else {
            await ProductDB.findByIdAndUpdate(dbProduct._id, { $push: { category: dbCat._id } });
            console.log(`Success, ${dbCat.name} Category is added to ${dbProduct.name} Product Category`);
        }
    }
}

const addSubCatToProduct = async (sub_cat, product) => {
    let dbSubCat = await SubCategoryDB.findOne({ name: sub_cat });
    let dbProduct = await ProductDB.findOne({ name: product });
    if (dbSubCat && dbProduct) {
        if (dbSubCat._id.equals(dbProduct.sub_category)) {
            console.log(`Skipped, ${dbSubCat.name} Sub Category is already exist in ${dbProduct.name} Product Sub Category`);
        } else {
            await ProductDB.findByIdAndUpdate(dbProduct._id, { $push: { sub_category: dbSubCat._id } });
            console.log(`Success, ${dbSubCat.name} Sub Category is added to ${dbProduct.name} Product Sub Category`);
        }
    }
}

const addTagToProduct = async (tag, product) => {
    let dbTag = await TagDB.findOne({ name: tag });
    let dbProduct = await ProductDB.findOne({ name: product });
    if (dbTag && dbProduct) {
        if (dbProduct.tags.length > 0) {
            dbProduct.tags.forEach(async (ltag) => {
                if (ltag.equals(dbTag._id)) {
                    console.log(`Skipped, ${dbTag.name} Tag is already exist in ${dbProduct.name} Product`);
                } else {
                    await ProductDB.findByIdAndUpdate(dbProduct._id, { $push: { tags: dbTag._id } });
                    console.log(`Success, ${dbTag.name} Tag is added to ${dbProduct.name} Product`);
                }
            });
        } else {
            await ProductDB.findByIdAndUpdate(dbProduct._id, { $push: { tags: dbTag._id } });
            console.log(`Success, ${dbTag.name} Tag is added to ${dbProduct.name} Product`);
        }
    }
}

const addSubCatToChildCat = async (sub_cat, child_cat) => {
    let dbSubCat = await SubCategoryDB.findOne({ name: sub_cat });
    let dbChildCat = await ChildCategoryDB.findOne({ name: child_cat });
    if (dbSubCat && dbChildCat) {
        if (dbSubCat._id.equals(dbChildCat.sub_category)) {
            console.log(`Skipped, ${dbSubCat.name} Sub Category is already exist in ${dbChildCat.name} Child Category`);
        } else {
            await ChildCategoryDB.findByIdAndUpdate(dbChildCat._id, { $push: { sub_category: dbSubCat._id } });
            console.log(`Success, ${dbSubCat.name} Sub Category is added to ${dbChildCat.name} Child Category`);
        }
    }
}

const addChildCatToSubCat = async (child_cat, sub_cat) => {
    let dbSubCat = await SubCategoryDB.findOne({ name: sub_cat });
    let dbChildCat = await ChildCategoryDB.findOne({ name: child_cat });
    if (dbSubCat && dbChildCat) {
        if (dbSubCat.child_categories.length > 0) {
            dbSubCat.child_categories.forEach(async (child_category) => {
                if (child_category.equals(dbChildCat._id)) {
                    console.log(`Skipped, ${dbChildCat.name} Child Category is already exist in ${dbSubCat.name} Sub Category`);
                } else {
                    await SubCategoryDB.findByIdAndUpdate(dbSubCat._id, { $push: { child_categories: dbChildCat._id } });
                    console.log(`Success, ${dbChildCat.name} Child Category is added to ${dbSubCat.name} Sub Category`);
                }
            });
        } else {
            await SubCategoryDB.findByIdAndUpdate(dbSubCat._id, { $push: { child_categories: dbChildCat._id } });
            console.log(`Success, ${dbChildCat.name} Child Category is added to ${dbSubCat.name} Sub Category`);
        }
    }
}

const backup = async () => {
    let users = await UserDB.find();
    let roles = await RoleDB.find();
    let permits = await PermitDB.find();
    let categories = await CategoryDB.find();
    let subCategories = await SubCategoryDB.find();
    let childCategories = await ChildCategoryDB.find();
    let tags = await TagDB.find();
    let products = await ProductDB.find();

    fs.writeFileSync('./migrations/backups/users.json', JSON.stringify(users));
    fs.writeFileSync('./migrations/backups/roles.json', JSON.stringify(roles));
    fs.writeFileSync('./migrations/backups/permits.json', JSON.stringify(permits));
    fs.writeFileSync('./migrations/backups/category.json', JSON.stringify(categories));
    fs.writeFileSync('./migrations/backups/sub_categories.json', JSON.stringify(subCategories));
    fs.writeFileSync('./migrations/backups/child_categories.json', JSON.stringify(childCategories));
    fs.writeFileSync('./migrations/backups/tags.json', JSON.stringify(tags));
    fs.writeFileSync('./migrations/backups/product.json', JSON.stringify(products));
    console.log('Success, All Databases Backup Finished');
}


module.exports = {
    defaultDataMigrate,
    backup
}

