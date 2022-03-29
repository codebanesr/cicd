import * as aws from "@pulumi/aws";

const size = "t3.small";
const ami = aws.ec2.getAmiOutput({
    filters: [{
        name: "name", // AMI name
        values: ["amzn-ami-hvm-*"], //Amazon Linux 2 AMI (HVM) - Kernel 5.10, SSD Volume Type
    }],
    owners: ["137112412989"], // This owner ID is Amazon
    mostRecent: true,
});

const group = new aws.ec2.SecurityGroup("webserver-secgrp", {
    ingress: [
        { protocol: "tcp", fromPort: 22, toPort: 22, cidrBlocks: ["0.0.0.0/0"] },
    ],
});


// Generate your own keypair using ssh-keygen
const deployer = new aws.ec2.KeyPair("pulumi_ec2_keypair", {
    publicKey: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDHk7i5DgD6q+u/ErdoSMf4tJh/mH/r15M55/WsWz+VGdQAuQ4CNnQOKfIgfaNG7qyiA+oXD2zMyZNVjjykYfzIL9fVd5zmlfQGCks4MvCUdYGavdCzuqd2I1Z9cWz4XYMXTLzhT0C7J4po3M5rYttFEFPNYEItCSksHtlDt0wqAwWo9IYmWmb4yA9GtdwgXAQOxRj/QhTySNp5QZzn+xa+KXM3mSxEsazp2g5xWHkyqSBuBWNyQFIfsPAkCQfR3mAXc7nUw9ijegpLeq0Zjq35kqtQIouKoaf14b0lJe4JY1FzXIOruAKDiZRXonvV4Wlm/hWsFFbj+iGo1ydiHqt60PQGWO3Kn+k0HlIWT92MxAxvLr10QbOBdxvOxGb0vMWx+/WsbX3QRep9HvWpTvqM/iQYpFZZvD99gbFcOPE9XO3ONPCuwMgp2rQNmFwW9c3uM311+buLHlT1t6MapYzNGr8gSCdvED9n0ZbWokEFJWn01jvFdlsFnGPb9WBXiTU= shanurrahman@pop-os",
});

const server = new aws.ec2.Instance("webserver-www", {
    instanceType: size,
    vpcSecurityGroupIds: [group.id], // reference the security group resource above
    ami: ami.id,
    keyName: deployer.keyName,
    tags: {
        Name: "DemoInstance",
    },
});

export const publicIp = server.publicIp;
export const publicHostName = server.publicDns;
export const keyName = deployer.keyName;

// ssh -i <Path to pulumi_ec2_keypair> ec2-user@publicIp
// ssh -i "~/.ssh/ec2s/pulumi_ec2_keypair" ec2-user@ec2-65-2-55-206.ap-south-1.compute.amazonaws.com

