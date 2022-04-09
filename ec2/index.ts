import * as aws from "@pulumi/aws";

const size = "t3.medium";

const group = new aws.ec2.SecurityGroup("webserver-secgrp", {
    ingress: [
        { protocol: "tcp", fromPort: 22, toPort: 22, cidrBlocks: ["0.0.0.0/0"] },
        { protocol: "tcp", fromPort: 5900, toPort: 5900, cidrBlocks: ["0.0.0.0/0"] },
        { protocol: "tcp", fromPort: 3389, toPort: 3389, cidrBlocks: ["0.0.0.0/0"] },
    ],
    egress: [{
        fromPort: 0,
        toPort: 0,
        protocol: "-1",
        cidrBlocks: ["0.0.0.0/0"],
        ipv6CidrBlocks: ["::/0"],
    }],
});

// Generate your own keypair using ssh-keygen
const deployer = new aws.ec2.KeyPair("pulumi_ec2_keypair", {
    publicKey: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDHk7i5DgD6q+u/ErdoSMf4tJh/mH/r15M55/WsWz+VGdQAuQ4CNnQOKfIgfaNG7qyiA+oXD2zMyZNVjjykYfzIL9fVd5zmlfQGCks4MvCUdYGavdCzuqd2I1Z9cWz4XYMXTLzhT0C7J4po3M5rYttFEFPNYEItCSksHtlDt0wqAwWo9IYmWmb4yA9GtdwgXAQOxRj/QhTySNp5QZzn+xa+KXM3mSxEsazp2g5xWHkyqSBuBWNyQFIfsPAkCQfR3mAXc7nUw9ijegpLeq0Zjq35kqtQIouKoaf14b0lJe4JY1FzXIOruAKDiZRXonvV4Wlm/hWsFFbj+iGo1ydiHqt60PQGWO3Kn+k0HlIWT92MxAxvLr10QbOBdxvOxGb0vMWx+/WsbX3QRep9HvWpTvqM/iQYpFZZvD99gbFcOPE9XO3ONPCuwMgp2rQNmFwW9c3uM311+buLHlT1t6MapYzNGr8gSCdvED9n0ZbWokEFJWn01jvFdlsFnGPb9WBXiTU= shanurrahman@pop-os",
});

const server = new aws.ec2.Instance("ubuntu_remote_pc", {
    instanceType: size,
    vpcSecurityGroupIds: [group.id], // reference the security group resource above
    ami: "ami-0851b76e8b1bce90b",
    keyName: deployer.keyName,
    tags: {
        Name: "Development Environment",
    },
    ebsBlockDevices: [{
        deviceName: "/dev/sdg",
        volumeSize: 30,
        deleteOnTermination: true
    }],
    userData: `
        # update the system
        sudo apt update &&  sudo apt upgrade

        # installing curl
        sudo apt install curl

        # install nvm and node
        curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash 
        source ~/.bashrc
        source ~/.profile
        nvm install 14
        nvm use 14

        sudo sed -i 's/^PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config
        sudo /etc/init.d/ssh restart
        sudo passwd ubuntu
        # enter password here


        sudo apt install xrdp xfce4 xfce4-goodies tightvncserver

        echo xfce4-session > /home/ubuntu/.xsession

        sudo cp /home/ubuntu/.xsession /etc/skel

        sudo sed -i '0,/-1/s//ask-1/' /etc/xrdp/xrdp.ini

        sudo service xrdp restart
    `
});

export const publicIp = server.publicIp;
export const publicHostName = server.publicDns;
export const keyName = deployer.keyName;

// ssh -i <Path to pulumi_ec2_keypair> ec2-user@publicIp
// ssh -i "~/.ssh/ec2s/pulumi_ec2_keypair" ec2-user@ec2-65-2-55-206.ap-south-1.compute.amazonaws.com

// ^^ use username as ubuntu for ubuntu machine

