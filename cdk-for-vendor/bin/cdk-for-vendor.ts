#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkForVendorStack } from '../lib/cdk-for-vendor-stack';

import * as dotenv from 'dotenv';
const path = require('path');
dotenv.config({path: path.join(__dirname, "../.env")});

const app = new cdk.App();
const vendorName: string = process.env.Vendor_Name ?? ''
const serverName: string = process.env.Server_Name ?? ''
new CdkForVendorStack(app, `CdkFor-${serverName}-Stack`, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  }
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});

cdk.Tags.of(app).add("Env", vendorName);