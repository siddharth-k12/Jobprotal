const companyModel = require('../models/company.models');
const asyncHandler = require('../middlewares/asyncHandler')

const createCompanyController = asyncHandler(async(req,res)=>{
    const {companyName,website,industry,size,location,about}= req.body;
    const userId = req.user


    if(!companyName || !industry  || !location || !about){
        return res.status(400).json({
            message:"all filed is compulsory"
        })
    }

    // if(location) location = capitalizeFirstLetter(location)

    const profile = await companyModel.create({
        createAt:userId,
        companyName,
        website,
        industry,
        size,
        location,
        about
    })

    return res.status(201).json({
        message:"company is create ",
        profile,
        owner : userId
    })

})

const allComapanyController = asyncHandler(async(req,res)=>{
    const userId = req.user
    const company = await companyModel.find({createAt : userId})
    
    if(!company){
        return res.status(400).json({
            message:"your are not listed any companies"
        })
    }
    return res.status(200).json({
        message:"your listed companies",
        company
    })
})

//updated
const companyUpdateController = asyncHandler(async(req,res)=>{
    const {companyId} = req.params
    const userId = req.user

     const {companyName,website,industry,size,location,about}= req.body;

     const setData = {};
     if(companyName !== undefined) setData.companyName = companyName
     if(website !== undefined) setData.website = website
     if(industry !== undefined) setData.industry = industry
     if(size !== undefined) setData.size = size
     if(location !== undefined) setData.location = location
     if(about !== undefined) setData.about = about

     if(Object.keys(setData).length===0){
        return res.status(400).json({
            message:"nothing updated"
        })
     }
     
    const updateCompany = await companyModel.findOneAndUpdate(
        {_id:companyId , createAt:userId},  
        {$set : setData},
        {new:true}
    )

    if(!updateCompany){
        return res.status(404).json({
            message:"company is not found"
        })
    }
    return res.status(200).json({
        message:"company is updated",
        updateCompany
    })
})

//delete
const companyDelete = asyncHandler(async(req,res)=>{
    const {companyId} = req.params

    const deleteData = await companyModel.findByIdAndDelete(companyId)

    if(!deleteData){
        return res.status(404).json({
            message:"company not found"
        })
    }

    return res.status(200).json({
        message:"company is delete",
        deleteData
    })
})

const companyViewController = asyncHandler(async(req,res)=>{
    const {companyId} = req.params
    const company = await companyModel.findById({_id:companyId})

    if(!company){
        return res.status(400).json({
            message:"company don't exist"
        })
    }
    return res.status(200).json({
        message:"company is : ",
        company
    })
})


module.exports = {
    createCompanyController,
    allComapanyController,
    companyUpdateController,
    companyDelete,
    companyViewController
}