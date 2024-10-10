const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');
const Template = require('./models/templateModel');

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD
);


mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));


//   const memeplate = new Template({
//     title: 'Surprised Brahmanandam',
//     imageURL: 'https://example.com/images/surprised_brahmanandam.jpg',
//     category: 'funny',
//     movieName: 'Pokiri',
//     actors: ['Brahmanandam', 'Mahesh Babu'],
//     createdAt: Date.now(),
//     secretTemplate: false
//   });
  
//   // Save the template to the database
//   memeplate.save()
//     .then((doc) => {
//       console.log('Template successfully created:', doc);
//     })
//     .catch((err) => {
//       console.error('Error creating template:', err);
//     });

    

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});