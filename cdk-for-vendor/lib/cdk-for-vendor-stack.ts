import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RemoteBastion } from './construct/server';
import { KMSKeys } from './construct/kms';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

import * as dotenv from 'dotenv';
const path = require('path');
dotenv.config({path: path.join(__dirname, "../.env")});
export class CdkForVendorStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpcId: string = process.env.VPC_ID ?? '';
    const serverName: string = process.env.Server_Name ?? '';
    const ipwhite: string = process.env.WHITE_IP ?? '';

    const { s3Key, ebsKey } = new KMSKeys(this, "KMSKeys", {
      serverName: serverName,  
    })

    new RemoteBastion(this, "BastionLinux",{
      vendVPCId: vpcId,
      serverName: serverName,
      ipwhite: ipwhite,
      s3Key: s3Key,
      ebsKey: ebsKey,
    })


    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkForVendorQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
