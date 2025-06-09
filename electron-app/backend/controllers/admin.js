import User from "../models/users.model.js";
import { Op } from "sequelize";

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
