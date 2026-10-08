import Category from "../models/Category.js";
import Service from "../models/Service.js";

// GET semua category (flat list)
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [
        {
          model: Service,
          as: "services",
        },
      ],
    });

    res.status(200).json({
      message: "Data kategori berhasil diambil",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data kategori",
      error: error.message,
    });
  }
};

// GET category berdasarkan ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id, {
      include: [
        {
          model: Service,
          as: "services",
        },
      ],
    });

    if (!category) {
      return res.status(404).json({
        message: "Kategori tidak ditemukan",
      });
    }

    res.status(200).json({
      message: "Data kategori berhasil diambil",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data kategori",
      error: error.message,
    });
  }
};

// CREATE category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Nama kategori wajib diisi",
      });
    }

    const category = await Category.create({ name });

    res.status(201).json({
      message: "Kategori berhasil dibuat",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal membuat kategori",
      error: error.message,
    });
  }
};

// UPDATE category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        message: "Kategori tidak ditemukan",
      });
    }

    if (!name) {
      return res.status(400).json({
        message: "Nama kategori wajib diisi",
      });
    }

    await category.update({ name });

    res.status(200).json({
      message: "Kategori berhasil diperbarui",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal memperbarui kategori",
      error: error.message,
    });
  }
};

// DELETE category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        message: "Kategori tidak ditemukan",
      });
    }

    // Cek apakah kategori memiliki service terkait
    const serviceCount = await Service.count({
      where: { category_id: id },
    });

    if (serviceCount > 0) {
      return res.status(400).json({
        message: "Kategori tidak dapat dihapus karena masih memiliki layanan (service) di dalamnya",
      });
    }

    await category.destroy();

    res.status(200).json({
      message: "Kategori berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus kategori",
      error: error.message,
    });
  }
};
