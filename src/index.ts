import { App, AwsLambdaReceiver } from "@slack/bolt";
import middy from "@middy/core";
import secretsManager from "@middy/secrets-manager";

// inits app with your bot token and AWS Lambda ready receiver

let app: App;
let awsLambdaReceiver: AwsLambdaReceiver;

const lambdaHandler = async (event: any, context: any, callback: any) => {
  if (!app) {
    // inits app with your bot token and AWS Lambda ready receiver
    awsLambdaReceiver = new AwsLambdaReceiver({
      signingSecret: context.botSecret.SLACK_SIGNING_SECRET!,
    });

    app = new App({
      token: context.botSecret.SLACK_BOT_TOKEN!,
      receiver: awsLambdaReceiver,
      scopes: ["chat:write", "app_mentions:read"],
    });

    app.message(":wave:", async ({ message, say }) => {
      // @ts-ignore
      await say(`Hello <@${message.user}>, I am Batmaaaan!`);
    });
  }

  const handler = await awsLambdaReceiver.start();
  return handler(event, context, callback);
};

export const handler = middy()
  .use(
    secretsManager({
      fetchData: {
        botSecret: "LiveBot",
      },
      setToContext: true,
    })
  )
  .handler(lambdaHandler);
