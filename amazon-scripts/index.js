const {
  RekognitionClient,
  DetectModerationLabelsCommand,
  DetectModerationLabelsCommandInput,
} = require('@aws-sdk/client-rekognition');
const { S3Client, DeleteObjectCommandInput, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { SNSClient, PublishCommand, PublishCommandInput } = require('@aws-sdk/client-sns');

const s3client = new S3Client({ region: 'us-east-1' });
const clientSNS = new SNSClient({ region: 'us-east-1' });
const rekognitionClient = new RekognitionClient({ region: 'us-east-1' });

function reviewImages(event) {
  return new Promise((resolve, reject) => {
    const promiseArray = [];

    event.Records.forEach((record) => {
      let { body } = record;
      if (typeof record.body === 'string') {
        body = JSON.parse(record.body);
      }
      promiseArray.push(processImageBatch(body.Records));
    });

    Promise.all(promiseArray).then(resolve).catch(reject);
  });
}

function processImageBatch(records) {
  return new Promise((resolve, reject) => {
    const processImagePromiseArray = records.map((s3Record) => processImage(s3Record.s3));
    Promise.all(processImagePromiseArray).then(resolve).catch(reject);
  });
}

function processImage(s3Data) {
  return new Promise(async (resolve, reject) => {
    try {
      const decodedKey = decodeURIComponent(s3Data.object.key);
      const moderationLabels = await detectModerationLabels(s3Data.bucket.name, decodedKey);
      if (moderationLabels.length > 0) {
        const removedImage = await removeInappropiateImage(s3Data.bucket.name, decodedKey);
        resolve({ ...removedImage, moderationLabels });
      } else {
        resolve({ msg: 'All good, no moderation necessary', bucket: s3Data.bucket.name, key: decodedKey });
      }
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * @param { string } bucket
 * @param { string } key
 */
async function detectModerationLabels(bucket, key) {
  /** @type { DetectModerationLabelsCommandInput } */
  const params = {
    Image: {
      S3Object: { Bucket: bucket, Name: key },
    },
    MinConfidence: 60,
  };
  try {
    const command = new DetectModerationLabelsCommand(params);
    const response = await rekognitionClient.send(command);
    return response.ModerationLabels;
  } catch (err) {
    throw { err: err, msg: 'Rekognition Error' };
  }
}

/**
 * @param { string } bucket
 * @param { string } key
 */
async function removeInappropiateImage(bucket, key) {
  /** @type { DeleteObjectCommandInput } */
  const params = {
    Bucket: bucket,
    Key: key,
  };
  try {
    const command = new DeleteObjectCommand(params);
    const response = await s3client.send(command);
    return { msg: 'Successfuly deleted inappropiate image', key, bucket };
  } catch (err) {
    throw { err: err, msg: 'S3 Error' };
  }
}

async function handler(event) {
  try {
    const results = await reviewImages(event);
    /** @type { PublishCommandInput } */
    const snsParams = {
      Message: JSON.stringify(results, null, 2),
      Subject: 'Resultado revisión de imágenes',
      TopicArn: 'arn:aws:sns:us-east-1:789522973773:tuksbet',
    };
    await clientSNS.send(new PublishCommand(snsParams));
    return results;
  } catch (err) {
    return err;
  }
}
module.exports = { handler };
