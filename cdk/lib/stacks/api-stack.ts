import { join } from 'path';
import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Code, Function, FunctionUrlAuthType, HttpMethod, Runtime } from 'aws-cdk-lib/aws-lambda';

interface ApiStackProps extends StackProps {
}

export class ApiStack extends Stack {

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const demoLambda = new Function(this, 'DemoLambda', {
      runtime: Runtime.PROVIDED_AL2023,
      code: Code.fromAsset(join(__dirname, '../../../'), {
        bundling: {
          image: Runtime.PROVIDED_AL2023.bundlingImage,
          user: 'root',
          command: [
            "/bin/sh",
            "-c",
            "GOOS=linux go build -tags lambda.norpc -o /asset-output/bootstrap /asset-input/src/main.go"
          ],
          // NOTE: Can mount local  repo to avoid re-downloading all the dependencies. Maven ex:
          // volumes: [
          //   {
          //     hostPath: join(homedir(), '.m2'),
          //     containerPath: '/root/.m2/'
          //   }
          // ],
          // outputType: BundlingOutput.ARCHIVED
        }
      }),
      handler: 'bootstrap',
      environment: {
        TEST_VALUE: 'TEST',
      },
      timeout: Duration.seconds(7),
    });

    const lambdaFunctionUrl = demoLambda.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ['*'],
        allowedHeaders: ['Authorization'],
        allowedMethods: [
          HttpMethod.ALL,
          // HttpMethod.GET,
          // HttpMethod.HEAD,
          // HttpMethod.OPTIONS,
          // HttpMethod.POST,
          // HttpMethod.DELETE,
          // HttpMethod.PUT,
          // HttpMethod.PATCH,
        ],
        maxAge: Duration.days(1),
      }
    });
  }
}
