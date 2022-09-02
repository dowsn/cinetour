import { useState } from 'react';
import { generateSignature } from '../utils/cloudinarySignature';

export function ImageUpload() {
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  function handleWidgetClick() {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'kennyy',
        uploadSignature: generateSignature,
        apiKey: process.env.CLOUDINARY_API_KEY,
        resourceType: 'image',
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          console.log('Done! Here is the image info: ', result.info);
          setIsImageUploaded(true);
        } else if (error) {
          console.log(error);
        }
      },
    );
    widget.open();
  }

  return (
    <div>
      <div>
        <button type="button" onClick={handleWidgetClick}>
          Upload image
        </button>
      </div>

      {isImageUploaded ? <div>Successfully uploaded</div> : null}
    </div>
  );
}
