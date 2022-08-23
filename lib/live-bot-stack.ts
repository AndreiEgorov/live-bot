import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class LiveBotStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const secret = Secret.fromSecretNameV2(this, 'botSecret', 'LiveBot')

    const fn = new NodejsFunction(this, 'liveBotFn', {
      entry: path.join(__dirname, '../src/index.ts'),
      environment: {
        SLACK_SIGNING_SECRET:secret.secretValueFromJson("SLACK_SIGNING_SECRET").unsafeUnwrap(),
        SLACK_BOT_TOKEN:secret.secretValueFromJson("SLACK_BOT_TOKEN").unsafeUnwrap()
      }
    })

    // test to see output
    console.log("UNSAFE bobos", secret.secretValueFromJson("SLACK_SIGNING_SECRET").unsafeUnwrap())
    console.log("SAFE bobos", secret.secretValueFromJson("SLACK_SIGNING_SECRET")) //TODO, put in a var and apply unsafeUnwrap to it. see if you can 
    //
    // The code that defines your stack goes here

    const api = new LambdaRestApi(this, "liveBotApi", {
      restApiName: "LiveBotApi",
      handler: fn
    })


    // example resource
    // const queue = new sqs.Queue(this, 'LiveBotQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
