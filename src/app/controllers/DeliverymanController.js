class DeliverymanController {
  async index(req, res) {
    return res.json({ message: 'true' });
  }
}

export default new DeliverymanController();
