import axios from "axios";

export default {
  async validateZipcode(zipCode) {
    try {
      const response = await axios.get(
        `https://viacep.com.br/ws/${zipCode}/json/`
      );

      if (response.error) {
        return { error: response.error };
      }

      return response;
    } catch (error) {
      return { error };
    }
  },
};
