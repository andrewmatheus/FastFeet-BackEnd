import Mail from '../../lib/Mail';

class CancellationOrderMail {
  get key() {
    return 'CancellationOrderMail';
  }

  async handle({ data }) {
    const { order } = data;

    await Mail.sendMail({
      to: `${order.deliveryman.name}<${order.deliveryman.email}>`,
      subject: 'Delivery Canceled',
      template: 'cancellationOrder',
      context: {
        deliveryman: order.deliveryman.name,
        order_id: order.id,
        product: order.product,
      },
    });
  }
}

export default new CancellationOrderMail();
