import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path'

export class LiveBotStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const secret = Secret.fromSecretNameV2(this, 'botSecret', 'LiveBot')

    const fn = new NodejsFunction(this, 'liveBotFn', {
      entry: path.join(__dirname, '../src/index.ts'),
      bundling: {
        externalModules: [
          'aws-sdk' //Use aws-sdk available in the Lambda runtime
        ]
      }
    })

    secret.grantRead(fn)

    // The code that defines your stack goes here

    const api = new LambdaRestApi(this, "liveBotApi", {
      restApiName: "LiveBotApi",
      handler: fn
    })
  }
}
