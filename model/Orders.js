const { model, Schema, models } = require('mongoose');

const OrderSchema = new Schema({
    courier: String,
    orderType: String,
    reference: Number,
    status: String,
    customer: [
        {
            name: String,
            fullAddress: String,
            latitude: Number,
            longitude: Number,
            phoneNumber: Number
        }
    ],
    orderItems: [
        {
            name: String,
            price: Number
        }
    ],
    restaurant: [{
        fullAddress: String,
        latitude: Number,
        logoImg: String,
        longitude: Number,
        name: String
    }],
    courier: [{
        name: String,
        latitude: Number,
        longitude: Number
      }]
});


module.exports = models.Orders || model('Orders', OrderSchema, 'Orders'); 