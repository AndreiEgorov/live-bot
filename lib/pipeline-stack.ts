import { pipelines, Stack, StackProps, Stage, StageProps } from "aws-cdk-lib";
import { LinuxBuildImage } from "aws-cdk-lib/aws-codebuild";

import { CodePipeline, ShellStep } from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";
import { LiveBotStack } from "./live-bot-stack";

// the pipeline will create us a stack
class MyApplication extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    new LiveBotStack(this, "production", {
      stackName: "live-bot-stack-by-pipeline",
    });
  }
}

// this pipeline Stack will use MyApplication and add it to its stage to create a "live-bot-stack-by-pipeline" stack
export class MyPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, "live-bot-pipeline", {
      crossAccountKeys: true,
      codeBuildDefaults: {
        buildEnvironment: {
          buildImage: LinuxBuildImage.STANDARD_5_0,
        },
      },
      synth: new ShellStep("Synth", {
        primaryOutputDirectory: "../cdk.out",
        input: pipelines.CodePipelineSource.connection(
          "AndreiEgorov/live-bot",
          "main",
          {
            connectionArn:
              "arn:aws:codestar-connections:us-west-2:254142059882:connection/bfe26fec-8bc3-44e5-91fc-be393e1884c7",
          }
        ),
        commands: [
          // 'cd "./',
          "npm ci",
          "npm test",
          "npm run build",
          "npm run cdk synth",
        ],
      }),
    });

    //what accounts you want your stack to be connected to
    //provide explicit stage
    pipeline.addStage(
      new MyApplication(this, "ProductionHi", {
        env: {
          account: "254142059882", // dil-team-adamantium
          region: "us-west-2",
        },
      }),
      {
        pre: [new pipelines.ManualApprovalStep("Deploykis")],
      }
    );
  }
}
