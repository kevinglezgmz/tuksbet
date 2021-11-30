const axios = require('axios').default;

class CriptoController {
  static getCriptoPrices(req, res) {
    const coins = req.query.coins || 'BTC,ETH,LTC';
    axios
      .get(
        'https://api.nomics.com/v1/currencies/ticker?key=' +
          process.env.NOMICS_KEY +
          '&ids=' +
          coins +
          '&convert=USD&interval=1d'
      )
      .then((response) => {
        res.send(response.data);
      })
      .catch((err) => {
        res.send({ err: 'Error trying to fetch criptocurrencies data' });
      });
  }
}

module.exports = CriptoController;
