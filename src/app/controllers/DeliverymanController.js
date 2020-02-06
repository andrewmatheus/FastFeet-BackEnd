import * as Yup from 'yup';
import { Op } from 'sequelize';
import { parseISO, startOfDay, endOfDay, addHours, subHours } from 'date-fns';

import Courier from '../models/Courier';
import Order from '../models/Order';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    const { page = 1, delivered = false } = req.query;
    const { id } = req.params;

    const courier = await Courier.findByPk(id);

    if (!courier) {
      return res.status(400).json({ error: 'Courier not found!' });
    }

    if (!delivered) {
      const orders = await Order.findAll({
        where: {
          deliveryman_id: id,
          canceled_at: null,
          end_date: null,
        },
        order: ['id'],
        include: [
          {
            association: 'deliveryman',
            attributes: ['name', 'email'],
            include: [
              {
                model: File,
                as: 'avatar',
                attributes: ['path', 'url'],
              },
            ],
          },
          {
            association: 'recipient',
            required: false,
            attributes: [
              'id',
              'name',
              'street',
              'number',
              'complement',
              'state',
              'city',
              'zip_code',
            ],
          },
          {
            model: File,
            as: 'signature',
            attributes: ['path', 'url'],
          },
        ],
        limit: 20,
        offset: (page - 1) * 20,
      });

      return res.json(orders);
    }
    const orders = await Order.findAll({
      where: {
        deliveryman_id: id,
        canceled_at: null,
        end_date: {
          [Op.lte]: new Date(),
        },
      },
      order: ['id'],
      include: [
        {
          association: 'deliveryman',
          attributes: ['name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['path', 'url'],
            },
          ],
        },
        {
          association: 'recipient',
          required: false,
          attributes: [
            'id',
            'name',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'zip_code',
          ],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['path', 'url'],
        },
      ],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(orders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation errors' });

    const { id } = req.params;
    const { start_date } = req.body;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(400).json({ error: 'Order not found!' });
    }

    if (order.end_date) {
      return res.status(401).json({ error: 'Order finished!' });
    }

    const dateParse = parseISO(start_date);
    const dateStart = addHours(startOfDay(dateParse), 6);
    const dateEnd = subHours(endOfDay(dateParse), 8);

    if (!(dateParse >= dateStart && dateParse <= dateEnd)) {
      return res.status(401).json({ error: 'Only business hours allowed!' });
    }

    const orders = await Order.findAll({
      where: {
        start_date: {
          [Op.between]: [dateStart, dateEnd],
        },
      },
    });

    if (orders.length > 5)
      return res
        .status(401)
        .json({ error: 'You can only have five withdrawals per day' });

    await order.update({
      start_date: dateParse,
    });

    return res.json(order);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      end_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation errors' });

    const { id } = req.params;
    const { end_date, signature_id } = req.body;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(400).json({ error: 'Order not found!' });
    }

    if (!order.start_date) {
      return res
        .status(401)
        .json({ error: 'Order not started! Please start the order' });
    }

    await order.update({
      end_date: parseISO(end_date),
      signature_id: signature_id || null,
    });

    return res.json(order);
  }
}

export default new DeliverymanController();
