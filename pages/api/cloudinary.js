import { v2 as cloudinary } from 'cloudinary';

export default function signature(req, res) {
  // Get the timestamp in seconds
  const timestamp = Math.round(new Date().getTime() / 1000);

  // Get the signature using the Node.js SDK method api_sign_request
  const sign = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
    },
    process.env.CLOUDINARY_SECRET,
  );

  res.statusCode = 200;
  res.json({ sign, timestamp });
}
