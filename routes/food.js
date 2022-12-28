const router = require("express").Router();
const Food = require("../models/Food");

// GET FOOD
router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const food = await Food.find({ username });
    res.status(200).json(food);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ADD FOOD
router.post("/", async (req, res) => {
  const newFood = new Food(req.body);
  try {
    const savedFood = await newFood.save();
    res.status(200).json(savedFood);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// EDIT FOOD
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFood = await Food.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({ id, data: updatedFood });
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE FOOD ITEM
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedFood = await Food.findByIdAndDelete(id);
    res.status(200).json(id);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
