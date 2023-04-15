pipeline {
  agent any
  stages {
    stage('Ckeckout Code') {
      steps {
        git(url: 'https://github.com/mauriwt/jenkins-project', branch: 'main')
      }
    }

    stage('Test Build') {
      steps {
        sh 'npm install && npm run build'
      }
    }

  }
}