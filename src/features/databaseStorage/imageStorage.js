import React from 'react'
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';

const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET

function extractPublicId(url) {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.(jpg|jpeg|png|gif|webp|svg)/i);
  return match ? match[1] : null;
}

export function showImageFromUrl(imageUrl, width=500) {
  const publicId = extractPublicId(imageUrl);
  if (!publicId) return <div>Image not found</div>;

  const cld = new Cloudinary({ cloud: { cloudName: CLOUD_NAME } });
  const img = cld
    .image(publicId)
    .format('auto')
    .quality('auto')
    .resize(auto().gravity(autoGravity()).width(500).height(500));

    return <AdvancedImage className="card-img-top" cldImg={img} style={{ width: width , height: "100%", objectFit: "cover", display: "block"}} />;
}

export async function uploadImage(image) {
    console.log('CLOUD_NAME:', CLOUD_NAME);
    console.log('UPLOAD_PRESET:', UPLOAD_PRESET);
    
    const formData = new FormData();

    try {
        
        const file = image;
        
        // just for testing purposes
        /*const response = await fetch("/logo512.png");
        if (!response.ok) {
            throw new Error(`File not found: ${response.status}`);
        }
        const blob = await response.blob();
        const file = new File([blob], "logo512.png", { type: "image/png" });*/

        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);

        console.log('FormData entries:');
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Cloudinary Error:', errorText);
            throw new Error(`Upload failed: ${res.status} - ${errorText}`);
        }

        const data = await res.json();
        console.log('Upload erfolgreich:', data);
        return data.secure_url;
        
    } catch (err) {
        console.error('Upload fehlgeschlagen:', err);
        throw err;
    }
}