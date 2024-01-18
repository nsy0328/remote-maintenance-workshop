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

    // Parameters
    const vpcId = new cdk.CfnParameter(this, 'VpcId', {
      type: 'AWS::EC2::VPC::Id',
      description: 'VpcId of you existing VPC',
      default: process.env.VPC_ID ?? ''
    });
    const serverName = new cdk.CfnParameter(this, 'serverName', {
      type: 'String',
      description: 'The name of bastion server',
      default: process.env.Server_Name ?? ''
    });
    const vendorName = new cdk.CfnParameter(this, 'vendorName', {
      type: 'String',
      description: 'The name of vendor (Tags/Env:)',
      default: process.env.Vendor_Name ?? ''
    });
    const adminRole = new cdk.CfnParameter(this, 'Admin_Setting_Role', {
      type: 'String',
      description: 'The name of Remote connection environment administrator role',
      default: process.env.Admin_Setting_Role ?? ''
    });
    const ipwhite = new cdk.CfnParameter(this, 'ipwhite', {
      type: 'String',
      description: 'Medical institution server IP (SG OutBound Rule)',
      default: process.env.WHITE_IP ?? '',
      allowedPattern: '(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})/(\d{1,2})'
    });

    // Interface
    this.templateOptions.metadata = {
      'AWS::CloudFormation::Interface': {
        ParameterGroups: [
          {
            Label: { default: 'Related to Exist Resources' },
            Parameters: [vpcId.logicalId, adminRole, ipwhite],
          },
          {
            Label: { default: 'Related to New Resource Name' },
            Parameters: [vendorName, serverName],
          },
        ],
      },
    };


    const { s3Key, ebsKey } = new KMSKeys(this, "KMSKeys", {
      vendorName: vendorName.valueAsString,
      Admin_Setting_Role: adminRole.valueAsString,
    })
    cdk.Tags.of(s3Key).add('Env', vendorName.valueAsString)
    cdk.Tags.of(ebsKey).add('Env', vendorName.valueAsString)

    const serverConst = new RemoteBastion(this, "BastionLinux",{
      vendVPCId: vpcId.valueAsString,
      serverName: serverName.valueAsString,
      vendorName: vendorName.valueAsString,
      ipwhite: ipwhite.valueAsString,
      s3Key: s3Key,
      ebsKey: ebsKey,
    })
    cdk.Tags.of(serverConst).add('Env', vendorName.valueAsString)


    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkForVendorQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
