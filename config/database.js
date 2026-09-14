const mongoose = require('mongoose');

module.exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  }
  catch (error) {
    console.log("Kết nối database không thành công!");
    console.log(error);
  }
}