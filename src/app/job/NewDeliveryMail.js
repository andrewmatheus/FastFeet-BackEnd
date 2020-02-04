import Mail from '../../lib/Mail';

class NewDeliveryMail {
  get key() {
    return 'NewDeliveryMail';
  }

  async handle({ data }) {
    const { courier, order } = data;

    await Mail.sendMail({
      to: `${courier.name} <${courier.email}>`,
      subject: 'New Delivery',
      template: 'delivery',
      context: {
        courier: courier.name,
        order_id: order.id,
        product: order.product,
      },
    });
  }
}

export default new NewDeliveryMail();
