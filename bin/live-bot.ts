#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { LiveBotStack } from "../lib/live-bot-stack";
import { MonitoringStack } from "../lib/monitoring-stack";
import { MyPipelineStack } from "../lib/pipeline-stack";

const app = new cdk.App();
new LiveBotStack(app, "sandbox", {
  stackName: "live-bot-stack",
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

// deploy: aws-vault exec dil-team-adamantium -- cdk deploy monitoring
new MonitoringStack(app, "monitoring", {
  stackName: "live-bot-monitoring-stack",
  env: { account: '254142059882', region: 'us-west-2' },
});

new MyPipelineStack(app, "pipeline-stack", {
  stackName:'live-bot-pipeline-stack', // when not provided, its id ("pipeline-stack") will be used by default
  env: { account: '254142059882', region: 'us-west-2' },
})