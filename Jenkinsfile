pipeline
{
    options
    {
        buildDiscarder(logRotator(numToKeepStr: '3'))
    }
    agent any
    environment 
    {
        VERSION = 'latest'
        PROJECT1 = 'payvoo/web'
        PROJECT2 = 'payvoo/service'
        ECRURL = 'https://995966766395.dkr.ecr.us-west-2.amazonaws.com'
        ECRCRED = 'ecr:us-west-2:access_id'
    }
    stages
    {
        stage('Cloning Git') {
            steps {
           git credentialsId: 'f8758d06-5bf8-4572-9b9f-e7998e9adba2', url: 'https://github.com/sharathjadala/payweb.git'
            }
        }
        stage('Build preparations')
        {
            steps
            {
                script 
                {
                    // calculate GIT lastest commit short-hash
                    gitCommitHash = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
                    shortCommitHash = gitCommitHash.take(7)
                    // calculate a sample version tag
                    VERSION = shortCommitHash
                    env.TAG = shortCommitHash
                    // set the build display name
                    currentBuild.displayName = "#${BUILD_ID}-${VERSION}"
                    IMAGEA = "$PROJECT1:$VERSION"
                    IMAGEB = "$PROJECT2:$VERSION"
                    echo "$IMAGEA"
                    echo "$IMAGEB"
                    echo "${env.TAG}"

                }               
            }
        }
        stage('Docker build Web')
        {
            steps
            {
                script
                {
                    // Build the docker image using a Dockerfile for Web
                    sh '''
                    cd ./sources/Web
                    npm cache clean --force
                    npm install
                    npm run build
                   
                    
                    '''
                    docker.build("$IMAGEA","./sources/Web")
                }
            }
        }
        stage('Docker push Web image')
        {
            steps
            {
                script
                {
                    // login to ECR - for now it seems that that the ECR Jenkins plugin is not performing the login as expected. I hope it will in the future.
                    sh '''
                    eval $(aws ecr get-login --no-include-email --profile myprofilename | sed 's|https://||')
                    '''
                    // Push the Docker image to ECR
                    docker.withRegistry(ECRURL, ECRCRED)
                    {
                      docker.image(IMAGEA).push('latest')
                      docker.image(IMAGEA).push()
                    }

                }
            }
        }
        stage('Docker build Service')
        {
            steps
            {
                script
                {
                    docker.build("$IMAGEB","./sources/services")
                }
            }
        }
        stage('Docker push Service image')
        {
            steps
            {
                script
                {
                    // login to ECR - for now it seems that that the ECR Jenkins plugin is not performing the login as expected. I hope it will in the future.
                    sh '''
                    eval $(aws ecr get-login --no-include-email --profile myprofilename | sed 's|https://||')
                    '''
                    // Push the Docker image to ECR
                    docker.withRegistry(ECRURL, ECRCRED)
                    {
                      docker.image(IMAGEB).push('latest')
                      docker.image(IMAGEB).push()
                    }

                }
            }
        }
        stage('k8s deployment')
        {
            steps{
                script{
                    sh '''
                    /var/lib/jenkins/bin/kubectl get pods
                    sed -i "s|latest|${TAG}|g" k8s/frontend-deployment.yml
                    sed -i "s|latest|${TAG}|g" k8s/backend-deployment.yml
                    ''' 
                    sh '''
                    /var/lib/jenkins/bin/kubectl apply -f k8s/backend-deployment.yml
                    /var/lib/jenkins/bin/kubectl apply -f k8s/frontend-deployment.yml
                    /var/lib/jenkins/bin/kubectl get pods
                    '''
                }
            }
        }        
    }

    post
    {
        always
        {
            // make sure that the Docker image is removed

            sh "docker rmi $IMAGEA | true"
            sh "docker rmi $IMAGEB | true"
        }
    }
}
