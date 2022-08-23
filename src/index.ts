import { App, AwsLambdaReceiver } from "@slack/bolt";

const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
});

// inits app with your bot token and AWS Lambda ready receiver

const app = new App({
  token: process.env.SLACK_BOT_TOKEN!,
  receiver: awsLambdaReceiver,
  scopes: ["chat:write", "app_mentions:read"],
});

module.exports.handler = async (event: any, context: any, callback: any) => {
  console.log(event);
  const handler = await awsLambdaReceiver.start();
  return handler(event, context, callback);
};

app.message(':wave:', async({message, say})=> {
    console.log("BOBOS message", JSON.stringify(message))
    await say(`Hello <@${message.user}>`)
})
