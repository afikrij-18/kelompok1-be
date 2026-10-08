import { DataTypes } from "sequelize";
import db from "../config/database.js";

const User = db.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Nama tidak boleh kosong",
        },
        len: {
          args: [2, 100],
          msg: "Nama harus memiliki 2-100 karakter",
        },
      },
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Email sudah digunakan",
      },
      validate: {
        notEmpty: {
          msg: "Email tidak boleh kosong",
        },
        isEmail: {
          msg: "Format email tidak valid",
        },
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password tidak boleh kosong",
        },
      },
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: {
          args: [/^[0-9]+$/],
          msg: "Nomor telepon hanya boleh berisi angka",
        },
        len: {
          args: [10, 15],
          msg: "Nomor telepon harus memiliki 10-15 digit",
        },
      },
    },

    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: true,
      defaultValue: "active",
      validate: {
        isIn: {
          args: [["active", "inactive"]],
          msg: "Status harus active atau inactive",
        },
      },
    },

    role: {
      type: DataTypes.ENUM("admin", "owner"),
      allowNull: true,
      validate: {
        isIn: {
          args: [["admin", "owner"]],
          msg: "Role harus admin atau owner",
        },
      },
    },
  },
  {
    freezeTableName: true,
  },
);

export default User;