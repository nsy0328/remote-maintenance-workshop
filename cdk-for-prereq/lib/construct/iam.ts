import { RemovalPolicy, Duration, CfnOutput } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import {
  aws_iam as iam,
} from 'aws-cdk-lib';

export class VendorUser extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id)
    const VendorAUser = new iam.User(this, "VendorA-MFAUser", {
      userName: "VendorA-MFAUser",
    })
    const VendorBUser = new iam.User(this, "VendorB-MFAUser", {
      userName: "VendorB-MFAUser",
    })

    const MFAPolicyStatement = new iam.PolicyStatement({
      resources: ["*"],
      effect: iam.Effect.ALLOW,
      actions: [
        "iam:DeleteVirtualMFADevice",
        "iam:EnableMFADevice",
        "iam:CreateVirtualMFADevice",
        "iam:DeactivateMFADevice",
        "iam:ResyncMFADevice"
      ],
      sid: "AllowRegisterMFADevice"
    })

    VendorAUser.addToPolicy(MFAPolicyStatement)
    VendorBUser.addToPolicy(MFAPolicyStatement)
    VendorAUser.addManagedPolicy(iam.ManagedPolicy.fromManagedPolicyName(scope,id,"IAMUserChangePassword"))
    VendorBUser.addManagedPolicy(iam.ManagedPolicy.fromManagedPolicyName(scope,id,"IAMUserChangePassword"))
  }
}