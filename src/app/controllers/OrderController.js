class OrderController {
  async index(req, res) {
    return res.json({ message: 'true' });
  }

  async store(req, res) {
    return res.json({ message: 'true' });
  }

  async update(req, res) {
    return res.json({ message: 'true' });
  }

  async delete(req, res) {
    return res.json({ message: 'true' });
  }
}

export default new OrderController();
