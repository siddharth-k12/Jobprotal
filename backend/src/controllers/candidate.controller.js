const asyncHandler = require("../middlewares/asyncHandler");
const candidateModel = require("../models/candidte.models");

// Normalize skills
const normalSkill = (skills) => {
  if (skills === undefined || skills === null) {
    return undefined;
  }

  if (Array.isArray(skills)) {
    return skills
      .map((skill) => String(skill).trim().toLowerCase())
      .filter(Boolean);
  }

  if (typeof skills === "string") {
    return skills
      .split(",")
      .map((skill) => skill.trim().toLowerCase())
      .filter(Boolean);
  }

  return [String(skills).trim().toLowerCase()].filter(Boolean);
};

// Create candidate profile
const candidateProfileController = asyncHandler(async (req, res) => {
  const userId = req.user;

  const { headline, skills, location } = req.body;

  if (!headline || !skills || !location) {
    return res.status(400).json({
      success: false,
      message: "Headline, skills and location are required",
    });
  }

  const formattedSkills = normalSkill(skills);

  if (!formattedSkills || formattedSkills.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Skills must contain at least one valid skill",
    });
  }

  // IMPORTANT: userId is stored inside candidate document
  const existingProfile = await candidateModel.findOne({
    userId,
  });

  if (existingProfile) {
    return res.status(409).json({
      success: false,
      message: "Candidate profile already exists",
    });
  }

  const profile = await candidateModel.create({
    userId,
    headline: headline.trim(),
    skills: formattedSkills,
    location: location.trim(),
  });

  return res.status(201).json({
    success: true,
    message: "Candidate profile created successfully",
    profile,
  });
});

// Add education
const candidateEducationController = asyncHandler(async (req, res) => {
  const userId = req.user;

  const {
    degree,
    collogeName,
    startYear,
    endYear,
  } = req.body;

  if (!degree || !collogeName || !startYear || !endYear) {
    return res.status(400).json({
      success: false,
      message: "All education fields are required",
    });
  }

  if (Number(startYear) > Number(endYear)) {
    return res.status(400).json({
      success: false,
      message: "Start year cannot be greater than end year",
    });
  }

  const profile = await candidateModel.findOneAndUpdate(
    { userId },
    {
      $push: {
        education: {
          degree: degree.trim(),
          collogeName: collogeName.trim(),
          startYear: Number(startYear),
          endYear: Number(endYear),
        },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: "Candidate profile not found",
    });
  }

  return res.status(201).json({
    success: true,
    message: "Education added successfully",
    profile,
  });
});

// Add experience
const candidateExpreienceController = asyncHandler(async (req, res) => {
  const userId = req.user;

  const {
    jobRole,
    companyName,
    employeType,
    startDate,
    endDate,
    isCurrent,
  } = req.body;

  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    return res.status(400).json({
      success: false,
      message: "Start date cannot be greater than end date",
    });
  }

  if (isCurrent === true && endDate) {
    return res.status(400).json({
      success: false,
      message: "Current experience should not have an end date",
    });
  }

  const profile = await candidateModel.findOneAndUpdate(
    { userId },
    {
      $push: {
        experience: {
          jobRole: jobRole?.trim(),
          companyName: companyName?.trim(),
          employeType,
          startDate,
          endDate: isCurrent ? undefined : endDate,
          isCurrent: Boolean(isCurrent),
        },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: "Candidate profile not found",
    });
  }

  return res.status(201).json({
    success: true,
    message: "Experience added successfully",
    profile,
  });
});

// Edit basic profile
const candidateProfileEditController = asyncHandler(async (req, res) => {
  const userId = req.user;

  const {
    headline,
    skills,
    location,
  } = req.body;

  const updateData = {};

  if (headline !== undefined) {
    updateData.headline = headline.trim();
  }

  if (location !== undefined) {
    updateData.location = location.trim();
  }

  if (skills !== undefined) {
    const formattedSkills = normalSkill(skills);

    if (!formattedSkills || formattedSkills.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Skills must contain at least one valid skill",
      });
    }

    updateData.skills = formattedSkills;
  }

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Nothing to update",
    });
  }

  const profile = await candidateModel.findOneAndUpdate(
    { userId },
    { $set: updateData },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: "Candidate profile not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    profile,
  });
});

// Edit education
const candidateEducationEditController = asyncHandler(async (req, res) => {
  const userId = req.user;
  const { educationId } = req.params;

  const {
    degree,
    collogeName,
    startYear,
    endYear,
  } = req.body;

  if (
    startYear !== undefined &&
    endYear !== undefined &&
    Number(startYear) > Number(endYear)
  ) {
    return res.status(400).json({
      success: false,
      message: "Start year cannot be greater than end year",
    });
  }

  const setData = {};

  if (degree !== undefined) {
    setData["education.$.degree"] = degree.trim();
  }

  if (collogeName !== undefined) {
    setData["education.$.collogeName"] = collogeName.trim();
  }

  if (startYear !== undefined) {
    setData["education.$.startYear"] = Number(startYear);
  }

  if (endYear !== undefined) {
    setData["education.$.endYear"] = Number(endYear);
  }

  if (Object.keys(setData).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Nothing to update",
    });
  }

  const profile = await candidateModel.findOneAndUpdate(
    {
      userId,
      "education._id": educationId,
    },
    { $set: setData },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: "Education record not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Education updated successfully",
    profile,
  });
});

// Edit experience
const candidateExpreienceEditController = asyncHandler(
  async (req, res) => {
    const userId = req.user;
    const { experienceId } = req.params;

    const {
      jobRole,
      companyName,
      employeType,
      startDate,
      endDate,
      isCurrent,
    } = req.body;

    const setData = {};

    if (jobRole !== undefined) {
      setData["experience.$.jobRole"] = jobRole.trim();
    }

    if (companyName !== undefined) {
      setData["experience.$.companyName"] = companyName.trim();
    }

    if (employeType !== undefined) {
      setData["experience.$.employeType"] = employeType;
    }

    if (startDate !== undefined) {
      setData["experience.$.startDate"] = startDate;
    }

    if (endDate !== undefined) {
      setData["experience.$.endDate"] = endDate;
    }

    if (isCurrent !== undefined) {
      setData["experience.$.isCurrent"] = isCurrent;
    }

    if (Object.keys(setData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Nothing to update",
      });
    }

    const profile = await candidateModel.findOneAndUpdate(
      {
        userId,
        "experience._id": experienceId,
      },
      { $set: setData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Experience record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Experience updated successfully",
      profile,
    });
  }
);

// Get candidate profile
const getCandidateController = asyncHandler(async (req, res) => {
  const userId = req.user;

  const candidate = await candidateModel
    .findOne({ userId })
    .lean();

  if (!candidate) {
    return res.status(404).json({
      success: false,
      message: "Candidate profile not found",
    });
  }

  return res.status(200).json({
    success: true,
    candidate,
  });
});

module.exports = {
  candidateProfileController,
  candidateEducationController,
  candidateExpreienceController,
  candidateProfileEditController,
  candidateEducationEditController,
  candidateExpreienceEditController,
  getCandidateController,
};