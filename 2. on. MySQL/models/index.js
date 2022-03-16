const mongoose = require('mongoose');

const connect = () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      ignoreUndefined: true,
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = connect;
