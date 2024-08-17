import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const ACCESS_KEY = process.env.AWS_ACCESS_KEY || "";
const SECRET_KEY = process.env.AWS_SECRET_KEY || "";
const REGION = process.env.REGION || "";
const client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});
