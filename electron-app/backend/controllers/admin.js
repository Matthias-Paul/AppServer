import fs from 'fs'
import path from 'path'
import User from "../models/users.model.js";
import { Op } from "sequelize";
import Service from "../models/service.model.js";
import Media from '../models/media.model.js';
import ServiceMedia from '../models/service-media.model.js';
import { validationResult, matchedData } from "express-validator"


export const getUsers = async (req, res) => {
  try {
    if (!req.user || !req.user.id || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { search, filter } = req.query;

    let whereClause = {};

    if (filter && filter.toLowerCase() !== "all") {
      whereClause.role = filter;
    }

    
    if (search) {
    whereClause[Op.or] = [
        { username: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { role: { [Op.like]: `%${search}%` } },
    ];
    }

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["created_at", "DESC"]],
      attributes: { exclude: ['password_hash'] },
    });

    const hasNextPage = page * limit < count;

    return res.status(200).json({
      success: true,
      users,
      hasNextPage,
    });

  } catch (error) {
    console.error("GetUsers error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



export const createService = async(req, res)=>{
      
  
  try {
        const { name, theme, description, isActive } = req.body
        if(!name){
          return res.status(400).json({
            success: false,
            message: "Name is required",
          }); 
        }
// Handle file upload
  let bannerPath = null;
    if (req.file) {
      bannerPath = `/fileStorage/images/${req.file.filename}`;
    }
     console.log(bannerPath)
    const service = await Service.create({
      name,
      description,
      theme,
      is_active: isActive === 'true',
      banner_image: bannerPath,
    });


    
    return res.status(201).json({
      success: true,
      id:service.id,
      message: 'Service created successfully',
      service,
    })


  } catch (error) {
   console.error("GetUsers error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    }); 
  }
}

export const getServices =async(req, res)=>{

  try {

    const { id } = req.params

    const serviceDetails = await Service.findByPk(id)
    if(!serviceDetails){
      return res.status(404).json({
      success: false,
      message: "Service not found",
    }); 
    }

    return res.status(200).json({
      success: true,
      serviceDetails
    }); 
  
  } catch (error) {
    console.error("serviceDetails error:", error.message);
    return res.status(500).json({
          success: false,
          message: "Internal Server Error",
        }); 
    
  }
}




export const addMedia = async(req, res)=>{


  try {
      if (!req.user || !req.user.id || req.user.role !== "admin") {
          return res.status(403).json({
            success: false,
            message: "Unauthorized access",
          });
        }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' })
    }

    const { id } = req.params;
    const { title, description, price, file_type } = req.body;

    const filePath = `/fileStorage/${file_type}s/${req.file.filename}`
    console.log(filePath)
    const fileSizeInMB = (req.file.size / (1024 * 1024)).toFixed(2);

    const media = await Media.create({
      title,
      description,
      file_path: filePath,
      file_type: file_type,
      file_size: fileSizeInMB,
      price
    })

    await ServiceMedia.create({
      service_id: id,
      media_id: media.id,
    });

    res.status(201).json({ success: true, media });


    
  } catch (error) {
    console.error("add service error:", error.message);
    return res.status(500).json({
          success: false,
          message: "Internal Server Error",
    }); 
  }
}




export const getServiceMedia = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await Service.findByPk(serviceId, {
      include: [
        {
          model: Media,
          as: 'media_files', 
        },
      ],
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      media: service.media_files,
    });
  } catch (error) {
    console.error("getServiceMedia error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


