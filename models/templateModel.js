const mongoose = require('mongoose');
const slugify = require('slugify');

// Define the schema for a Meme Template
const templateSchema = new mongoose.Schema(
  {
    memeImage: {
      type: String,
      required: [true, 'A meme must have an image URL'],
    },
    description: {
      type: String,
      required: [true, 'A meme must have a description'],
      trim: true,
      // maxlength: [200, 'A meme description must have less than or equal to 200 characters'],
      minlength: [5, 'A meme description must have more than or equal to 5 characters']
    },
    // emotion: {
    //   type: String,
    //   required: [true, 'A meme must have an emotion'],
    // },
    movieName: {
      type: String,
      trim: true,
      required: [true, 'A meme must have a movie name']
    },
    peopleInMeme: {
      type: [String], // An array of strings to hold names of people in the meme
      required: [true, 'A meme must have associated people']
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false
    },
    secretTemplate: {
      type: Boolean,
      default: false
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  },
  { collection: 'memeplate' }
);

// Virtual property to count the number of people in a meme
templateSchema.virtual('numberOfPeople').get(function() {
  return this.peopleInMeme.length;
});

// Document Middleware: Automatically generate a slug before saving the document
templateSchema.pre('save', function(next) {
  this.slug = slugify(this.description, { lower: true }); // Optionally, use description for slug
  next();
});

// Query Middleware: Exclude secret templates from any query results
templateSchema.pre(/^find/, function(next) {
  this.find({ secretTemplate: { $ne: true } });
  this.start = Date.now();
  next();
});

// Post Query Middleware: Calculate and log the query execution time
templateSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

// Aggregation Middleware: Exclude secret templates from aggregation results
templateSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTemplate: { $ne: true } } });
  next();
});

// Create a Model from the Schema
const Template = mongoose.model('Template', templateSchema);

module.exports = Template;
