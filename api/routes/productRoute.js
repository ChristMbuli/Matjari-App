import express from "express";

const router = express();

router.get("/test", (req, res) => {
  console.log("ca marche");
});

router.post("/test", (req, res) => {
  console.log("ca marche");
});

router.put("/test", (req, res) => {
  console.log("ca marche");
});

export default router;
