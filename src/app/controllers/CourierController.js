import * as Yup from 'yup';
import { Op } from 'sequelize';

import Courier from '../models/Courier';
import File from '../models/File';
import User from '../models/User';

class CourierController {
  async index(req, res) {
    const { page = 1, name = '' } = req.query;

    const courier = await Courier.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
      order: ['id'],
      attributes: ['id', 'name', 'email'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    if (!courier) {
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

    return res.json(courier);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const courierExists = await Courier.findOne({
      where: { email: req.body.email },
    });

    if (courierExists) {
      return res.status(400).json({ error: 'Courier already exists.' });
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

    const { id, name, email, avatar_id } = await Courier.create(req.body);

    const { avatar } = await Courier.findByPk(avatar_id, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json({
      id,
      name,
      email,
      avatar,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const courier = await Courier.findByPk(id);

    if (!courier) {
      return res.status(400).json({ error: `Courier id: ${id}, not found!` });
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

    await courier.update(req.body);

    const { name, email, avatar } = await Courier.findByPk(id, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json({
      id,
      name,
      email,
      avatar,
    });
  }

  async delete(req, res) {
    if (!req.params.id) {
      return res.status(401).json({ error: 'Incorret Params' });
    }

    const courier = await Courier.findByPk(req.params.id);

    if (!courier) {
      return res.status(400).json({ error: 'Invalid Courier' });
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

    await courier.destroy({ where: { id: req.params.id } });

    return res.json({
      Success: `Courier ${courier.name}, Successfully deleted!`,
    });
  }
}

export default new CourierController();
