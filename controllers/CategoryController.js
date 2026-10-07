import Category from "../models/Category.js";
import Service from "../models/Service.js";

// Helper untuk menyusun data kategori secara rekursif (berjenjang tree)
const buildCategoryTree = (categories, services, parentId = null) => {
    return categories
        .filter(cat => cat.parent_id === parentId)
        .map(cat => {
            // Ambil service yang terikat pada kategori ini
            const catServices = services.filter(s => s.category_id === cat.id);
            
            return {
                id: cat.id,
                name: cat.name,
                parent_id: cat.parent_id,
                createdAt: cat.createdAt,
                updatedAt: cat.updatedAt,
                children: catServices,
                // children: buildCategoryTree(categories, services, cat.id)
            };
        });
};

// GET semua category (dalam bentuk hierarki tree lengkap dengan services)
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        const services = await Service.findAll();

        const categoryTree = buildCategoryTree(categories, services, null);

        res.status(200).json({
            message: "Data kategori berjenjang berhasil diambil",
            data: categoryTree,
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
                {
                    model: Category,
                    as: "children",
                    include: [
                        {
                            model: Service,
                            as: "services",
                        }
                    ]
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
        const { name, parent_id } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Nama kategori wajib diisi",
            });
        }

        // Jika memiliki parent, pastikan parent-nya ada
        if (parent_id) {
            const parentCategory = await Category.findByPk(parent_id);

            if (!parentCategory) {
                return res.status(404).json({
                    message: "Parent kategori tidak ditemukan",
                });
            }
        }

        const category = await Category.create({
            name,
            parent_id: parent_id || null,
        });

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
        const { name, parent_id } = req.body;

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

        // Jika parent_id diberikan, lakukan validasi
        if (parent_id) {
            // Kategori tidak boleh menjadi parent dari dirinya sendiri
            if (Number(parent_id) === Number(id)) {
                return res.status(400).json({
                    message: "Kategori tidak boleh menjadi parent dirinya sendiri",
                });
            }

            const parentCategory = await Category.findByPk(parent_id);

            if (!parentCategory) {
                return res.status(404).json({
                    message: "Parent kategori tidak ditemukan",
                });
            }
        }

        await category.update({
            name,
            parent_id: parent_id || null,
        });

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

        // Cek apakah kategori memiliki subkategori (children)
        const childrenCount = await Category.count({
            where: { parent_id: id },
        });

        if (childrenCount > 0) {
            return res.status(400).json({
                message: "Kategori tidak dapat dihapus karena masih memiliki subkategori",
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