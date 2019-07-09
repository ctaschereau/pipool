const axios = require('axios');
const config = require('config');

class TempUtils {
	static async getTemp() {
		let response = await axios.get(config.tempServerUrl);
		return response.data.temp;
	}
}
module.exports = TempUtils;
