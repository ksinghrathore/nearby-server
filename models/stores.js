// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;


// create a schema
var storeSchema = new Schema({
    name: {type: String, required: true, unique: true},
    image:{type: String, required: true},
    category:{type: String, required: true},
    description: {type: String, required: true},
    email:{type: String, required: true,  unique: true},
    contact:{type: Number, required: true,  unique: true},
    address:{
        latlng:  {type: String, required: true, unique: true},
        pincode:  {type: Number, required: true},
        country:  {type:String, required:true},
        state:  {type:String, required:true},
        locality:  {type:String, required:true},
        formattedAddress: {type:String, required:true}
        }
  }, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Stores = mongoose.model('Store', storeSchema);

// make this available to our Node applications
module.exports = Stores;
