import {all, call, delay, fork, put, select, take, takeEvery} from "redux-saga/effects";
import {
  auth,
  facebookAuthProvider,
  githubAuthProvider,
  googleAuthProvider,
  twitterAuthProvider
} from "../../firebase/firebase";
import {
  SIGNIN_FACEBOOK_USER,
  SIGNIN_GITHUB_USER,
  SIGNIN_GOOGLE_USER,
  SIGNIN_TWITTER_USER,
  SIGNIN_USER,
  SIGNOUT_USER,
  SIGNUP_USER,
  REFRESH_TOKEN,
  REFRESH_TOKEN_SUCCESS,
  REFRESH_TOKEN_FAILURE,
} from "constants/ActionTypes";
import {showAuthMessage, userSignInSuccess, userSignOutSuccess, userSignUpSuccess} from "../../appRedux/actions/Auth";
import {
  userFacebookSignInSuccess,
  userGithubSignInSuccess,
  userGoogleSignInSuccess,
  userTwitterSignInSuccess
} from "../actions/Auth";
const baseUrl = process.env.REACT_APP_BASE_URL; 

const createUserWithEmailPasswordRequest = async (email, password) =>
  await  auth.createUserWithEmailAndPassword(email, password)
    .then(authUser => authUser)
    .catch(error => error);

const signInUserWithEmailPasswordRequest = async (email, password) =>
  await  auth.signInWithEmailAndPassword(email, password)
    .then(authUser => authUser)
    .catch(error => error);

const signOutRequest = async () =>
  await  auth.signOut()
    .then(authUser => authUser)
    .catch(error => error);


const signInUserWithGoogleRequest = async () =>
  await  auth.signInWithPopup(googleAuthProvider)
    .then(authUser => authUser)
    .catch(error => error);

const signInUserWithFacebookRequest = async () =>
  await  auth.signInWithPopup(facebookAuthProvider)
    .then(authUser => authUser)
    .catch(error => error);

const signInUserWithGithubRequest = async () =>
  await  auth.signInWithPopup(githubAuthProvider)
    .then(authUser => authUser)
    .catch(error => error);

const signInUserWithTwitterRequest = async () =>
  await  auth.signInWithPopup(twitterAuthProvider)
    .then(authUser => authUser)
    .catch(error => error);

function* createUserWithEmailPassword({payload}) {
  const { email, password, userName } = payload;
  const body = {
    email,
    password,
    userName
  }
  try {
    const signUpUser = yield fetch(`${baseUrl}api/user/signup`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
  });
   
    if (signUpUser.status === 200) {
      const signedUpUser = yield signUpUser.json();
      localStorage.setItem('user_id', signedUpUser.userId);
      localStorage.setItem("userName",signedUpUser.userName)
      yield put(userSignUpSuccess(signedUpUser.userName));
    } else {
      yield put(showAuthMessage("Failed to Sign up"));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

function* signInUserWithGoogle() {
  try {
    const signUpUser = yield call(signInUserWithGoogleRequest);
    if (signUpUser.message) {
      yield put(showAuthMessage(signUpUser.message));
    } else {
      localStorage.setItem('user_id', signUpUser.user.uid);
      yield put(userGoogleSignInSuccess(signUpUser.user.uid));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}


function* signInUserWithFacebook() {
  try {
    const signUpUser = yield call(signInUserWithFacebookRequest);
    if (signUpUser.message) {
      yield put(showAuthMessage(signUpUser.message));
    } else {
      localStorage.setItem('user_id', signUpUser.user.uid);
      yield put(userFacebookSignInSuccess(signUpUser.user.uid));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}


function* signInUserWithGithub() {
  try {
    const signUpUser = yield call(signInUserWithGithubRequest);
    if (signUpUser.message) {
      yield put(showAuthMessage(signUpUser.message));
    } else {
      localStorage.setItem('user_id', signUpUser.user.uid);
      yield put(userGithubSignInSuccess(signUpUser.user.uid));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}


function* signInUserWithTwitter() {
  try {
    const signUpUser = yield call(signInUserWithTwitterRequest);
    if (signUpUser.message) {
      if (signUpUser.message.length > 100) {
        yield put(showAuthMessage('Your request has been canceled.'));
      } else {
        yield put(showAuthMessage(signUpUser.message));
      }
    } else {
      localStorage.setItem('user_id', signUpUser.user.uid);
      yield put(userTwitterSignInSuccess(signUpUser.user.uid));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

function* signInUserWithEmailPassword({payload}) {
  const {email, password} = payload;
  const jsonPayload ={
    "userName":email,
    "password":password
  }
  try {
    const signInUser = yield fetch(`${baseUrl}api/login`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jsonPayload)
  });
    if (signInUser.status ===200) {
      const signeduser = yield signInUser.json()
      yield put(userSignInSuccess(signeduser.userName, signeduser.expires_in, signeduser.lastLoginTime, signeduser.access_token)); 
      localStorage.setItem("userToken",signeduser.access_token)
      localStorage.setItem("userName",signeduser.userName)
      localStorage.setItem("userId",signeduser.userId)
      localStorage.setItem("Menus",JSON.stringify(signeduser.menusList))
      localStorage.setItem("refreshToken", signeduser.refresh_token);
      localStorage.setItem("expiresIn", Date.now() + Number(signeduser.expires_in) * 1000);
    } else {
      yield put(showAuthMessage("Failed to Login"));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

const delay1 = (ms) => new Promise(resolve => setTimeout(resolve, ms));
function* refreshTokenSaga() {
  yield call(delay1, 1000);
     try {
      const data = new URLSearchParams();
      data.append('grant_type', 'refresh_token');
      data.append('refresh_token', `${localStorage.getItem('refreshToken')}`);

        const response = yield fetch(`${baseUrl}api/oauth/token`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic UjJkcHhRM3ZQcnRmZ0Y3MjpmRHc3TXBrazVjekhOdVNSdG1oR21BR0w0MkNheFFCOQ=='
        },
        body:data 
      });
  
      if (response.status === 200) {
        const refreshedTokens = yield response.json();
        localStorage.setItem('userToken', refreshedTokens.access_token);
        localStorage.setItem('refreshToken', refreshedTokens.refresh_token);
        localStorage.setItem("expiresIn", Date.now() + Number(refreshedTokens.expires_in) * 1000);
        // yield put({ type: REFRESH_TOKEN_SUCCESS, payload: refreshedTokens.access_token });
      } 
    } catch (error) {
      console.error('Error during token refresh:', error);
      yield put({ type: REFRESH_TOKEN_FAILURE });
      yield put (userSignOutSuccess());
    }
  }

function* signOut() {
  try {
    const signOutUser = yield call(signOutRequest);
    if (signOutUser === undefined) {
      localStorage.removeItem('user_id');
      localStorage.removeItem('userToken');
      localStorage.removeItem('userName');
      localStorage.removeItem('expiresIn');
      localStorage.removeItem('refreshToken');
      yield put(userSignOutSuccess(signOutUser));
    } else {
      yield put(showAuthMessage(signOutUser.message));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

export function* createUserAccount() {
  yield takeEvery(SIGNUP_USER, createUserWithEmailPassword);
}

export function* signInWithGoogle() {
  yield takeEvery(SIGNIN_GOOGLE_USER, signInUserWithGoogle);
}

export function* signInWithFacebook() {
  yield takeEvery(SIGNIN_FACEBOOK_USER, signInUserWithFacebook);
}

export function* signInWithTwitter() {
  yield takeEvery(SIGNIN_TWITTER_USER, signInUserWithTwitter);
}

export function* signInWithGithub() {
  yield takeEvery(SIGNIN_GITHUB_USER, signInUserWithGithub);
}

export function* signInUser() {
  yield takeEvery(SIGNIN_USER, signInUserWithEmailPassword);
}

export function* signOutUser() {
  yield takeEvery(SIGNOUT_USER, signOut);
}
function* watchRefreshToken() {
  yield takeEvery(REFRESH_TOKEN, refreshTokenSaga);
}


export default function* rootSaga() {
  yield all([fork(signInUser),
    fork(createUserAccount),
    fork(signInWithGoogle),
    fork(signInWithFacebook),
    fork(signInWithTwitter),
    fork(signInWithGithub),
    fork(signOutUser),
    fork(watchRefreshToken)]);
}
