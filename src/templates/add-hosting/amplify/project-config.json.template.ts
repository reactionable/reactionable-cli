export default `{
    "projectName": {{{projectName}}},
    "frontend": "javascript",
    "javascript": {
        "framework": "react",
        "config": {
            "SourceDir": "src",
            "DistributionDir": "build",
            "BuildCommand": "{{packageManager}} build",
            "StartCommand": "{{packageManager}} start"
        }
    },
    "providers": [
        "awscloudformation"
    ]
}`;
