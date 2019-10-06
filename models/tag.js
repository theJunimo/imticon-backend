module.exports = (sequelize, DataTypes) => {
    return sequelize.define('tag', {
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        }
    }, {
        timestamp: true
    })
}