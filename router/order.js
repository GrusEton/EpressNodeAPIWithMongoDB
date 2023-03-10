const router = require("express").Router();
const mongoose = require("mongoose");
const Order = require("../model/order");

router.get("/", (req, res) => {
	Order.find()
		.select("product quantity")
		.populate("product", "name price")
		.exec()
		.then((result) => {
			res.status(201).json(result);
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
});

router.get("/:orderId", (req, res) => {
	let id = req.params.orderId;

	Order.findOne({ _id: id })
		.exec()
		.then((result) => {
			if (result != null) {
				res.status(200).json(result);
			} else {
				res.status(404).json({
					message: "Item not found",
				});
			}
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
});

router.patch("/:orderId", (req, res) => {
	let id = req.params.orderId;
	Order.updateOne(
		{ _id: id },
		{
			product: req.body.productId,
			quantity: req.body.quantity,
		}
	)
		.then(() => {
			res.status(200).json({
				_id: id,
				product: req.body.productId,
				quantity: req.body.quantity,
			});
		})
		.catch(() => {
			res.send("An error occured");
		});
});

router.post("/", (req, res) => {
	const order = new Order({
		_id: new mongoose.Types.ObjectId(),
		product: req.body.productId,
		quantity: req.body.quantity,
	});

	order
		.save()
		.then((result) => {
			res.status(200).json(result);
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
});

router.delete("/:orderId", (req, res) => {
	Order.deleteOne({ _id: req.params.orderId })
		.then((result) => {
			res.status(200).json({
				message: "Order deleted",
				result,
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
});
module.exports = router;
