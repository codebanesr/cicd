import * as aws from "@pulumi/aws";

const ssmRole = new aws.iam.Role("ssmRole", {
    assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal(
        aws.iam.Principals.SsmPrincipal
    ),
});

new aws.iam.RolePolicyAttachment("rpa-ssmrole-ssminstancecore", {
    policyArn: aws.iam.ManagedPolicy.AmazonSSMManagedInstanceCore,
    role: ssmRole,
});

new aws.iam.RolePolicyAttachment("rpa-ssmrole-ec2containerservice", {
    policyArn: aws.iam.ManagedPolicy.AmazonEC2ContainerServiceforEC2Role,
    role: ssmRole,
});



export { ssmRole };