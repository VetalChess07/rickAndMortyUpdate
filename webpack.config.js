const path = require('path');

module.exports = {
  
  
  resolve: {
   
    alias: {
      Components: path.resolve(__dirname, 'src/components/'),
      Hooks: path.resolve(__dirname, 'src/hooks/'),
    }
  }
};