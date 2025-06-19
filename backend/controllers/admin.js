import fs from 'fs'
import path from 'path'
import User from '../models/users.model.js'
import Service from '../models/service.model.js'
import Media from '../models/media.model.js'
import ServiceMedia from '../models/service-media.model.js'
import ChurchSetting from "../models/ChurchSettings.model.js"
import { v4 as uuidv4 } from 'uuid'
import { Op, literal } from 'sequelize'
import { validationResult, matchedData } from 'express-validator'
import bcryptjs from 'bcryptjs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'



export const getUsers = async (req, res) => {
  try {
    if (!req.user || !req.user.id || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      })
    }

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const offset = (page - 1) * limit
    const { search, filter } = req.query

    let whereClause = {}

    if (filter && filter.toLowerCase() !== 'all') {
      whereClause.role = filter
    }

    if (search) {
      whereClause[Op.or] = [
        { username: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { role: { [Op.like]: `%${search}%` } }
      ]
    }

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      attributes: { exclude: ['password_hash'] }
    })

    const hasNextPage = page * limit < count

    return res.status(200).json({
      success: true,
      users,
      hasNextPage
    })
  } catch (error) {
    console.error('GetUsers error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

export const createService = async (req, res) => {
  try {
    const { name, theme, description, isActive } = req.body
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      })
    }
    // Handle file upload
    let bannerPath = null
    if (req.file) {
      bannerPath = `/fileStorage/images/${req.file.filename}`
    }
    console.log(bannerPath)
    const service = await Service.create({
      name,
      description,
      theme,
      is_active: isActive === 'true',
      banner_image: bannerPath
    })

    return res.status(201).json({
      success: true,
      id: service.id,
      message: 'Service created successfully',
      service
    })
  } catch (error) {
    console.error('GetUsers error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

export const getServices = async (req, res) => {
  try {
    const { id } = req.params

    const serviceDetails = await Service.findByPk(id)
    if (!serviceDetails) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      })
    }

    return res.status(200).json({
      success: true,
      serviceDetails
    })
  } catch (error) {
    console.error('serviceDetails error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

export const addMedia = async (req, res) => {
  try {
    if (!req.user || typeof req.user !== 'object' || !req.user.id || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      })
    }

    const { id } = req.params
    const {
      title,
      description,
      price,
      file_type,
      file_full_path,
      is_upload,
      file_name,
      file_size
    } = req.body

    let finalFilePath = ''
    let finalFileSize = 0

    // CASE 1: is_upload is true → from Electron
    if (is_upload === 'true') {
      const ext = path.extname(file_full_path).toLowerCase()
      const mediaType = file_type + 's'

      const uniqueFileName = `${uuidv4()}${ext}`
      const destinationFolder = path.join(process.cwd(), `backend/fileStorage/${mediaType}`)
      const destinationPath = path.join(destinationFolder, uniqueFileName)

      if (!fs.existsSync(destinationFolder)) {
        fs.mkdirSync(destinationFolder, { recursive: true })
      }

      fs.copyFileSync(file_full_path, destinationPath)

      finalFilePath = `/fileStorage/${mediaType}/${uniqueFileName}`
      finalFileSize = (fs.statSync(destinationPath).size / (1024 * 1024)).toFixed(2)
    }

    // CASE 2: is_upload is true and req.file is present(not electron api )
    else if (req.file) {
      const mediaType = file_type + 's'
      finalFilePath = `/fileStorage/${mediaType}/${req.file.filename}`
      finalFileSize = (req.file.size / (1024 * 1024)).toFixed(2)
    } else if (is_upload === 'false') {
      // CASE 3: is_upload is false

      finalFilePath = file_full_path
      finalFileSize = file_size || 0
    } else {
      return res.status(400).json({
        success: false,
        message: 'No file provided.'
      })
    }

    const media = await Media.create({
      title,
      description,
      file_full_path,
      file_path: finalFilePath,
      file_type,
      file_size: finalFileSize || file_size,
      price
    })

    await ServiceMedia.create({
      service_id: id,
      media_id: media.id
    })

    res.status(201).json({ success: true, media })
  } catch (error) {
    console.error('addMedia error:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

export const getServiceMedia = async (req, res) => {
  try {
    const { serviceId } = req.params

    const service = await Service.findByPk(serviceId, {
      include: [
        {
          model: Media,
          as: 'media_files'
        }
      ]
    })

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      })
    }

    return res.status(200).json({
      success: true,
      media: service.media_files
    })
  } catch (error) {
    console.error('getServiceMedia error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

export const getAllServices = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const offset = (page - 1) * limit
    const { search, filter } = req.query

    let whereClause = {}

    if (filter && filter.toLowerCase() !== 'all') {
      whereClause.is_active = filter
    }

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { theme: { [Op.like]: `%${search}%` } }
      ]
    }

    const services = await Service.findAll({
      where: whereClause,
      attributes: {
        include: [
          [
            literal(`(
              SELECT COUNT(*) FROM service_media sm
              WHERE sm.service_id = Service.id
            )`),
            'media_count'
          ]
        ]
      },
      limit,
      offset,
      order: [['created_at', 'DESC']]
    })

    const totalCount = await Service.count({ where: whereClause })
    const hasNextPage = page * limit < totalCount

    return res.status(200).json({
      success: true,
      services,
      hasNextPage
    })
  } catch (error) {
    console.error('getService error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

export const createMedia = async (req, res) => {
  try {
    if (!req.user || typeof req.user !== 'object' || !req.user.id || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      })
    }

    const {
      title,
      description,
      price,
      file_type,
      file_full_path,
      is_upload,
      file_name,
      file_size
    } = req.body

    let finalFilePath = ''
    let finalFileSize = 0

    // CASE 1: is_upload is true → from Electron
    if (is_upload === 'true') {
      const ext = path.extname(file_full_path).toLowerCase()
      const mediaType = file_type + 's'

      const uniqueFileName = `${uuidv4()}${ext}`
      const destinationFolder = path.join(process.cwd(), `backend/fileStorage/${mediaType}`)
      const destinationPath = path.join(destinationFolder, uniqueFileName)

      if (!fs.existsSync(destinationFolder)) {
        fs.mkdirSync(destinationFolder, { recursive: true })
      }

      fs.copyFileSync(file_full_path, destinationPath)

      finalFilePath = `/fileStorage/${mediaType}/${uniqueFileName}`
      finalFileSize = (fs.statSync(destinationPath).size / (1024 * 1024)).toFixed(2)
    }

    // CASE 2: is_upload is true and req.file is present(not electron api )
    else if (req.file) {
      const mediaType = file_type + 's'
      finalFilePath = `/fileStorage/${mediaType}/${req.file.filename}`
      finalFileSize = (req.file.size / (1024 * 1024)).toFixed(2)
    } else if (is_upload === 'false') {
      // CASE 3: is_upload is false

      finalFilePath = file_full_path
      finalFileSize = file_size || 0
    } else {
      return res.status(400).json({
        success: false,
        message: 'No file provided.'
      })
    }

    const media = await Media.create({
      title,
      description,
      file_full_path,
      file_path: finalFilePath,
      file_type,
      file_size: finalFileSize || file_size,
      price
    })

    res.status(201).json({ success: true, media })
  } catch (error) {
    console.error('addMedia error:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

export const getAllMedia = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const offset = (page - 1) * limit
    const { search, filter } = req.query

    let whereClause = {}

    if (filter && filter.toLowerCase() !== 'all') {
      whereClause.file_type = filter
    }

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { file_full_path: { [Op.like]: `%${search}%` } },
        { price: { [Op.like]: `%${search}%` } }
      ]
    }

    const result = await Media.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    })

    const hasNextPage = page * limit < result.count

    return res.status(200).json({
      success: true,
      medias: result.rows,
      hasNextPage
    })
  } catch (error) {
    console.error('getService error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

export const deleteMedia = async (req, res) => {
  try {
    if (!req.user || !req.user.id || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      })
    }

    const { id } = req.params
    const mediaToDelete = await Media.findByPk(id)

    if (!mediaToDelete) {
      return res.status(400).json({
        success: false,
        message: 'Media not found'
      })
    }
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    const storageRoot = path.join(__dirname, '..')

    console.log('storage', storageRoot)
    if (mediaToDelete.file_path && mediaToDelete.file_path.startsWith('/fileStorage')) {
      const filePath = path.join(storageRoot, mediaToDelete.file_path)
      
      fs.unlink(filePath, (err) => {
        if (err) {
          console.warn('File deletion failed:', err.message)
        }
      })
    }

    await ServiceMedia.destroy({ where: { media_id: id } })

    await Media.destroy({ where: { id } })

    return res.status(200).json({
      success: true,
      message: 'Media deleted successfully'
    })
  } catch (error) {
    console.error('deleteMedia error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

export const addUser = async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: errors.array()[0].msg
    })
  }

  try {
    if (!req.user || !req.user.id || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      })
    }
    const { username, email, password, role } = matchedData(req)

    const existingEmail = await User.findOne({ where: { email } })

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email is already in use.'
      })
    }

    const existingUsername = await User.findOne({ where: { username } })

    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username is already in use.'
      })
    }

    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)

    const user = await User.create({
      username,
      email,
      password_hash: hashedPassword,
      role
    })

    const { password_hash: _, ...userWithoutPassword } = user.get({ plain: true })

    res.status(201).json({
      success: true,
      user: userWithoutPassword,
      message: 'New user added successfully!'
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

export const getMedia = async(req, res)=>{

  


try{

  const { id } = req.params


  const media = await Media.findByPk(id)
  if(!media){
    return res.status(404).json({
      success: false,
      message: 'Media not found'
    })
  }


    return res.status(200).json({
      success: true,
      mediaDetails: media
    })


}catch(error){
    console.log(error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })   
}


}


export const updateMedia = async(req, res)=>{


  try{
    const {id} = req.params

    
    const {
      title,
      description,
      price,
      file_type,
      file_full_path,
      is_upload,
      file_name,
      file_size
    } = req.body
    
    if (!req.user || !req.user.id || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      })
    }

    const media = await Media.findByPk(id)
    if(!media){
    return res.status(404).json({
      success: false,
      message: 'Media not found'
    })
  }


    let finalFilePath = ''
    let finalFileSize = 0

    // CASE 1: is_upload is true → from Electron
    if (is_upload === 'true') {
      const ext = path.extname(file_full_path).toLowerCase()
      const mediaType = file_type + 's'

      const uniqueFileName = `${uuidv4()}${ext}`
      const destinationFolder = path.join(process.cwd(), `backend/fileStorage/${mediaType}`)
      const destinationPath = path.join(destinationFolder, uniqueFileName)

      if (!fs.existsSync(destinationFolder)) {
        fs.mkdirSync(destinationFolder, { recursive: true })
      }

      fs.copyFileSync(file_full_path, destinationPath)

      finalFilePath = `/fileStorage/${mediaType}/${uniqueFileName}`
      finalFileSize = (fs.statSync(destinationPath).size / (1024 * 1024)).toFixed(2)
    }

    // CASE 2: is_upload is true and req.file is present(not electron api )
    else if (req.file) {
      const mediaType = file_type + 's'
      finalFilePath = `/fileStorage/${mediaType}/${req.file.filename}`
      finalFileSize = (req.file.size / (1024 * 1024)).toFixed(2)
    } else if (is_upload === 'false') {
      // CASE 3: is_upload is false

      finalFilePath = file_full_path
      finalFileSize = file_size || 0
    } else {
      return res.status(400).json({
        success: false,
        message: 'No file provided.'
      })
    }

    
      media.title = title
      media.description = description
      media.file_full_path = file_full_path
      media.file_path = finalFilePath
      media.file_type = file_type
      media.file_size = finalFileSize || file_size
      media.price = price

      await media.save()


    res.status(200).json({ success: true, updatedMedia: media, message: " Media updated successfully" })
  


  }catch(error){

  console.log(error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })    
  }
}

export const getAllServicesWithMedia = async(req, res)=>{


  try{

    const { id } = req.params

    const service = await Service.findByPk(id, {
      include: [
        {
          model: Media,
          as: 'media_files'
        }
      ]
    })

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      })
    }
     return res.status(200).json({
      success: true,
      service
    })


  }catch(error){
    console.log(error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })       
  }
}




export const settings = async (req, res) => {
  try {
    if (!req.user || !req.user.id || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    const {
      churchName,
      churchLogoFileName,
      churchBannerFileName,
      churchLogoMediaType,
      churchBannerMediaType
    } = req.body;

    if (!churchName || !churchLogoFileName || !churchBannerFileName) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    let setting = await ChurchSetting.findByPk(1);
    if (!setting) {
      setting = await ChurchSetting.create({ id: 1 });
    }

    const logoFilePath = `/fileStorage/${churchLogoMediaType}/${churchLogoFileName}`;
    const bannerFilePath = `/fileStorage/${churchBannerMediaType}/${churchBannerFileName}`;

    setting.church_name = churchName;
    setting.church_logo_file_path = logoFilePath;
    setting.church_banner_file_path = bannerFilePath;
    setting.church_logo_file_type = churchLogoMediaType;
    setting.church_banner_file_type = churchBannerMediaType;
    setting.is_updated = true;

    await setting.save();

    return res.status(200).json({
      success: true,
      message: 'Update successful',
      setting
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};
