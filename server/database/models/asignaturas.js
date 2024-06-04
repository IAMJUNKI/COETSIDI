
const { sequelize } = require('../connection.js');
const { DataTypes } = require('sequelize');

const Asignaturas = sequelize.define(
    'asignaturas',
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model:'t_usuarios',
                key: 'id'
            }
        },
        data_user: {
            type: DataTypes.JSON,
            allowNull: true,
        }, 
    },
    {
        tableName: 't_asignaturas',
        timestamps: true,
    },
);

module.exports = Asignaturas;
