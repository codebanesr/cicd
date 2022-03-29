## Generating ssh keys [https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent]
Open Terminal.
    `mkdir -p ~/.ssh/ec2s && cd ~/.ssh/ec2s`
    `ssh-keygen -t ed25519 -C "your_email@example.com"`
        > Note: If you are using a legacy system that doesn't support the Ed25519 algorithm, use:
        >$ ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
    
    Provide a ${filename} when prompted *
    `eval "$(ssh-agent -s)"`

    `ssh-add ~/.ssh/${filename}`



## Refer api docs for ec2 pulumi here
https://www.pulumi.com/registry/packages/aws/api-docs/ec2/instance/



## Another approach for deploying ec2 instance here
```ts
import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const ubuntu = aws.ec2.getAmi({
    mostRecent: true,
    filters: [
        {
            name: "name",
            values: ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"],
        },
        {
            name: "virtualization-type",
            values: ["hvm"],
        },
    ],
    owners: ["099720109477"],
});
const web = new aws.ec2.Instance("web", {
    ami: ubuntu.then(ubuntu => ubuntu.id),
    instanceType: "t3.micro",
    tags: {
        Name: "HelloWorld",
    },
});

