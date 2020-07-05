const express = require("express");
const router = express.Router();

const Item = require("./ItemsModel");

/** GET: get all items */
router.get("/", (req, res, next) => {
    Item.find((err, items) => {
        if (err) return next(err);
        res.status(200).json(items);
    });
});

/** GET: get a specific item */
router.get("/:id", (req, res, next) => {
    Item.findById(req.params.id, (err, item) => {
        if (err) return next(err);
        res.status(200).json(item);
    });
});

/** PUT: update a specific item */
router.put("/:id", (req, res, next) => {
    Item.findByIdAndUpdate(req.params.id, {
        $set:
            {
                title: req.body.title,
                description: req.body.description,
                completed: req.body.completed,
                urgent: req.body.urgent,
                important: req.body.important,
                targetDate: req.body.targetDate
            }
    }, {new: true}, (err, item) => {
        if (err) return next(err);
        res.status(200).json(item);
    });
});

/** POST: add a new item */
router.post("/", (req, res, next) => {
    Item.create(
        {
            title: req.body.title,
            description: req.body.description,
            completed: req.body.completed,
            urgent: req.body.urgent,
            important: req.body.important,
            targetDate: req.body.targetDate
        }, (err, item) => {
            if (err) return next(err);
            res.status(201).json(item);
        }
    );
});

/** DELETE: delete a specific item */
router.delete("/:id", (req, res, next) => {
    Item.findByIdAndRemove(req.params.id, err => {
        if (err) return next(err);
        res.status(204).send();
    });
});

module.exports = router;
