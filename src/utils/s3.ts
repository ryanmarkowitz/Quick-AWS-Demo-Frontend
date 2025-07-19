import AWS from 'aws-sdk';

// Configure AWS SDK
const configureS3 = () => {
  AWS.config.update({
    region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
    },
  });

  return new AWS.S3({
    params: {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
    },
  });
};

export const uploadToS3 = async (file: File): Promise<string> => {
  const s3 = configureS3();
  const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME || '';
  
  if (!bucketName) {
    throw new Error('S3 bucket name is not configured');
  }

  const fileName = `${Date.now()}-${file.name}`;
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: file,
    ContentType: file.type,
  };

  try {
    const { Location } = await s3.upload(params).promise();
    
    // Notify backend about the new upload
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: fileName,
        originalName: file.name,
        s3Location: Location,
      }),
    });
    
    return Location;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
};