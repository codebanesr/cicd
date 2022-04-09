import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";


interface executeEcsCommandsInterface {
    ssmActivation: aws.ssm.Activation, 
    cluster: aws.ecs.Cluster,
    awsRegion: string | undefined
}

const executeEcsCommands = ({ ssmActivation, cluster, awsRegion }: executeEcsCommandsInterface) => {
    const userData = pulumi
        .all([ssmActivation.activationCode, ssmActivation.id, cluster.name])
        .apply(([activationCode, activationId, clusterName]) => `#!/bin/bash
            # Download the ecs-anywhere install Script
            curl -o "ecs-anywhere-install.sh" "https://amazon-ecs-agent.s3.amazonaws.com/ecs-anywhere-install-latest.sh" && sudo chmod +x ecs-anywhere-install.sh

            # (Optional) Check integrity of the shell script
            curl -o "ecs-anywhere-install.sh.sha256" "https://amazon-ecs-agent.s3.amazonaws.com/ecs-anywhere-install-latest.sh.sha256" && sha256sum -c ecs-anywhere-install.sh.sha256

            # Run the install script
            sudo ./ecs-anywhere-install.sh \
                --cluster ${clusterName} \
                --activation-id ${activationId} \
                --activation-code ${activationCode} \
                --region ${awsRegion}
            `
        );
}


export { executeEcsCommands };