import Order from '../models/Order';

import Queue from '../../lib/Queue';
import CancellationOrderMail from '../job/CancellationOrderMail';

class ProblemController {
  async delete(req, res) {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
      include: [
        {
          association: 'deliveryman',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!order) {
      return res.status(400).json({ error: 'Order not found!' });
    }

    if (order.canceled_at) {
      return res.status(400).json({ error: 'Order already canceled!' });
    }

    await order.update({
      canceled_at: new Date(),
    });

    await Queue.add(CancellationOrderMail.key, { order });

    return res.json(order);
  }
}

export default new ProblemController();
