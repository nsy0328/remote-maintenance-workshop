import { RemovalPolicy, Duration, CfnOutput, Tags} from 'aws-cdk-lib';
import { Construct } from 'constructs'
import {
  aws_ec2 as ec2,
  aws_s3 as s3,
  aws_kms as kms,
  aws_iam as iam
} from 'aws-cdk-lib';

export interface KMSProps {
  vendorName: string,
  Admin_Setting_Role: string,
}

export class KMSKeys extends Construct {
  readonly s3Key: kms.Key
  readonly ebsKey: kms.Key
  constructor(scope: Construct, id: string, props: KMSProps) {
    super(scope, id)
    // Create KMS key for S3
    this.s3Key = new kms.Key(this, `S3-KMS-${props.vendorName}`, {
      description: `CMK for ${props.vendorName} S3`,
      removalPolicy: RemovalPolicy.DESTROY,
      enableKeyRotation: true,
    })

    // Create KMS key for EBS
    this.ebsKey = new kms.Key(this, `EBS-KMS-${props.vendorName}`, {
      description: `CMK for ${props.vendorName} EBS`,
      removalPolicy: RemovalPolicy.DESTROY,
      enableKeyRotation: true,
    })
  } 
}