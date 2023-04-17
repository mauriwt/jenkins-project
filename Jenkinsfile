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
            sh 'ls -la'
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
        DOCKERHUB_USER = 'mtituana'
        DOCKERHUB_PASSWORD = 'wtitu@na.o4$4'
      }
      steps {
        sh 'docker login -u $DOCKERHUB_USER -p DOCKERHUB_PASSWORD'
      }
    }

  }
}