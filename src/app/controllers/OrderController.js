import * as Yup from 'yup';
import { Op } from 'sequelize';

import Order from '../models/Order';
import Recipient from '../models/Recipient';
import Courier from '../models/Courier';

import Queue from '../../lib/Queue';
import NewDelivery from '../job/NewDeliveryMail';

class OrderController {
  async index(req, res) {
    const { page = 1, name = '' } = req.query;

    const order = await Order.findAll({
      where: {
        product: {
          [Op.iLike]: `%${name}%`,
        },
      },
      order: ['id'],
      attributes: ['id', 'product', 'canceled_at', 'start_date', 'end_date'],
      include: [
        {
          association: 'recipient',
          required: false,
          attributes: ['id', 'name', 'city', 'state'],
        },
        {
          association: 'deliveryman',
          required: false,
          attributes: ['name', 'email'],
        },
        {
          association: 'signature',
          required: false,
          attributes: ['name', 'url', 'path'],
        },
      ],
      limit: 10,
      offset: (page - 1) * 10,
    });

    return res.json(order);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Validations errors' });

    const { product, recipient_id, deliveryman_id, signature_id } = req.body;

    const recipient = await Recipient.findByPk(recipient_id);
    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not found!' });
    }

    const courier = await Courier.findByPk(deliveryman_id);

    if (!courier) {
      return res.status(400).json({ error: 'Courier not found!' });
    }

    const order = await Order.create({
      product,
      recipient_id,
      deliveryman_id,
      signature_id: signature_id || null,
    });

    await Queue.add(NewDelivery.key, { courier, order });

    return res.json(order);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string(),
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Validations errors' });

    const { id } = req.params;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.json({ message: 'Order not found!' });
    }

    const { product, recipient_id, deliveryman_id, signature_id } = req.body;

    if (recipient_id) {
      const recipient = await Recipient.findByPk(recipient_id);
      if (!recipient) {
        return res.status(400).json({ error: 'Recipient not found!' });
      }
    }

    if (deliveryman_id) {
      const courier = await Courier.findByPk(deliveryman_id);

      if (!courier) {
        return res.status(400).json({ error: 'Courier not found!' });
      }
    }

    await order.update({
      product,
      recipient_id,
      deliveryman_id,
      signature_id: signature_id || null,
    });

    return res.json(order);
  }

  async delete(req, res) {
    const { id } = req.params;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.json({ message: 'Order not found!' });
    }

    await Order.destroy({ where: { id } });

    return res.json({ message: 'Order successfully deleted' });
  }
}

export default new OrderController();
