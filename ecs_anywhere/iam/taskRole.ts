import * as aws from "@pulumi/aws";

const taskRole = new aws.iam.Role("taskRole", {
    assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal(
        aws.iam.Principals.EcsTasksPrincipal
    ),
});

new aws.iam.RolePolicy("taskRolePolicy", {
    role: taskRole.id,
    policy: {
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Action: [
                    "ssmmessages:CreateControlChannel",
                    "ssmmessages:CreateDataChannel",
                    "ssmmessages:OpenControlChannel",
                    "ssmmessages:OpenDataChannel",
                ],
                Resource: "*",
            },
            {
                Effect: "Allow",
                Action: ["logs:DescribeLogGroups"],
                Resource: "*",
            },
            {
                Effect: "Allow",
                Action: [
                    "logs:CreateLogStream",
                    "logs:CreateLogGroup",
                    "logs:DescribeLogStreams",
                    "logs:PutLogEvents",
                ],
                Resource: "*",
            },
        ],
    }
});


export { taskRole }