const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// URLs de Webhooks de Make.com proporcionadas por el usuario
const WEBHOOK_BUSCAR = 'https://hook.us2.make.com/1cn5opb54hm622drkln6is24ikt4tjd3';
const WEBHOOK_AGENDAR = 'https://hook.us2.make.com/qbixhkg5x6yfcq9j3unzmudds4yuqnqg';

app.post('/openai-tools', async (req, res) => {
  const { tool_call_id, function: functionName, arguments: args } = req.body;

  try {
    const data = JSON.parse(args);

    if (functionName === 'buscar_embarcaciones_disponibles') {
      const { fecha, hora, personas } = data;
      const response = await axios.post(WEBHOOK_BUSCAR, { fecha, hora, personas });
      return res.json({ tool_call_id, output: response.data });

    } else if (functionName === 'agendar_charter') {
      const response = await axios.post(WEBHOOK_AGENDAR, data);
      return res.json({ tool_call_id, output: response.data });

    } else {
      return res.status(400).json({ error: 'Función no reconocida' });
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error interno' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});