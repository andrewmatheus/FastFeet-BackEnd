import * as Yup from 'yup';
import { Op } from 'sequelize';

import Recipient from '../models/Recipient';
import User from '../models/User';

class RecipientController {
  async index(req, res) {
    const { page = 1, name = '' } = req.query;

    const recipient = await Recipient.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
      order: ['id'],
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
      limit: 20,
      offset: (page - 1) * 20,
    });

    if (!recipient) {
      return res.status(400).json({ error: 'Courier does not exist!' });
    }

    /**
     * Check user is administrator
     */
    const user = await User.findByPk(req.userId);

    if (!user.profile_admin) {
      return res
        .status(405)
        .json({ error: 'Action allowed for administrators only!' });
    }

    return res.json(recipient);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().positive(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zip_code: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const recipientExist = await Recipient.findOne({
      where: { name: req.body.name },
    });

    if (recipientExist) {
      return res.status(400).json({ error: 'Recipient already exists.' });
    }

    /**
     * Check user is administrator
     */
    const user = await User.findByPk(req.userId);

    if (!user.profile_admin) {
      return res
        .status(405)
        .json({ error: 'Action allowed for administrators only!' });
    }

    const {
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      street: Yup.string(),
      number: Yup.number(),
      complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      zip_code: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const recipient = await Recipient.findByPk(req.params.id);
    const { name } = req.body;

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not found' });
    }

    if (name) {
      const existName = await Recipient.findOne({
        where: { name },
      });

      if (existName) {
        return res.status(400).json({ error: 'Recipient name already exist!' });
      }
    }

    /**
     * Check user is administrator
     */
    const user = await User.findByPk(req.userId);

    if (!user.profile_admin) {
      return res
        .status(405)
        .json({ error: 'Action allowed for administrators only!' });
    }

    const {
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    } = await recipient.update(req.body);

    return res.json({
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    });
  }
}

export default new RecipientController();
