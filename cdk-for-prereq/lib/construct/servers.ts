import { RemovalPolicy, Duration, CfnOutput } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import {
  aws_ec2 as ec2,
} from 'aws-cdk-lib';

interface EC2Props {
  medVPC: ec2.Vpc
  vendorA_SG: ec2.SecurityGroup
  vendorB_SG: ec2.SecurityGroup
}

export class MedServer extends Construct {
  constructor(scope: Construct, id: string, props: EC2Props) {
    super(scope, id)
    const linuxName = "MedLinuxServer-VendorA"
    const winName = "MedWinServer-VendorB"

    // 医療機関側管理サーバ Linux
    const linuxServer = new ec2.Instance(this, linuxName, {
      vpc: props.medVPC,
      instanceName: linuxName,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.SMALL
      ),
      machineImage: new ec2.AmazonLinuxImage({
        edition: ec2.AmazonLinuxEdition.STANDARD,
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2
      }),
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS
      },
      securityGroup: props.vendorA_SG
    })
    new CfnOutput(this, 'MedLinuxServer-VendorA-IP', {
      value: `${linuxServer.instancePrivateIp}`,
    });

    // 医療機関側管理サーバ Windows
    const winServer = new ec2.Instance(this, winName, {
      vpc: props.medVPC,
      instanceName: winName,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.SMALL
      ),
      machineImage: new ec2.WindowsImage(ec2.WindowsVersion.WINDOWS_SERVER_2022_JAPANESE_FULL_BASE),
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS
      },
      securityGroup: props.vendorB_SG
    })
    new CfnOutput(this, 'MedWinServer-VendorB-IP', {
      value: `${winServer.instancePrivateIp}`,
    });
  }
}