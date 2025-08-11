import fs from 'fs'
import path from 'path'
import User from '../models/users.model.js'
import Service from '../models/service.model.js'
import Media from '../models/media.model.js'
import ServiceMedia from '../models/service-media.model.js'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from 'ffmpeg-static'
ffmpeg.setFfmpegPath(ffmpegPath)
import ChurchSetting from '../models/ChurchSettings.model.js'
import Transaction from '../models/transaction.model.js'
import CreditAllocation from '../models/creditsAllocation.model.js'
import { v4 as uuidv4 } from 'uuid'
import { Op, literal } from 'sequelize'
import { validationResult, matchedData } from 'express-validator'
import bcryptjs from 'bcryptjs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { getMediaDuration } from '../utils/getMediaDuration.js'
import UserActivity from '../models/userActivities.model.js'
import MediaPurchase from '../models/mediaPurchase.model.js'

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
    if (!req.user || typeof req.user !== 'object' || !req.user.id || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      })
    }
    const { name, theme, description, isActive } = req.body

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      })
    }

    const setting = await ChurchSetting.findByPk(1)

    if (
      !setting ||
      setting.is_updated !== true ||
      !setting.church_logo_file_path?.trim() ||
      !setting.church_name?.trim() ||
      !setting.church_banner_file_path?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'Update church name, logo and banner before creating service'
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
      minister_name,
      file_size
    } = req.body

    let finalFilePath = ''
    let finalFileSize = 0
    let duration = ''
    let fileSource = ''

    // CASE 1: is_upload is true → from Electron
    if (is_upload === 'true') {
      const ext = path.extname(file_full_path).toLowerCase()
      const mediaType = file_type + 's'
      fileSource = 'upload file'

      const uniqueFileName = `${uuidv4()}${ext}`
      const destinationFolder = path.join(process.cwd(), `backend/fileStorage/${mediaType}`)
      const destinationPath = path.join(destinationFolder, uniqueFileName)

      if (!fs.existsSync(destinationFolder)) {
        fs.mkdirSync(destinationFolder, { recursive: true })
      }

      if (file_type === 'audio' || file_type === 'video') {
        duration = await getMediaDuration(file_full_path)
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
      if (file_type === 'audio' || file_type === 'video') {
        duration = await getMediaDuration(file_full_path)
      }
      fileSource = 'upload file'
    } else if (is_upload === 'false') {
      // CASE 3: is_upload is false

      finalFilePath = file_full_path
      finalFileSize = file_size || 0
      if (file_type === 'audio' || file_type === 'video') {
        duration = await getMediaDuration(file_full_path)
      }
      fileSource = 'network file'
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
      minister_name,
      file_size: finalFileSize || file_size,
      price,
      duration,
      file_source: fileSource
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
      minister_name,
      file_size
    } = req.body

    let finalFilePath = ''
    let finalFileSize = 0
    let duration = ''
    let fileSource = ''

    // CASE 1: is_upload is true → from Electron
    if (is_upload === 'true') {
      const ext = path.extname(file_full_path).toLowerCase()
      const mediaType = file_type + 's'
      fileSource = 'upload file'

      const uniqueFileName = `${uuidv4()}${ext}`
      const destinationFolder = path.join(process.cwd(), `backend/fileStorage/${mediaType}`)
      const destinationPath = path.join(destinationFolder, uniqueFileName)

      if (file_type === 'audio' || file_type === 'video') {
        duration = await getMediaDuration(file_full_path)
      }

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
      if (file_type === 'audio' || file_type === 'video') {
        duration = await getMediaDuration(file_full_path)
      }
      fileSource = 'upload file'
    } else if (is_upload === 'false') {
      // CASE 3: is_upload is false

      finalFilePath = file_full_path
      finalFileSize = file_size || 0
      if (file_type === 'audio' || file_type === 'video') {
        duration = await getMediaDuration(file_full_path)
      }
      fileSource = 'network file'
    } else {
      return res.status(400).json({
        success: false,
        message: 'No file provided.'
      })
    }
    console.log('duration', duration)

    const media = await Media.create({
      title,
      description,
      file_full_path,
      file_path: finalFilePath,
      file_type,
      duration,
      minister_name,
      file_size: finalFileSize || file_size,
      price,
      file_source: fileSource
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

    await UserActivity.create({
      user_id: user.id,
      action: 'New user added to system',
      detail: `${user.username} has been added to the system`
    })

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

export const getMedia = async (req, res) => {
  try {
    const { id } = req.params

    const media = await Media.findByPk(id)
    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      })
    }

    return res.status(200).json({
      success: true,
      mediaDetails: media
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

export const updateMedia = async (req, res) => {
  try {
    const { id } = req.params

    const {
      title,
      description,
      price,
      file_type,
      file_full_path,
      is_upload,
      file_name,
      file_size,
      minister_name
    } = req.body

    if (!req.user || !req.user.id || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      })
    }

    const media = await Media.findByPk(id)
    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      })
    }
    let duration = ''
    let finalFilePath = media.file_path
    let finalFileSize = media.file_size
    let finalFileType = media.file_type
    let fileSource = ''

    if (is_upload === 'true') {
      media.file_source = 'upload file'
    } else if (is_upload === 'false') {
      media.file_source = 'network file'
    }

    console.log('isUpload', is_upload)
    // Only update file if new one is provided
    if (is_upload && file_full_path) {
      const ext = path.extname(file_full_path).toLowerCase()
      const mediaType = file_type + 's'
      fileSource = 'upload file'

      const uniqueFileName = `${uuidv4()}${ext}`
      const destinationFolder = path.join(process.cwd(), `backend/fileStorage/${mediaType}`)
      const destinationPath = path.join(destinationFolder, uniqueFileName)

      console.log('Destination folder:', destinationFolder)
      console.log('Destination path:', destinationPath)

      if (!fs.existsSync(destinationFolder)) {
        fs.mkdirSync(destinationFolder, { recursive: true })
      }

      fs.copyFileSync(file_full_path, destinationPath)

      console.log('File copied successfully!')
      if (file_type === 'audio' || file_type === 'video') {
        duration = await getMediaDuration(file_full_path)
      }
      finalFilePath = `/fileStorage/${mediaType}/${uniqueFileName}`
      finalFileSize = (fs.statSync(destinationPath).size / (1024 * 1024)).toFixed(2)
      finalFileType = file_type
    } else if (req.file) {
      const mediaType = file_type + 's'
      finalFilePath = `/fileStorage/${mediaType}/${req.file.filename}`
      finalFileSize = (req.file.size / (1024 * 1024)).toFixed(2)
      finalFileType = file_type
      if (file_type === 'audio' || file_type === 'video') {
        duration = await getMediaDuration(file_full_path)
      }
      fileSource = 'upload file'
    } else if (!is_upload && file_full_path) {
      finalFilePath = file_full_path
      finalFileSize = file_size || 0
      finalFileType = file_type
      if (file_type === 'audio' || file_type === 'video') {
        duration = await getMediaDuration(file_full_path)
      }
      fileSource = 'network file'
    }

    if (title) media.title = title
    if (description !== undefined) media.description = description
    if (price !== undefined) media.price = price
    if (minister_name !== undefined) media.minister_name = minister_name

    media.file_source = fileSource || media.file_source
    console.log('file source', fileSource)

    if (file_full_path || req.file || !is_upload) {
      media.file_full_path = file_full_path
      media.file_path = finalFilePath
      media.file_size = finalFileSize
      media.file_type = finalFileType
      media.duration = duration
    }

    await media.save()
    console.log(media.file_source)

    res
      .status(200)
      .json({ success: true, updatedMedia: media, message: ' Media updated successfully' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

export const getAllServicesWithMedia = async (req, res) => {
  try {
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
  } catch (error) {
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
      })
    }

    const { churchName } = req.body

    const logoFile = req.files?.church_logo?.[0]
    const bannerFile = req.files?.church_banner?.[0]

    const setting = (await ChurchSetting.findByPk(1)) || (await ChurchSetting.create({ id: 1 }))

    if (churchName) setting.church_name = churchName

    if (logoFile) {
      setting.church_logo_file_path = `/fileStorage/images/${logoFile.filename}`
      setting.church_logo_file_type = 'image'
    }

    if (bannerFile) {
      setting.church_banner_file_path = `/fileStorage/images/${bannerFile.filename}`
      setting.church_banner_file_type = 'image'
    }

    setting.is_updated = true

    await setting.save()

    return res.status(200).json({
      success: true,
      message: 'Update successful',
      setting
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

export const checkSettings = async (req, res) => {
  try {
    if (!req.user || !req.user.id || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      })
    }

    const setting = await ChurchSetting.findByPk(1)

    if (!setting || !setting.is_updated) {
      return res.status(200).json({
        success: true,
        message: 'Update church name, logo and banner'
      })
    }

    return res.status(200).json({
      success: true,
      setting
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

export const editService = async (req, res) => {
  try {
    if (!req.user || !req.user.id || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      })
    }

    const { id } = req.params
    const { name, theme, description, isActive } = req.body

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      })
    }

    const bannerPath = req.file ? `/fileStorage/images/${req.file.filename}` : null

    const serviceToEdit = await Service.findByPk(id)
    if (!serviceToEdit) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      })
    }

    serviceToEdit.name = name

    if (description) serviceToEdit.description = description
    if (theme) serviceToEdit.theme = theme
    serviceToEdit.is_active = isActive
    if (bannerPath) serviceToEdit.banner_image = bannerPath

    await serviceToEdit.save()

    return res.status(200).json({
      success: true,
      message: 'Service edited successfully',
      service: serviceToEdit
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

export const removeMediaFromService = async (req, res) => {
  try {
    if (!req.user || !req.user.id || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      })
    }

    const { serviceId, mediaId } = req.params

    const mediaToRemove = await Media.findByPk(mediaId)
    if (!mediaToRemove) {
      return res.status(400).json({
        success: false,
        message: 'Media not found'
      })
    }

    const service = await Service.findByPk(serviceId)
    if (!service) {
      return res.status(400).json({
        success: false,
        message: 'Service not found'
      })
    }

    await ServiceMedia.destroy({ where: { media_id: mediaId, service_id: serviceId } })
    return res.status(200).json({
      success: true,
      message: 'Media removed successfully'
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

export const getConnectionStatus = async (req, res) => {
  try {
    const setting = await ChurchSetting.findByPk(1)
    const { username } = req.body
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required'
      })
    }

    const user = await User.findOne({ where: { username } })
    let account_exist = ''

    if (!user) {
      account_exist = 'no'
    }
    if (user) {
      account_exist = 'yes'
    }
    return res.status(200).json({
      status: 'Connected',
      logo: setting?.church_logo_file_path || '',
      church_name: setting?.church_name || 'Unknown',
      account_exist
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server error'
    })
  }
}

export const addExistingMediaToService = async (req, res) => {
  try {
    if (!req.user || !req.user.id || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      })
    }

    const { serviceId, mediaId } = req.params

    const service = await Service.findByPk(serviceId)
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      })
    }

    const media = await Media.findByPk(mediaId)
    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      })
    }

    const existing = await ServiceMedia.findOne({
      where: {
        service_id: serviceId,
        media_id: mediaId
      }
    })

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Media already exists in service'
      })
    }

    const mediaAdded = await ServiceMedia.create({
      service_id: serviceId,
      media_id: mediaId
    })

    return res.status(200).json({
      success: true,
      message: 'Media added to service successfully',
      mediaAdded
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

export const allocateCredits = async (req, res) => {
  try {
    if (!req.user || !req.user.id || req.user.role === 'client') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      })
    }

    const { id } = req.params
    const { credit, reason } = req.body

    if (!id || !credit || !reason) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      })
    }

    const creditToAdd = parseFloat(credit)
    if (isNaN(creditToAdd) || creditToAdd <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Credit must be a valid positive number'
      })
    }

    const user = await User.findByPk(id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    user.credits = (user.credits || 0) + creditToAdd
    await user.save()

    const CreditAllocationDetails = await CreditAllocation.create({
      user_id: id,
      credits_added: creditToAdd,
      reason,
      generatedBy: req.user.id
    })
    await UserActivity.create({
      user_id: id,
      action: 'Credit Allocation',
      detail: `${creditToAdd} credits was allocated to ${user.username}  `
    })

    return res.status(201).json({
      success: true,
      CreditAllocationDetails,
      message: 'Credit allocated to user successfully'
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

export const creditHistory = async (req, res) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const offset = (page - 1) * limit

  try {
    if (!req.user || !req.user.id || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      })
    }

    const { rows, count } = await CreditAllocation.findAndCountAll({
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          as: 'allocatedTo',
          attributes: ['id', 'email']
        },
        {
          model: User,
          as: 'allocatedBy',
          attributes: ['id', 'email']
        }
      ]
    })

    const totalPages = Math.ceil(count / limit)
    const hasNextPage = page < totalPages

    return res.status(200).json({
      success: true,
      data: rows,
      hasNextPage
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

export const creditUsage = async (req, res) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const offset = (page - 1) * limit

  try {
    if (!req.user || !req.user.id || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      })
    }

    const count = await Transaction.count()

    const transactions = await Transaction.findAll({
      limit,
      offset,
      order: [['transaction_date', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email']
        },
        {
          model: Media,
          as: 'media',
          attributes: ['id', 'title', 'file_type', 'price']
        }
      ]
    })

    const totalPages = Math.ceil(count / limit)
    const hasNextPage = page < totalPages

    return res.status(200).json({
      success: true,
      transactions,
      hasNextPage
    })
  } catch (error) {
    console.error('creditUsage error:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

export const getRecentActivities = async (req, res) => {
  if (!req.user || !req.user.id || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized access'
    })
  }

  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 20
    const offset = (page - 1) * limit

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

    const { count, rows } = await UserActivity.findAndCountAll({
      where: {
        created_at: {
          [Op.gte]: twentyFourHoursAgo
        }
      },
      order: [['created_at', 'DESC']],
      limit,
      offset,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'username']
        }
      ]
    })

    const totalPages = Math.ceil(count / limit)
    const hasNextPage = page < totalPages

    return res.status(200).json({
      success: true,
      data: rows,
      hasNextPage
    })
  } catch (error) {
    console.error('getRecentActivities error:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

export const getDashboardDetails = async (req, res) => {
  if (!req.user || !req.user.id || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized access'
    })
  }

  try {
    const totalUsers = await User.count()
    const totalMedia = await Media.count()
    const totalActiveService = await Service.count({ where: { is_active: 1 } })
    const totalCreditsAllocated = await CreditAllocation.sum('credits_added')

    return res.status(200).json({
      success: true,
      totalUsers,
      totalMedia,
      totalActiveService,
      totalCreditsAllocated: totalCreditsAllocated || 0
    })
  } catch (error) {
    console.error('getDashboardDetails error:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

export const getSalesStats = async (req, res) => {
  try {
    if (!req.user || !req.user.id || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      })
    }
    const totalUsers = await User.count()

    const totalRevenue = (await CreditAllocation.sum('credits_added')) || 0
    const totalDownload = (await MediaPurchase.count({})) || 0
    const avgRevenue = totalUsers > 0 ? totalRevenue / totalUsers : 0

    // Calculate user retention based on users with credits vs total users
    const activeUsers = await User.count({
      where: {
        credits: {
          [Op.gt]: 0 // Users with credits (active users)
        }
      }
    })
    const userRetention = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0

    return res.status(200).json({
      success: true,
      totalRevenue,
      totalDownload,
      avgRevenue,
      userRetention: Math.round(userRetention * 100) / 100 // Round to 2 decimal places
    })
  } catch (error) {
    console.error('getSalesStats error:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}
