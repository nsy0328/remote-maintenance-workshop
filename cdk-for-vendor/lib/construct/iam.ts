import { RemovalPolicy, Duration, CfnOutput } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import {
  aws_ec2 as ec2,
  aws_s3 as s3,
  aws_kms as kms,
  aws_iam as iam,
} from 'aws-cdk-lib';

export interface IamProps {
  vpc: ec2.Vpc
  serverName: string
}

export class Iam extends Construct {
  readonly ssm_role: iam.Role

  constructor(scope: Construct, id: string, props: IamProps) {
    super(scope, id)
    
    this.ssm_role = new iam.Role(this, `Rolefor${props.serverName}`, {
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "AmazonSSMManagedInstanceCore"
        ),
      ],
    })
  } 
}