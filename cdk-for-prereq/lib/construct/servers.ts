import { RemovalPolicy, Duration, CfnOutput, Tags } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import {readFileSync} from 'fs';
import {
  aws_ec2 as ec2,
} from 'aws-cdk-lib';

import * as dotenv from 'dotenv';
const path = require('path');
dotenv.config({path: path.join(__dirname, "../../../cdk-for-vendor/.env")});


interface EC2Props {
  medVPC: ec2.Vpc
  vendorA_SG: ec2.SecurityGroup
  vendorB_SG: ec2.SecurityGroup
}

export class MedServer extends Construct {
  constructor(scope: Construct, id: string, props: EC2Props) {
    super(scope, id)

    const vendA = "VendorA"
    const vendB = "VendorB"
    const linuxName = `MedLinuxServer-${vendA}`
    const winName = `MedWinServer-${vendB}`
    // キーペア作成
    const linuxKeyPair = new ec2.CfnKeyPair(this, `${linuxName}KeyPair`, {
      keyName: `${linuxName.toLocaleLowerCase()}-key-pair`,
      tags: [{key: 'Env',value: vendA}]
    })
    linuxKeyPair.applyRemovalPolicy(RemovalPolicy.DESTROY)

    const winKeyPair = new ec2.CfnKeyPair(this, `${winName}}KeyPair`, {
      keyName: `${winName.toLocaleLowerCase()}-key-pair`,
      tags: [{key: 'Env',value: vendB}]
    })
    winKeyPair.applyRemovalPolicy(RemovalPolicy.DESTROY)

    // キーペア取得コマンドアウトプット
    new CfnOutput(this, 'GetLinuxSSHKeyCommand', {
      value: `aws ssm get-parameter --name /ec2/keypair/${linuxKeyPair.getAtt('KeyPairId')} --region ${process.env.CDK_DEFAULT_REGION} --with-decryption --query Parameter.Value --output text`,
    })
    new CfnOutput(this, 'GetWinSSHKeyCommand', {
      value: `aws ssm get-parameter --name /ec2/keypair/${winKeyPair.getAtt('KeyPairId')} --region ${process.env.CDK_DEFAULT_REGION} --with-decryption --query Parameter.Value --output text`,
    })

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
      securityGroup: props.vendorA_SG,
      keyName: `${linuxName.toLocaleLowerCase()}-key-pair`
    })
    Tags.of(linuxServer).add('Env', vendA);
    new CfnOutput(this, `${linuxName}-IP`, {
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
      securityGroup: props.vendorB_SG,
      keyName: `${winName.toLocaleLowerCase()}-key-pair`
    })
    const userDataScript = readFileSync(path.join(__dirname, '../MedWinUserData.ps1'), 'utf8');
    winServer.addUserData(userDataScript);

    Tags.of(winServer).add('Env', vendB);
    new CfnOutput(this, `${winName}-IP`, {
      value: `${winServer.instancePrivateIp}`,
    });
  }
}