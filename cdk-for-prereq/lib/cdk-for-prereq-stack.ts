import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Network, MedServer } from './construct';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkForPrereqStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const {medVPC, vendVPC, venderA_SG, venderB_SG} = new Network(this, "Network")

    const medServer = new MedServer(this, "MedServer", {
      medVPC: medVPC,
      vendorA_SG: venderA_SG,
      vendorB_SG: venderB_SG,
    })

    // example resource
    // const queue = new sqs.Queue(this, 'CdkForPrereqQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
