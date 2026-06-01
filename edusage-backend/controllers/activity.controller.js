const Activity = require("../models/Activity.model");

exports.getActivity = async (req, res) => {
  try {
    const items = await Activity.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    // Return both the activity items and the count for dashboard
    res.json({
      activities: items,
      count: items.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch activity" });
  }
};
