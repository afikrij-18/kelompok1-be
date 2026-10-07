import Service from "../models/Service.js";
import Category from "../models/Category.js";

// GET semua service
export const getServices = async (req, res) => {
    try {
        const services = await Service.findAll({
            include: [
                {
                    model: Category,
                    as: "category",
                    attributes: ["id", "name", "parent_id"],
                },
            ],
        });

        res.status(200).json({
            message: "Data service berhasil diambil",
            data: services,
        });
    } catch (error) {
        res.status(500).json({
            message: "Gagal mengambil data service",
            error: error.message,
        });
    }
};

// GET service berdasarkan ID
export const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;

        const service = await Service.findByPk(id, {
            include: [
                {
                    model: Category,
                    as: "category",
                    attributes: ["id", "name", "parent_id"],
                },
            ],
        });

        if (!service) {
            return res.status(404).json({
                message: "Service tidak ditemukan",
            });
        }

        res.status(200).json({
            message: "Data service berhasil diambil",
            data: service,
        });
    } catch (error) {
        res.status(500).json({
            message: "Gagal mengambil data service",
            error: error.message,
        });
    }
};

// CREATE service
export const createService = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category_id,
        } = req.body;

        // Validasi field wajib
        if (!name || price === undefined || category_id === undefined) {
            return res.status(400).json({
                message: "Name, price, dan category_id wajib diisi",
            });
        }

        // Pastikan harga bernilai angka yang valid
        if (isNaN(price) || Number(price) < 0) {
            return res.status(400).json({
                message: "Harga service harus berupa angka yang valid",
            });
        }

        // Cek apakah kategori ada di database
        const category = await Category.findByPk(category_id);

        if (!category) {
            return res.status(404).json({
                message: "Kategori tidak ditemukan",
            });
        }

        const service = await Service.create({
            name,
            description: description || null,
            price: Number(price),
            category_id,
        });

        res.status(201).json({
            message: "Service berhasil dibuat",
            data: service,
        });
    } catch (error) {
        res.status(500).json({
            message: "Gagal membuat service",
            error: error.message,
        });
    }
};

// UPDATE service
export const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            price,
            category_id,
        } = req.body;

        const service = await Service.findByPk(id);

        if (!service) {
            return res.status(404).json({
                message: "Service tidak ditemukan",
            });
        }

        // Validasi field wajib
        if (!name || price === undefined || category_id === undefined) {
            return res.status(400).json({
                message: "Name, price, dan category_id wajib diisi",
            });
        }

        // Pastikan harga bernilai angka yang valid
        if (isNaN(price) || Number(price) < 0) {
            return res.status(400).json({
                message: "Harga service harus berupa angka yang valid",
            });
        }

        // Cek kategori baru
        const category = await Category.findByPk(category_id);

        if (!category) {
            return res.status(404).json({
                message: "Kategori tidak ditemukan",
            });
        }

        await service.update({
            name,
            description: description || null,
            price: Number(price),
            category_id,
        });

        res.status(200).json({
            message: "Service berhasil diperbarui",
            data: service,
        });
    } catch (error) {
        res.status(500).json({
            message: "Gagal memperbarui service",
            error: error.message,
        });
    }
};

// DELETE service
export const deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        const service = await Service.findByPk(id);

        if (!service) {
            return res.status(404).json({
                message: "Service tidak ditemukan",
            });
        }

        await service.destroy();

        res.status(200).json({
            message: "Service berhasil dihapus",
        });
    } catch (error) {
        res.status(500).json({
            message: "Gagal menghapus service",
            error: error.message,
        });
    }
};