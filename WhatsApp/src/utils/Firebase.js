const firebase = require('firebase')
require('firebase/firestore')

export class Firebase {

  constructor(){
    this._config = {
      apiKey: "AIzaSyB4Kt9cJAx6BX0lbBrPQP-kfCKL1dJeT2I",
      authDomain: "wpp-clone-29c8a.firebaseapp.com",
      projectId: "wpp-clone-29c8a",
      storageBucket: "wpp-clone-29c8a.appspot.com",
      messagingSenderId: "316129945154",
      appId: "1:316129945154:web:19d235627d994660c46fdb"
    };
    this.init()
  }

  init(){

      if(!window.initializedFirebase){
        firebase.initializeApp(this._config)
        firebase.firestore().settings({})
        window.initializedFirebase= true
      }
  }

  static db(){
    return firebase.firestore()
  }

  static hd(){
    return firebase.storage()
  }

  initAuth(){

    return new Promise((s,f)=>{
      let provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithPopup(provider)
      .then(result => {
        let token = result.credential.accessToken
        let user = result.user
        s({user, token})
      }).catch(err => {f(err)})
    })

  }

}