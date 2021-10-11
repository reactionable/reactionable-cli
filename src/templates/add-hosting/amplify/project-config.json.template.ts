export default `{
    "projectName": <%= it.projectName %>,
    "frontend": "javascript",
    "javascript": {
        "framework": "react",
        "config": {
            "SourceDir": "src",
            "DistributionDir": "build",
            "BuildCommand": "<%= it.packageManager %> build",
            "StartCommand": "<%= it.packageManager %> start"
        }
    },
    "providers": [
        "awscloudformation"
    ]
}`;
