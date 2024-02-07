const express = require("express");
const router = express.Router();
const Job = require("../models/job");
const verifyJwt = require("../middlewares/authMiddleware");

router.post("/create", verifyJwt, async (req, res) => {
  try {
    const { companyName, title, description, logoUrl, skills } = req.body;

    if (!companyName || !title || !description || !logoUrl || !skills) {
      return res.status(400).json({
        errorMessage: "Bad Request!",
      });
    }

    const jobDetails = new Job({
      companyName,
      title,
      description,
      logoUrl,
      skills,
      refUserId: req.body.userId,
    });

    await jobDetails.save();
    res.json({ message: "New job created successfully" });
  } catch (error) {
    console.log(error);
  }
});

router.put("/edit/:jobId", verifyJwt, async (req, res) => {
  try {
    const { companyName, title, description, logoUrl, skills } = req.body;
    const jobId = req.params.jobId;

    if (
      !companyName ||
      !title ||
      !description ||
      !logoUrl ||
      !jobId ||
      !skills
    ) {
      return res.status(400).json({
        errorMessage: "Bad Request",
      });
    }

    await Job.updateOne(
      { _id: jobId },
      {
        $set: {
          companyName,
          title,
          description,
          logoUrl,
          skills,
        },
      }
    );

    res.json({
      message: "Job details updated successfully",
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/job-description/:jobId", async (req, res) => {
  try {
    const jobId = req.params.jobId;

    if (!jobId) {
      return res.status(400).json({
        errorMessage: "Bad Request",
      });
    }

    const jobDetails = await Job.findById(jobId);

    res.json({
      data: jobDetails,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/all", async (req, res) => {
  try {
    const title = req.query.title || "";
    const skills = req.query.skills;
    const filterSkills = skills?.split(",");
    let filter = {};

    if (filterSkills) {
      filter = { skills: { $in: [...filterSkills] } };
    }

    const jobList = await Job.find(
      { title: { $regex: title, $options: "i" }, ...filter },
      {
        // companyName: true,
        // title: true,
      }
    );

    res.json({
      data: jobList,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
