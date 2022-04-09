import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

import { ssmRole } from "./iam/sytemManagerRole";
import { executeEcsCommands } from "./executable";
const awsConfig = new pulumi.Config("aws");
const awsRegion = awsConfig.get("region");


const projectConfig = new pulumi.Config();
const numberNodes = projectConfig.getNumber("numberNodes") || 2;


const ssmActivation = new aws.ssm.Activation("ecsanywhere-ssmactivation", {
    iamRole: ssmRole.name,
    registrationLimit: numberNodes,
});

const cluster = new aws.ecs.Cluster("cluster");

export const clusterName = cluster.name;

const logGroup = new aws.cloudwatch.LogGroup("logGroup");

executeEcsCommands({ ssmActivation, cluster, awsRegion });