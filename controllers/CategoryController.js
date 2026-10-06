import Category from "../models/Category.js";

// GET semua category
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            include: [
                {
                    model: Category,
                    as: "children",
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
                    model: Category,
                    as: "children",
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

        // Jika parent_id diberikan, pastikan parent-nya ada
        if (parent_id) {
            const parentCategory = await Category.findByPk(parent_id);

            if (!parentCategory) {
                return res.status(404).json({
                    message: "Parent kategori tidak ditemukan",
                });
            }

            // Kategori tidak boleh menjadi parent dari dirinya sendiri
            if (Number(parent_id) === Number(id)) {
                return res.status(400).json({
                    message: "Kategori tidak boleh menjadi parent dirinya sendiri",
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

        // Cek apakah kategori memiliki child
        const children = await Category.count({
            where: {
                parent_id: id,
            },
        });

        if (children > 0) {
            return res.status(400).json({
                message: "Kategori tidak dapat dihapus karena masih memiliki subkategori",
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