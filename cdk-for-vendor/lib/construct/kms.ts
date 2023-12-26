import { RemovalPolicy, Duration, CfnOutput } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import {
  aws_ec2 as ec2,
  aws_s3 as s3,
  aws_kms as kms
} from 'aws-cdk-lib';

export interface KMSProps {
  vpc: ec2.Vpc
  serverName: string
}

export class KMSKeys extends Construct {
  readonly s3Key: kms.Key
  readonly ebsKey: kms.Key
  constructor(scope: Construct, id: string, props: KMSProps) {
    super(scope, id)
    // Create KMS key for S3
    this.s3Key = new kms.Key(this, `s3Key-for-${props.serverName}`, {
      removalPolicy: RemovalPolicy.DESTROY,
      enableKeyRotation: true,
    })
    // Create KMS key for EBS
    this.ebsKey = new kms.Key(this, `ebsKey-for-${props.serverName}`, {
      removalPolicy: RemovalPolicy.DESTROY,
      enableKeyRotation: true,
    })
  } 
}