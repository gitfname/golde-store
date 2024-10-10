// import { Injectable } from '@nestjs/common';
// import { S3 } from 'aws-sdk';
// import { MemoryStoredFile } from "nestjs-form-data"

// @Injectable()
// export class S3Service {
//     private readonly s3: S3;

//     constructor() {
//         this.s3 = new S3({
//             endpoint: "storage.iran.liara.space",
//             accessKeyId: "dli0p2iagdouh6cu",
//             secretAccessKey: "face3364-aacc-4080-80b1-6e7c2e3ab1bf",
//             region: "default",
//         });
//     }

//     async uploadFile(file: MemoryStoredFile, bucket: string, key: string): Promise<string> {
//         const params = {
//             Bucket: bucket,
//             Key: key,
//             Body: file.buffer,
//             ContentType: file.mimetype,
//         };

//         const data = await this.s3.upload(params).promise();
//         return data.Location;
//     }

//     async getFileUrl(bucket: string, key: string): Promise<string> {
//         const params = {
//             Bucket: bucket,
//             Key: key,
//         };

//         const url = await this.s3.getSignedUrlPromise('getObject', params);
//         return url;
//     }


//     async listBuckets(): Promise<string[]> {
//         const data = await this.s3.listBuckets().promise();
//         return data.Buckets?.map(bucket => bucket.Name) as string[] || [];
//     }

//     async listFiles(bucket: string, prefix?: string): Promise<S3.ObjectList> {
//         const params = {
//             Bucket: bucket,
//             Prefix: prefix,
//         };

//         const data = await this.s3.listObjectsV2(params).promise();
//         return data.Contents || [];
//     }



//     async deleteFile(bucket: string, key: string): Promise<void> {
//         const params = {
//             Bucket: bucket,
//             Key: key,
//         };

//         await this.s3.deleteObject(params).promise();
//     }


//     async createBucket(bucket: string): Promise<void> {
//         const params = {
//             Bucket: bucket,
//         };
//         await this.s3.createBucket(params).promise();
//     }


//     async deleteBucket(bucket: string): Promise<void> {
//         // Before deleting a bucket, ensure it's empty.  Add this for safety.
//         const listedObjects = await this.listFiles(bucket);
//         if (listedObjects.length > 0) {
//             throw new Error("Bucket is not empty. Delete files before deleting the bucket.");
//         }
//         const params = {
//             Bucket: bucket,
//         };
//         await this.s3.deleteBucket(params).promise();
//     }
// }

import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand, ListBucketsCommand, ListObjectsV2Command, DeleteObjectCommand, CreateBucketCommand, DeleteBucketCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { MemoryStoredFile } from "nestjs-form-data"


@Injectable()
export class S3Service {
    private readonly s3Client: S3Client;

    constructor() {
        this.s3Client = new S3Client({
            region: "default",
            endpoint: "https://storage.iran.liara.space",
            credentials: {
                accessKeyId: "dli0p2iagdouh6cu",
                secretAccessKey: "face3364-aacc-4080-80b1-6e7c2e3ab1bf",
            },
        });
    }

    async uploadFile(file: MemoryStoredFile, bucket: string, key: string): Promise<void> {
        const params = {
            Bucket: bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        const command = new PutObjectCommand(params);
        const data = await this.s3Client.send(command);
        // return `https://${bucket}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${key}`; // Construct the URL directly
    }

    async getFileUrl(bucket: string, key: string, expiresIn: number = 3600): Promise<string> { // Added expiry option
        const command = new GetObjectCommand({ Bucket: bucket, Key: key });
        const url = await getSignedUrl(this.s3Client, command, { expiresIn });
        return url;
    }

    async listBuckets(): Promise<string[]> {
        const command = new ListBucketsCommand({});
        const data = await this.s3Client.send(command);
        return data.Buckets?.map(bucket => bucket.Name) as string[] || [];
    }

    async listFiles(bucket: string, prefix?: string): Promise<any[]> { // Return the raw Contents array
        const command = new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix });
        const data = await this.s3Client.send(command);
        return data.Contents || [];
    }

    async deleteFile(bucket: string, key: string): Promise<void> {
        const command = new DeleteObjectCommand({ Bucket: bucket, Key: key });
        await this.s3Client.send(command);
    }

    async createBucket(bucket: string): Promise<void> {
        const command = new CreateBucketCommand({ Bucket: bucket });
        await this.s3Client.send(command);
    }

    async deleteBucket(bucket: string): Promise<void> {
        const listedObjects = await this.listFiles(bucket);
        if (listedObjects.length > 0) {
            throw new Error("Bucket is not empty. Delete files before deleting the bucket.");
        }
        const command = new DeleteBucketCommand({ Bucket: bucket });
        await this.s3Client.send(command);
    }
}