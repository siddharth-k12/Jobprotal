const companyModel = require("../models/company.models");
const asyncHandler = require("../middlewares/asyncHandler");

// Create company
const createCompanyController = asyncHandler(async (req, res) => {
  const {
    companyName,
    website,
    industry,
    size,
    location,
    about,
  } = req.body;

  const userId = req.user;

  if (!companyName || !industry || !location || !about) {
    return res.status(400).json({
      success: false,
      message: "All required fields must be filled",
    });
  }

  const profile = await companyModel.create({
    createAt: userId,
    companyName: companyName.trim(),
    website: website?.trim(),
    industry: industry.trim().toUpperCase(),
    size,
    location: location.trim(),
    about: about.trim(),
  });

  return res.status(201).json({
    success: true,
    message: "Company created successfully",
    profile,
  });
});

// Get user's companies
const allComapanyController = asyncHandler(async (req, res) => {
  const userId = req.user;

  const company = await companyModel
    .find({ createAt: userId })
    .sort({ _id: -1 })
    .lean();

  return res.status(200).json({
    success: true,
    message: "Your listed companies",
    company,
  });
});

// Update company
const companyUpdateController = asyncHandler(async (req, res) => {
  const { companyId } = req.params;
  const userId = req.user;

  const {
    companyName,
    website,
    industry,
    size,
    location,
    about,
  } = req.body;

  const setData = {};

  if (companyName !== undefined) {
    setData.companyName = companyName.trim();
  }

  if (website !== undefined) {
    setData.website = website.trim();
  }

  if (industry !== undefined) {
    setData.industry = industry.trim().toUpperCase();
  }

  if (size !== undefined) {
    setData.size = size;
  }

  if (location !== undefined) {
    setData.location = location.trim();
  }

  if (about !== undefined) {
    setData.about = about.trim();
  }

  if (Object.keys(setData).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Nothing to update",
    });
  }

  const updateCompany = await companyModel.findOneAndUpdate(
    {
      _id: companyId,
      createAt: userId,
    },
    { $set: setData },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updateCompany) {
    return res.status(404).json({
      success: false,
      message: "Company not found or you are not authorized",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Company updated successfully",
    updateCompany,
  });
});

// Delete company
const companyDelete = asyncHandler(async (req, res) => {
  const { companyId } = req.params;
  const userId = req.user;

  // IMPORTANT: check ownership
  const deleteData = await companyModel.findOneAndDelete({
    _id: companyId,
    createAt: userId,
  });

  if (!deleteData) {
    return res.status(404).json({
      success: false,
      message: "Company not found or you are not authorized",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Company deleted successfully",
  });
});

// View company
const companyViewController = asyncHandler(async (req, res) => {
  const { companyId } = req.params;

  const company = await companyModel
    .findById(companyId)
    .lean();

  if (!company) {
    return res.status(404).json({
      success: false,
      message: "Company does not exist",
    });
  }

  return res.status(200).json({
    success: true,
    company,
  });
});

module.exports = {
  createCompanyController,
  allComapanyController,
  companyUpdateController,
  companyDelete,
  companyViewController,
};