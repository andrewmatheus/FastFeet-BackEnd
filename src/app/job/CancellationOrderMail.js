import Mail from '../../lib/Mail';

class CancellationOrderMail {
  get key() {
    return 'CancellationOrderMail';
  }

  async handle({ data }) {
    const { order } = data;

    await Mail.sendMail({
      to: `${order.courier.name}<${order.courier.email}>`,
      subject: 'Delivery Canceled',
      template: 'cancellationOrder',
      context: {
        courier: order.courier.name,
        order_id: order.id,
        product: order.product,
      },
    });
  }
}

export default new CancellationOrderMail();
