const axios = require('axios');

const ZAPIER_WEBHOOK_URL = process.env.ZAPIER_WEBHOOK_URL;

exports.triggerZapierWebhook = async (data) => {
  if (!ZAPIER_WEBHOOK_URL) {
    console.error('ZAPIER_WEBHOOK_URL is not set in environment variables');
    return false;
  }

  try {
    const response = await axios.post(ZAPIER_WEBHOOK_URL, data);
    return response.status === 200;
  } catch (error) {
    console.error('Error triggering Zapier webhook:', error);
    return false;
  }
};