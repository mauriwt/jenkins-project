pipeline {
  agent any
  stages {
    stage('Ckeckout Code') {
      parallel {
        stage('Ckeckout Code') {
          steps {
            git(url: 'https://github.com/mauriwt/jenkins-project', branch: 'main')
          }
        }

        stage('Directorio') {
          steps {
            sh '$BUILD_NUMBER'
          }
        }

      }
    }

    stage('Docker Build') {
      steps {
        sh 'docker build -f Dockerfile . '
      }
    }

    stage('Login to DocketHub') {
      environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerCredential')
      }
      steps {
        sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
      }
    }

  }
}