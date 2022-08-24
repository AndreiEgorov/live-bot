import { Construct } from "constructs";
import { Dashboard, GraphWidget, Metric } from "aws-cdk-lib/aws-cloudwatch";
import { Stack, StackProps } from "aws-cdk-lib";
import { Topic } from "aws-cdk-lib/aws-sns";
import { SlackChannelConfiguration } from "aws-cdk-lib/aws-chatbot";
import { SnsAction } from "aws-cdk-lib/aws-cloudwatch-actions";

export class MonitoringStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sharedSettings = {
      account: "254142059882",
      region: "us-west-2",
    };

    // Notification setup

    const liveBotTopic = new Topic(this, 'LiveBotAlarmTopic')

    const slackChannel = new SlackChannelConfiguration(this, "MySlackChannel", {
      slackChannelConfigurationName: 'live-bot-alerts-config',
      slackWorkspaceId: 'T04003APRH6',
      slackChannelId:'C03UZ9R89J8'
    })
    // subscribe slack to sns topic
    slackChannel.addNotificationTopic(liveBotTopic)

    // Metrics

    const errorMetric = new Metric({
      namespace:"AWS/ApiGateway",
      metricName: "5XXError",
      dimensionsMap: {
        ApiName: "LiveBotAPI"
      },
      ...sharedSettings
    })

    // create alarm
    const errorAlarm = errorMetric.createAlarm(this, "ErrorAlarm", {
      alarmName: "LiveBotError",
      threshold: 1,
      evaluationPeriods: 1
    })
   // notify sns when alarm occurs
    errorAlarm.addAlarmAction(new SnsAction(liveBotTopic))

    const dashboard = new Dashboard(this, "LiveBot", {
      dashboardName: 'Live-Bot-Dashboard'
    })

    dashboard.addWidgets(new GraphWidget({
      title: "Errors",
      left: [errorMetric]
    }))

    dashboard.addWidgets(new GraphWidget({
      title: "Executions",
      left: [new Metric({
        namespace: "AWS/ApiGateway",
        metricName: "Count",
        statistic: "Sum",
        dimensionsMap: {
          ApiName: "LiveBotApi"
        },
      })]
    }))
  }

}
