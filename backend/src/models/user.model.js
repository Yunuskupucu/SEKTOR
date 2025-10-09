import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    provider: {
  type: DataTypes.ENUM("local", "google", "github"),
  allowNull: false,
  defaultValue: "local",
},
provider_id: {
  type: DataTypes.STRING,
  allowNull: true,
},
    fullname: { 
        type: DataTypes.STRING,
        allowNull: false,
    }, 
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: { 
        type: DataTypes.TEXT,
        allowNull: false,
    },
    profile_picture_url: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    github: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    linkedin: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'users',
    timestamps: false,
});

// Kullanıcı güncelleme zamanı için hook (trigger yerine geçer)
User.beforeUpdate((user) => {
    user.updated_at = new Date();
});

export default User;