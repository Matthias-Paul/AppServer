import Service from '../models/service.model.js'
import Media from '../models/media.model.js'
import MediaPurchase from '../models/mediaPurchase.model.js'
import Transaction from '../models/transaction.model.js'
import User from '../models/users.model.js'
import CreditAllocation from '../models/creditsAllocation.model.js'
import ServiceMedia from '../models/service-media.model.js'
import { Op, Sequelize } from 'sequelize'
import { validationResult, matchedData } from 'express-validator'
import dotenv from 'dotenv'
import bcryptjs from 'bcryptjs'
import generateToken from '../utils/generateToken.js'
import UserActivity from "../models/userActivities.model.js"
import { sequelize } from '../database/DB.config.js'



dotenv.config()

export const register = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: errors.array()[0].msg
    })
  }

  try {
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

    const token = await generateToken(user.id, user.role, res)
    console.log(token)

    res.status(201).json({
      success: true,
      user: userWithoutPassword,
      message: 'Signup successful!',
      token
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

export const login = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    // If there are validation errors, return the first error message
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: errors.array()[0].msg
    })
  }
  try {
    const { email, password } = matchedData(req)

    let user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found.'
      })
    }

    const isMatch = await bcryptjs.compare(password, user.password_hash)
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Credentials.'
      })
    }
    const token = await generateToken(user.id, user.role, res)
    console.log(token)

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        credits: user.credits,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      },
      message: 'Login Successful',
      token
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

export const getServicesWithMediaCounts = async (req, res) => {


    if (!req.user || !req.user.id ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      })
    }



  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const offset = (page - 1) * limit

    const services = await Service.findAll({
      where: { is_active: 1 },
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Media,
          as: 'media_files',
          through: { attributes: [] },
          attributes: ['file_type']
        }
      ]
    })

    const servicesWithMediaCounts = services.map((service) => {
      const mediaCounts = { audio: 0, video: 0, image: 0, document: 0 }

      service.media_files.forEach((media) => {
        const type = media.file_type?.toLowerCase()
        if (Object.prototype.hasOwnProperty.call(mediaCounts, type)) {
          mediaCounts[type] += 1
        }
      })

      return {
        id: service.id,
        name: service.name,
        theme: service.theme,
        description: service.description,
        banner_image: service.banner_image,
        is_active: service.is_active,
        created_at: service.created_at,
        media_counts: mediaCounts
      }
    })

    const totalCount = await Service.count()
    const hasNextPage = page * limit < totalCount

    return res.status(200).json({
      success: true,
      services: servicesWithMediaCounts,
      hasNextPage
    })
  } catch (error) {
    console.error('getServicesWithMediaCounts error:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

export const getServiceWithMedia = async (req, res) => {

   if (!req.user || !req.user.id ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      })
    }
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: errors.array()[0].msg
    })
  }

    const { serviceId } = matchedData(req)
   

  try {
   

    const service = await Service.findByPk(serviceId, {
      include: [
        {
          model: Media,
          as: 'media_files',
          through: { attributes: [] },
          attributes: {
            exclude: ['file_path', 'file_full_path']
          }
        }
      ]
    })

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      })
    }

    if (!service.is_active) {
      return res.status(403).json({
        success: false,
        message: 'This service is not active.'
      })
    }

    // Group media by type
    const groupedMedia = {
      video: [],
      audio: [],
      images: [],
      documents: []
    }

    let totalCredits = 0

    for (const media of service.media_files) {
      const type = media.file_type?.toLowerCase()

      switch (type) {
        case 'video':
          groupedMedia.video.push(media)
          break
        case 'audio':
          groupedMedia.audio.push(media)
          break
        case 'image':
          groupedMedia.images.push(media)
          break
        case 'document':
          groupedMedia.documents.push(media)
          break
      }

      totalCredits += parseFloat(media.price || 0)
    }

    return res.status(200).json({
      success: true,
      service: {
        id: service.id,
        name: service.name,
        theme: service.theme,
        description: service.description,
        banner_image: service.banner_image,
        is_active: service.is_active,
        created_at: service.created_at
      },
      video: groupedMedia.video,
      audio: groupedMedia.audio,
      images: groupedMedia.images,
      documents: groupedMedia.documents,
      total_credits: totalCredits
    })
  } catch (error) {
    console.error('getServiceWithMedia error:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

export const downloadMedia = async (req, res) => {

   if (!req.user || !req.user.id ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      })
    }
     const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: errors.array()[0].msg
    })
  }


        const { mediaId} = matchedData(req)
        const userId = req.user.id

  try {
    

    const media = await Media.findByPk(mediaId)
    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found.'
      })
    }

    const user = await User.findByPk(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      })
    }

    const existingPurchase = await MediaPurchase.findOne({
      where: {
        user_id: userId,
        media_id: mediaId
      }
    })

    if (existingPurchase) {
      return res.status(200).json({
        success: true,
        message: 'Already purchased.',
        mediafilePath: media.file_path
      })
    }

    const mediaPrice = parseFloat(media.price || 0)
    const userCredits = parseFloat(user.credits || 0)

    if (userCredits < mediaPrice) {
      return res.status(402).json({
        success: false,
        message: 'Insufficient credits.'
      })
    }

      const result = await sequelize.transaction(async (t) => {
        user.credits = userCredits - mediaPrice
        await user.save({ transaction: t })

        await MediaPurchase.create({
          user_id: userId,
          media_id: mediaId,
          downloaded_at: new Date()
        }, { transaction: t })

        await Transaction.create({
          user_id: userId,
          media_id: mediaId,
          credits_used: mediaPrice,
          transaction_date: new Date()
        }, { transaction: t })

        await UserActivity.create({
          user_id: userId,
          action: 'Media download',
          detail: `${media.title} ${media.file_type} - ${media.price} credits`
        }, { transaction: t })

        return true
      })


    return res.status(200).json({
      success: true,
      message: 'Purchase successful.',
      mediafilePath: media.file_path
    })
  } catch (error) {
    console.error('downloadMedia error:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

export const creditHistory = async (req, res) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const offset = (page - 1) * limit

   if (!req.user || !req.user.id ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      })
    }

      const userId  = req.user.id

  try {
    const { rows, count } = await CreditAllocation.findAndCountAll({
      where: { user_id: userId },
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [
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
    console.error('credit history error:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

export const downloadHistory = async (req, res) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const offset = (page - 1) * limit

  
     if (!req.user || !req.user.id ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      })
    }

      const userId  = req.user.id

  try {
    const { rows, count } = await MediaPurchase.findAndCountAll({
      where: { user_id: userId },
      limit,
      offset,
      order: [['downloaded_at', 'DESC']],
      include: [
        {
          model: Media,
          as: 'media',
          attributes: [
            'id',
            'title',
            'description',
            'minister_name',
            'duration',
            'price',
            'file_path'
          ]
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
    console.error('downloadHistory error:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}
