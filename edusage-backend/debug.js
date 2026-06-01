console.log("Starting debug test...");

try {
  console.log("Testing mongoose...");
  const mongoose = require("mongoose");
  console.log("✓ Mongoose loaded");
} catch (e) {
  console.error("✗ Mongoose error:", e.message);
}

try {
  console.log("Testing express...");
  const express = require("express");
  console.log("✓ Express loaded");
} catch (e) {
  console.error("✗ Express error:", e.message);
}

try {
  console.log("Testing chromadb...");
  const { ChromaClient } = require("chromadb");
  console.log("✓ ChromaDB loaded");
} catch (e) {
  console.error("✗ ChromaDB error:", e.message);
}

try {
  console.log("Testing server.js...");
  require("./server.js");
  console.log("✓ Server started");
} catch (e) {
  console.error("✗ Server error:", e.message);
  console.error("Stack:", e.stack);
}

console.log("Debug test completed");
