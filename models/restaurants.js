var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reviewSchema = new Schema({
  rating:  { type: Number, min: 1, max: 5, required: true },
  comment:  {type: String,required: true},
  postedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
}, {
    timestamps: true
});


var restaSchema = new Schema({
  name:String,
  email:String,
  phone:Number,
  cuisines:[String],
  openingHours:{
      mon:{openFrom: Date, openTill:Date},
      tue:{openFrom: Date, openTill:Date},
      wed:{openFrom: Date, openTill:Date},
      thu:{openFrom: Date, openTill:Date},
      fri:{openFrom: Date, openTill:Date},
      sat:{openFrom: Date, openTill:Date},
      sunday:{openFrom: Date, openTill:Date}
  },
  highlights:{
    breakfast:{ type:Boolean, default:false},
    lunch:{ type:Boolean, default:false},
    dinner:{ type:Boolean, default:false},
    delivery:{ type:Boolean, default:false},
    takeAway:{ type:Boolean, default:false},
    seating:{ type:Boolean, default:false},
    outdoorSeating:{ type:Boolean, default:false},
    luxuryDining:{ type:Boolean, default:false},
    vegOnly:{ type:Boolean, default:false},
    bar:{ type:Boolean, default:false},
    ac:{ type:Boolean, default:false},
    dessertsnBakes:{ type:Boolean, default:false},
    buffet:{ type:Boolean, default:false},
    wifi:{ type:Boolean, default:false},
    happyHours:{ type:Boolean, default:false}
  },
  payments:{
    cash:{ type:Boolean, default:false},
    cards:{ type:Boolean, default:false},
    netbanking:{ type:Boolean, default:false}
  },
  address:{
      latlng: String,
      pincode: Number,
      formattedAddress: String
    },
  reviews:[reviewSchema]
}, {
    timestamps: true
});


var Restaurants = mongoose.model('Restaurant', restaSchema);
module.exports = Restaurants;
