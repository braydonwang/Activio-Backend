const router = require("express").Router();
const PlanDraft = require("../models/PlanDraft");

//GET PLAN DRAFT
router.get("/:username", async (req, res) => {
  try {
    const plan = await PlanDraft.findOne({ username: req.params.username });
    res.status(200).json(plan);
  } catch (err) {
    res.status(500).json(err);
  }
});

//CREATE PLAN
router.post("/", async (req, res) => {
  const newPlan = new PlanDraft({ username: req.body.username, exercises: [] });
  try {
    const savedPlan = await newPlan.save();
    res.status(200).json(savedPlan);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//UPDATE EXERCISE IN DRAFT PLAN
router.put("/update", async (req, res) => {
  const { username, exercise } = req.body;
  const plan = await PlanDraft.findOne({ username });

  const index = plan.exercises
    .map((item) => item.id)
    .findIndex((id) => id === exercise.id);

  if (index === -1) {
    plan.exercises.push(exercise);
    plan.savedLayout.push({
      w: 1,
      h: 1,
      x: 0,
      y: plan.exercises.length - 1,
      i: exercise.name,
    });
  } else {
    plan.exercises = plan.exercises.map((item) =>
      item.id === exercise.id ? exercise : item
    );
  }

  const updatedPlan = await PlanDraft.findOneAndUpdate({ username }, plan, {
    new: true,
  });

  res.status(200).json(updatedPlan);
});

//REMOVE EXERCISE IN DRAFT PLAN
router.put("/remove", async (req, res) => {
  const { username, exercise } = req.body;
  const plan = await PlanDraft.findOne({ username });

  plan.exercises = plan.exercises.filter((item) => item.id !== exercise.id);
  let { y } = plan.savedLayout.find((item) => item.i === exercise.name);
  plan.savedLayout = plan.savedLayout.filter(
    (item) => item.i !== exercise.name
  );
  plan.savedLayout = plan.savedLayout.map((item) => {
    if (item.y > y) {
      return { ...item, y: item.y - 1 };
    } else {
      return item;
    }
  });

  const updatedPlan = await PlanDraft.findOneAndUpdate({ username }, plan, {
    new: true,
  });

  res.status(200).json(updatedPlan);
});

router.put("/layout", async (req, res) => {
  const { username, layout } = req.body;
  const plan = await PlanDraft.findOne({ username });

  plan.savedLayout = layout;

  const updatedPlan = await PlanDraft.findOneAndUpdate({ username }, plan, {
    new: true,
  });

  res.status(200).json(updatedPlan);
});

router.put("/copy", async (req, res) => {
  const { username, exercises, layout } = req.body;
  const plan = await PlanDraft.findOne({ username });

  plan.exercises = exercises;
  plan.savedLayout = layout;

  const updatedPlan = await PlanDraft.findOneAndUpdate({ username }, plan, {
    new: true,
  });

  res.status(200).json({ exercises, savedLayout: layout });
});

module.exports = router;
