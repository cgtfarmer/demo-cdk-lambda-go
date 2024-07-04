// Runtime: Amazon Linux 2023

package main

import (
	"fmt"
	"os"
  "github.com/aws/aws-lambda-go/events"
  "github.com/aws/aws-lambda-go/lambda"
)

func Handler(event *events.LambdaFunctionURLRequest) (events.LambdaFunctionURLResponse, error) {
  testEnvVar := os.Getenv("TEST_VALUE")

	fmt.Printf("Env var: %s\n", testEnvVar)

	fmt.Println(event);
	// fmt.Println(context);

  response := events.LambdaFunctionURLResponse {
		Body: "Hello, world!",
		StatusCode: 200,
	}

  fmt.Println(response)
  return response, nil
}

func main() {
  lambda.Start(Handler)
}
