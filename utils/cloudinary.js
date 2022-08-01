// work in progress

import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: '',
  api_key: '',
  secret_key: '',
});

const cloudinaryUpload = (file) => cloudinary.uploader.upload(file);
