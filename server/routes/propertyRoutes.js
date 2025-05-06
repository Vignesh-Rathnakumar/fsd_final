import express from 'express';
import multer from 'multer';
import Property from '../models/Property.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// GET all properties
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a specific property
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET properties by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.params.userId }).sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new property
router.post('/', upload.array('images', 10), async (req, res) => {
  try {
    const { title, description, location, price, owner, ownerName } = req.body;
    
    // Get file paths from multer
    const imagePaths = req.files ? req.files.map(file => file.path) : [];
    
    const property = new Property({
      title,
      description,
      location,
      price,
      images: imagePaths,
      owner,
      ownerName,
    });
    
    const newProperty = await property.save();
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update a property
router.put('/:id', upload.array('images', 10), async (req, res) => {
  try {
    const { title, description, location, price } = req.body;
    
    // Get existing property
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    // Get existing images
    const existingImages = req.body.existingImages || [];
    
    // Get new image paths from multer
    const newImagePaths = req.files ? req.files.map(file => file.path) : [];
    
    // Combine existing and new images
    const allImages = Array.isArray(existingImages) 
      ? [...existingImages, ...newImagePaths] 
      : [existingImages, ...newImagePaths];
    
    // Update the property
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id, 
      {
        title,
        description,
        location,
        price,
        images: allImages,
      },
      { new: true }
    );
    
    res.json(updatedProperty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a property
router.delete('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    await property.remove();
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;