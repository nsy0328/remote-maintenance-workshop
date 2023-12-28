import { RemovalPolicy, Duration, CfnOutput, Tags } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import {
  aws_ec2 as ec2,
  
} from 'aws-cdk-lib';

export class Network extends Construct {
  readonly medVPC: ec2.Vpc;
  readonly vendVPC: ec2.Vpc;
  readonly venderA_SG: ec2.SecurityGroup;
  readonly venderB_SG: ec2.SecurityGroup;

  constructor(scope: Construct, id: string) {
    super(scope, id)
    const vendA = "VendorA"
    const vendB = "VendorB"
    const medVPCName = "MedI-vpc"
    const vendVPCName = "Vend-vpc"

    // 医療機関用VPC
    this.medVPC = new ec2.Vpc(scope, medVPCName, {
      vpcName: medVPCName,
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
      enableDnsHostnames: true,
      enableDnsSupport: true,
      maxAzs: 2,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: medVPCName+'-public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: medVPCName+'-egress',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS
        },
      ],
      natGateways: 2,
    })
    // Vendor VPC
    this.vendVPC = new ec2.Vpc(scope,vendVPCName, {
      vpcName: vendVPCName,
      ipAddresses: ec2.IpAddresses.cidr('10.1.0.0/16'),
      enableDnsHostnames: true,
      enableDnsSupport: true,
      maxAzs: 2,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: vendVPCName+'-public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: vendVPCName+'-egress',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS
        },
      ],
      natGateways: 2,
    })
    // S3 Gateway Endpoint for Vendor VPC Egress subnet
    this.vendVPC.addGatewayEndpoint('S3Endpoint', {
      service: ec2.GatewayVpcEndpointAwsService.S3,
      subnets: [{ subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }],
    });
    // VPCピアリングで２つのVPCを相互接続する
    const vpcPeeringConnection = new ec2.CfnVPCPeeringConnection(this, 'VpcPeeringConnection', {
      peerVpcId: this.medVPC.vpcId,
      vpcId: this.vendVPC.vpcId,
    });

    // Route tableにVPCピアリングのルーティングを追加
    this.medVPC.publicSubnets.map((iSubnet: ec2.ISubnet, index: number) => {
      new ec2.CfnRoute(this, `Route2${vendVPCName}${index}`, {
        routeTableId: iSubnet.routeTable.routeTableId,
        destinationCidrBlock: this.vendVPC.vpcCidrBlock,
        vpcPeeringConnectionId: vpcPeeringConnection.ref,
      });
    });
    this.vendVPC.publicSubnets.map((iSubnet: ec2.ISubnet, index: number) => {
      new ec2.CfnRoute(this, `Route2${medVPCName}${index}`, {
        routeTableId: iSubnet.routeTable.routeTableId,
        destinationCidrBlock: this.medVPC.vpcCidrBlock,
        vpcPeeringConnectionId: vpcPeeringConnection.ref,
      });
    });

    // Initial security group for MedVPC Instance (vendor A(Linux) and B(Windows) )
    this.venderA_SG = new ec2.SecurityGroup(this, 'SG-for-VendorA', {
      vpc: this.medVPC,
      allowAllOutbound: true,
    })
    this.venderA_SG.addIngressRule(ec2.Peer.ipv4(this.vendVPC.vpcCidrBlock), ec2.Port.tcp(22))
    this.venderA_SG.addIngressRule(ec2.Peer.ipv4(this.vendVPC.vpcCidrBlock), ec2.Port.icmpType(8))
    Tags.of(this.venderA_SG).add('Env', vendA)

    this.venderB_SG = new ec2.SecurityGroup(this, 'SG-for-VendorB', {
      vpc: this.medVPC,
      allowAllOutbound: true,
    })
    this.venderB_SG.addIngressRule(ec2.Peer.ipv4(this.vendVPC.vpcCidrBlock), ec2.Port.tcp(22))
    this.venderB_SG.addIngressRule(ec2.Peer.ipv4(this.vendVPC.vpcCidrBlock), ec2.Port.icmpType(8))
    Tags.of(this.venderB_SG).add('Env', vendB)

    new CfnOutput(this, 'vendVPCId', {
      value: `${this.vendVPC.vpcId}`,
    });
    new CfnOutput(this, 'vendorA-SGId', {
      value: `${this.venderA_SG.securityGroupId}`,
    });
    new CfnOutput(this, 'vendorB-SGId', {
      value: `${this.venderB_SG.securityGroupId}`,
    });
  }
}