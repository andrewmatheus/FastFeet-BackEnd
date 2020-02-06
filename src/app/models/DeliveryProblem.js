import Sequelize, { Model } from 'sequelize';

class DeliveryProblem extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
      },
      { sequelize }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Order, {
      foreignKey: 'deliveryman_id',
      as: 'deliverymanProblem',
    });
  }
}

export default DeliveryProblem;
