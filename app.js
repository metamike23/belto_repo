const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra'); 
const cron = require('cron');

const app = express();
const port = 3000;

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Serve HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  // Access the uploaded file through req.file
  const uploadedFile = req.file;

  // Do something with the file, like saving it to a temporary location
  // In this example, we're just logging its details
  console.log('Uploaded File:', uploadedFile);

  // Respond to the client
  res.send('File uploaded successfully!');

  // Manually clean up the "uploads" folder at the end of the function
//  cleanupUploadsFolder();
});

// Schedule a cron job to clean up files older than 24 hours
const cleanupJob = new cron.CronJob('0 0 */1 * * *', () => {
  cleanupUploadsFolder();
});

cleanupJob.start();

// Function to manually clean up the "uploads" folder
function cleanupUploadsFolder() {
  const uploadDir = path.join(__dirname, 'uploads');

  fs.readdir(uploadDir, (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      const filePath = path.join(uploadDir, file);

      fs.unlink(filePath, (err) => {
        if (err) throw err;
        console.log(`Deleted file: ${filePath}`);
      });
    });
  });
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});