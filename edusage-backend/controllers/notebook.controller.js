const Notebook = require("../models/Notebook.model");
const Document = require("../models/Document.model");
const Activity = require("../models/Activity.model");
const chroma = require("../services/chroma.client");

exports.createNotebook = async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const notebook = await Notebook.create({
    title,
    userId: req.userId
  });

  // best-effort activity logging
  try {
    await Activity.create({
      userId: req.userId,
      type: "notebook_created",
      title,
      notebookId: notebook._id,
    });
  } catch (err) {
    console.warn("Failed to log notebook_created activity", err.message);
  }

  res.status(201).json(notebook);
};

exports.getNotebooks = async (req, res) => {
  const notebooks = await Notebook.find({ userId: req.userId })
    .sort({ createdAt: -1 });

  res.json(notebooks);
};

exports.deleteNotebook = async (req, res) => {
  const { notebookId } = req.params;

  try {
    /* -------- VERIFY NOTEBOOK -------- */
    const notebook = await Notebook.findOne({
      _id: notebookId,
      userId: req.userId
    });

    if (!notebook) {
      return res.status(404).json({ message: "Notebook not found" });
    }

    /* -------- DELETE DOCUMENTS -------- */
    await Document.deleteMany({ notebookId });

    /* -------- DELETE CHROMA COLLECTION -------- */
    try {
      await chroma.deleteCollection({
        name: `notebook_${notebookId}`
      });
    } catch (err) {
      // collection may not exist — safe to ignore
      console.warn("Chroma collection not found:", err.message);
    }

    /* -------- DELETE NOTEBOOK -------- */
    await Notebook.deleteOne({ _id: notebookId });

    // best-effort activity logging
    try {
      await Activity.create({
        userId: req.userId,
        type: "notebook_deleted",
        title: notebook.title,
        notebookId: notebook._id,
      });
    } catch (err) {
      console.warn("Failed to log notebook_deleted activity", err.message);
    }

    res.json({ message: "Notebook deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete notebook" });
  }
};