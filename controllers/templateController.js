const Template = require('../models/templateModel');
const cloudinary = require('./../config/cloudinaryConfig.cjs');  // Ensure this path is correct
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'memetemplates',
    format: async () => 'png',  // Optionally you can change this to 'jpeg' or other formats
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,  // Use a unique name to prevent conflicts
  },
});



// const upload = multer({ storage: storage }).single('memeImage');

const upload = multer({ storage: storage }).array('memeImages');

exports.bulkUpload = (req, res) => {
  console.log('Received request data:', req.body);
  console.log('Uploaded files:', req.files);

  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Image upload failed', error: err });
    }

    const templatesData = JSON.parse(req.body.templates); // Parse the templates data

    const savedTemplates = [];

    try {
      for (let i = 0; i < req.files.length; i++) {
        const { description, movieName, actors } = templatesData[i];

        const newTemplate = new Template({
          memeImage: req.files[i].path,
          description,
          movieName,
          peopleInMeme: actors.split(',').map(actor => actor.trim()),
          createdAt: Date.now(),
        });

        const savedTemplate = await newTemplate.save();
        savedTemplates.push(savedTemplate);
      }

      res.status(200).json({
        message: 'Templates uploaded successfully!',
        data: savedTemplates,
      });
    } catch (error) {
      res.status(400).json({
        message: 'Error saving template data',
        error: error.message,
      });
    }
  });
};



exports.uploadTemplate = (req, res) => {
  console.log('Received request data:', req.body); // Log the text fields
  console.log('Uploaded file:', req.file); // Log the uploaded file details

  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Image upload failed', error: err });
    }

    const { description, movieName, peopleInMeme } = req.body;

    const newTemplate = new Template({
      memeImage: req.file.path,  // Updated to match the new schema
      description,
      movieName,
      actors: peopleInMeme.split(',').map(person => person.trim()), // Updated to use peopleInMeme
      createdAt: Date.now(),
    });

    try {
      const savedTemplate = await newTemplate.save();
      res.status(200).json({
        message: 'Template uploaded successfully!',
        data: savedTemplate,
      });
    } catch (error) {
      res.status(400).json({
        message: 'Error saving template data',
        error: error.message,
      });
    }
  });
};


exports.getTemplates = async (req, res) => {
  try {
    const templates = await Template.find(); 
    res.status(200).json({ message: 'Templates retrieved successfully', data: templates });
  } catch (error) {
    console.error('Error retrieving templates:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


exports.working = (req, res) => {
    try {       
        res.status(200).json({ message: 'working' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};