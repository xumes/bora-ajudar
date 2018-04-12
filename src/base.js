import Rebase from 're-base'
import firebase from 'firebase'

const config = {
    apiKey: 'AIzaSyDl_ewqCVnwyDN2OOqz9nl2zptvf9jAQwg',
    authDomain: 'bora-ajudar-xumes.firebaseapp.com',
    databaseURL: 'https://bora-ajudar-xumes.firebaseio.com',
    projectId: 'bora-ajudar-xumes',
    storageBucket: '',
    messagingSenderId: '307460042854'
  }
  const app = firebase.initializeApp(config)
  const base = Rebase.createClass(app.database())

export const auth = firebase.auth()
export default base