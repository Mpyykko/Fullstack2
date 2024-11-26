const app = require('./app');
const config = require('./utils/config');
const logger = require('./utils/logger');

console.log('Mikä uri?', config.MONGODB_URI);

const PORT = config.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
