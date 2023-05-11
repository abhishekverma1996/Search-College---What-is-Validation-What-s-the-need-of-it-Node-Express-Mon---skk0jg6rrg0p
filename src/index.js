const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { connections } = require('mongoose');

mongoose.connect('mongodb://localhost/college', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Import the CollegeRecord model
const { CollegeRecord } = require('./models/collegeRecord');

// Endpoint to find colleges
app.get('/findColleges', async (req, res) => {
  const { name, state, city, minPackage, maxFees, course, exam } = req.query;

  // Construct the MongoDB query based on the provided parameters
  const query = {};
  if (name) query.name = { $regex: new RegExp(name, 'i') };
  if (state) query.state = { $regex: new RegExp(state, 'i') };
  if (city) query.city = { $regex: new RegExp(city, 'i') };
  if (minPackage && !isNaN(minPackage)) query.averagePackage = { $gte: parseFloat(minPackage) };
  if (maxFees && !isNaN(maxFees)) query.totalFees = { $lte: parseFloat(maxFees) };
  if (course) query.courses = { $regex: new RegExp(course, 'i') };
  if (exam) query.exams = { $regex: new RegExp(exam, 'i') };

  // Find the matching colleges in the database
  const colleges = await CollegeRecord.find(query);

  // Send the response
  res.json(colleges);
});



app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;
