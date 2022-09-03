import gateway from './services/gateway.js';
import httpServer from './services/httpServer.js';

const { getGateway, connectToGateway } = gateway;
const { server } = httpServer;

const response = await getGateway();
connectToGateway(response.url);