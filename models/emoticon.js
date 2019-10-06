module.exports = (sequelize, DataTypes) => {
    return sequelize.define('emoticon', {
        text: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        copyCount: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        timestamp: true
    })
}