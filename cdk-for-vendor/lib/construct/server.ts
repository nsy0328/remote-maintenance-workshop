import { RemovalPolicy, Duration, CfnOutput, ScopedAws } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import {
  aws_ec2 as ec2,
  aws_s3 as s3,
  aws_kms as kms,
  aws_iam as iam,
} from 'aws-cdk-lib';

interface EC2Props {
  vendVPCId: string
  serverName: string
  ipwhite: string
  s3Key: kms.Key
  ebsKey: kms.Key
}

export class RemoteBastion extends Construct {
  constructor(scope: Construct, id: string, props: EC2Props) {
    super(scope, id)
    // select vpc from vpc id
    const vendVPC = ec2.Vpc.fromLookup(this, "vendVPC", {
      vpcId: props.vendVPCId
    })
    // Create SSM Role
    const ssm_role = new iam.Role(this, `Rolefor${props.serverName}`, {
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "AmazonSSMManagedInstanceCore"
        ),
      ],
    })

    // Create S3 bucket 
    const s3Bucket = new s3.Bucket(this, `permanent-bucket-${props.serverName.toLowerCase()}`, {
      bucketName: `permanent-bucket-${props.serverName.toLowerCase()}`,
      encryption: s3.BucketEncryption.KMS,
      encryptionKey: props.s3Key,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      versioned: true,
      lifecycleRules: [
        {
          expiration: Duration.days(365)
        }
      ] 
    })

    // Security Group for Bastion Server
    // allow All Outbound from ip whitelist
    const bastionEc2SecurityGroup = new ec2.SecurityGroup(this, `bastion-${props.serverName}-SecurityGroup`, {
      vpc: vendVPC,
      description: "Security Group for Bastion Server",
      allowAllOutbound: false
    })
    // Security Group for Bastion Server, allow HTTPS 
    bastionEc2SecurityGroup.addEgressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443)
    )
    bastionEc2SecurityGroup.addEgressRule(
      ec2.Peer.ipv4(props.ipwhite),
      ec2.Port.icmpType(8)
    )
    bastionEc2SecurityGroup.addEgressRule(
      ec2.Peer.ipv4(props.ipwhite), // ex) xxx.xxx.xxx.xxx/xx
      ec2.Port.tcp(22)
    )

    // Bastion Server Linux
    const bastionServer = new ec2.Instance(this, props.serverName, {
      vpc: vendVPC,
      instanceName: props.serverName,
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
      securityGroup: bastionEc2SecurityGroup,
      blockDevices: [{
        deviceName: "/dev/xvda",
        volume: ec2.BlockDeviceVolume.ebs(30, {
          encrypted: true,
          kmsKey: props.ebsKey,
          deleteOnTermination: true,
          volumeType: ec2.EbsDeviceVolumeType.GP2
        })
      }],
      role: ssm_role,
    })
    // add permission for S3 bucket
    s3Bucket.grantReadWrite(bastionServer.role)
  } 
}