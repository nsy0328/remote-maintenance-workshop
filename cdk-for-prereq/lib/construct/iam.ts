import { RemovalPolicy, Duration } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import {
  aws_iam as iam,
} from 'aws-cdk-lib';

export class VendorRoles extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id)
    
    // Create S3 list put get policy
    const S3ListPutGetPolicy = new iam.Policy(this, 'S3ListPutGetPolicy', {
      policyName: 'S3ListPutGetPolicy',
      statements: [
        new iam.PolicyStatement({
          sid: 'S3ListPutGetPolicy',
          resources: ['*'],
          actions: ['s3:ListBucket', 's3:PutObject', 's3:GetObject'],
        }),
      ],
    })
    // Create Fleet Manager Connect policy
    

    // Create 
  }
}