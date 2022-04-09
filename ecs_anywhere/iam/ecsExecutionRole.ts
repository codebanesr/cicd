import * as aws from "@pulumi/aws";

const executionRole = new aws.iam.Role("taskExecutionRole", {
    assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal(
        aws.iam.Principals.EcsTasksPrincipal
    ),
});

new aws.iam.RolePolicyAttachment("rpa-ecsanywhere-ecstaskexecution", {
    role: executionRole,
    policyArn: aws.iam.ManagedPolicy.AmazonECSTaskExecutionRolePolicy,
});


export { executionRole }