var express = require('express');
var mongo = require('mongoose');
var timestamp = require('mongoose-timestamp');

var port = process.env.PORT || 4000;

var db = mongo.connect("mongodb://localhost:27017/car", {useNewUrlParser: true}, function (err, response) {
    if (err) {
        console.error(err);
    }
    else {
        console.error('MONGOOSE CONNECTION SUCCESSFUL');
        console.log('CONNCECTED TO ' + db, '+', response);
    }
});

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//CONNECT WITH THE FRONTEND AND ALLOW METHODS TO WORK
//!!! THIS IS MY CORS() !!!
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE'); //GET,POST,PUT,PATCH,DELETE
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})

var CarsSchema = new mongo.Schema({
    carName: { type: String, required: true },
    carBrand: { type: String, required: true }, 
    carType: { type: String, required: true }, 
    price: { type: Number, required: true }, 
    color: { type: String, required: true }, 
    fuelType: { type: String, required: true }, 
    mileage: { type: Number, required: true }, 
    engineDisplacement: { type: Number, required: true }, 
    seats: { type: Number, required: true }, 
    transmission: { type: String, required: true }, 
    year: { type: Number, required: true }, 
}, { versionKey: false });

CarsSchema.plugin(timestamp, {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

var model = mongo.model('car', CarsSchema);

app.get('/api/v1/cars', async function (req, res) {
  try {
    const task = await model.find({});
    if (task)
    // res.json({task: task});
    res.json( task );
    else
    res.json({message: "RECORD NOT FOUND"});
    // res.send('GET AND API IS WORKING');
} catch (err) {
    res.status(422).send({ error: err.message });
    console.log({ error: err.message });
}
});

app.get('/api/v1/cars/:id', async function (req, res) {
  try {
    const task = await model.findOne({"_id":req.params.id});
    if (task)
    // res.json({task: task});
    res.json( task );
    else
    res.json({message: "RECORD NOT FOUND"});
    // res.send(`${req.params.id} RECEIVED TO DELETE`);
} catch (err) {
    res.status(422).send({ error: err.message });
    console.log({ error: err.message });
}
});

app.post('/api/v1/cars', async function (req, res) {
  try {
    const task = await new model({
      carName: req.body.carName,
      carBrand: req.body.carBrand,
      carType: req.body.carType,
      price: req.body.price,
      color: req.body.carName,
      fuelType: req.body.fuelType,
      mileage: req.body.mileage,
      engineDisplacement: req.body.engineDisplacement,
      seats: req.body.seats,
      transmission: req.body.transmission,
      year: req.body.year
    });
    await task.save();
    res.json({message: "POST SUCCESSFUL"});
    // res.send('POST IS WORKING');
} catch (err) {
    res.status(422).send({ error: err.message });
    console.log({ error: err.message });
}
});

app.put('/api/v1/cars/:id', async function (req, res) {
  try {
    const task = await model.findByIdAndUpdate(req.params.id,{
        carName: req.body.carName,
        carBrand: req.body.carBrand,
        carType: req.body.carType,
        price: req.body.price,
        color: req.body.carName,
        fuelType: req.body.fuelType,
        mileage: req.body.mileage,
        engineDisplacement: req.body.engineDisplacement,
        seats: req.body.seats,
        transmission: req.body.transmission,
        year: req.body.year
    });
    if (task)
    res.json({message: "UPDATE SUCCESSFUL"});
    else
    res.json({message: "RECORD NOT FOUND"});
    // res.send(`${req.params.id} RECEIVED TO UPDATE`);
} catch (err) {
    res.status(422).send({ error: err.message });
    console.log({ error: err.message });
}
});

app.delete('/api/v1/cars/:id', async function (req, res) {
  try {
    const task = await model.findByIdAndDelete(req.params.id);
    if (task)
    res.json({message: "DELETE SUCCESSFUL"})
    else
    res.json({message: "RECORD NOT FOUND"})
    // res.send(`${req.params.id} RECEIVED TO DELETE`);
} catch (err) {
    res.status(422).send({ error: err.message });
    console.log({ error: err.message });
}
});


app.listen(port, function () {
    console.log(`SERVER RUNNING AT PORT: ${port}`);
});
