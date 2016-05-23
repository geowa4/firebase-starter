;(function (firebase, Rx, d3) {
// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyB1upNjHiW39DPaYXBlMiPdVV0sr4v5lOk",
  authDomain: "presentation-sample.firebaseapp.com",
  databaseURL: "https://presentation-sample.firebaseio.com",
  storageBucket: "",
})

const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
const databaseRef = firebase.database().ref()

function login () {
  return Rx.Observable.fromPromize(
    firebase.auth().signInWithPopup(googleAuthProvider)
  )
}

function renderAnonymousState () {
  d3.select('body')
    .classed('anonymous', true)
    .classed('authenticated', false)
  d3.select('.username').html('&nbsp;')
}

function renderAuthenticatedState (user) {
  d3.select('body')
    .classed('anonymous', false)
    .classed('authenticated', true)
  d3.select('.username').text(user.displayName)
}

function showAbleToSubmitState () {
  d3.select('.submission-state')
    .classed('unsubmitted', true)
}

function showSuccessfulSubmissionState () {
  d3.select('.submission-state')
    .classed('unsubmitted', false)
    .classed('success', true)
}

function showCapacityErrorState () {
  d3.select('.submission-state')
    .classed('unsubmitted', false)
    .classed('capacity', true)
}

Rx.Observable
  .fromEvent(document, 'click')
  .filter((evt) => {
    return evt.target.className.indexOf('login-button') != -1
  })
  .flatMap(login)
  .subscribe((result) => {
    console.log(result)
  })

Rx.Observable
  .create((subscriber) => {
    firebase.auth().onAuthStateChanged(user => {
      subscriber.next(user)
    })
  })
  .subscribe((user) => {
    if (user == null) {
      renderAnonymousState()
    }
    else {
      renderAuthenticatedState(user)
    }
  })

Rx.Observable
  .fromEvent(document.getElementById('entry-form'), 'submit')
  .do((evt) => {
    // `do` is conventionally where side effects go
    evt.preventDefault()
  })
  .map((evt) => {
    return { 'field1': document.getElementById('field1').value }
  })
  .flatMap((formData) => {
    // transactionally increment counter
    return databaseRef
      .child('counter')
      .transaction((counter) => {
        if (counter == null) {
          return 1
        }
        else {
          return counter + 1
        }
      })
      .then((/* result */) => {
        return formData
      })
  })
  .flatMap((formData) => {
    // push new entry with counter
    // return Rx.Observable.of(formData)
    return databaseRef.child('entries').push().set(formData)
  })
  .subscribe(() => {
    showSuccessfulSubmissionState()
  },
  () => {
    showCapacityErrorState()
  })

databaseRef
  .child('counter')
  .once('value')
  .then((snapshot) => {
    if (snapshot.val() >= 5) {
      showCapacityErrorState()
    }
    else {
      showAbleToSubmitState()
    }
  })

}(window.firebase, window.Rx, window.d3));
