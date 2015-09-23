let log = require('printit')({
    prefix: 'controllers/categories',
    date: true
});

let h = require('../helpers');

// Model helpers
let mFindById, mCreate, mOperationsByCategoryId;
(function() {
    let BankCategory  = require('../models/category');
    let BankOperation = require('../models/operation');

    mFindById = h.promisify(::BankCategory.find);
    mCreate = h.promisify(::BankCategory.create);
    mOperationsByCategoryId = h.promisify(::BankOperation.allByCategory);
})();

export async function create(req, res) {
    let cat = req.body;

    // Missing parameters
    if (typeof cat.title === 'undefined')
        return h.sendErr(res, `when creating a category: ${cat}`, 400, "Missing category title");

    try {
        if (typeof cat.parentId !== 'undefined' && !await mFindById(cat.parentId)) {
            throw {
                status: 404,
                message: `Parent category ${cat.parentId} not found`
            };
        }
        let created = await mCreate(cat);
        res.status(200).send(created);
    } catch(err) {
        return h.asyncErr(res, err, 'when creating category');
    }
}

export async function preloadCategory(req, res, next, id) {
    let category;

    try {
        category = await mFindById(id);
    } catch(err) {
        return h.asyncErr(res, err, "when preloading a category");
    }

    if (!category)
        return h.sendErr(res, `Category ${id}`, 404, "Category not found");

    req.preloaded = {category};
    next();
}

export async function update(req, res) {
    let params = req.body;

    // missing parameters
    if (typeof params.title === 'undefined')
        return h.sendErr(res, `when updating category`, 400, "Missing title parameter");

    let category = req.preloaded.category;
    let updateAttributes = h.promisify(::category.updateAttributes);
    try {
        let newCat = await updateAttributes(params);
        res.status(200).send(newCat);
    } catch (err) {
        return h.asyncErr(res, err, "when updating a category");
    }
}

module.exports.delete = async function(req, res) {
    let replaceby = req.body.replaceByCategoryId;
    if (typeof replaceby === 'undefined')
        return h.sendErr(res, "when deleting category", 400, "Missing parameter replaceby");

    let former = req.preloaded.category;

    try {
        if (replaceby.toString() !== '-1') {
            log.debug(`Replacing category ${former.id} by ${replaceby}...`);
            if (!await mFindById(replaceby)) {
                throw {
                    status: 404,
                    message: "Replacement category not found"
                }
            }
        } else {
            log.debug(`No replacement category, replacing by None.`);
        }

        let newAttr = {
            categoryId: replaceby
        };

        let operations = await mOperationsByCategoryId(former.id);
        for (let op of operations) {
            await h.promisify(::op.updateAttributes)(newAttr);
        }

        await h.promisify(::former.destroy)();
        res.sendStatus(200);
    } catch (err) {
        return h.asyncErr(res, err, "when deleting a category");
    }
}