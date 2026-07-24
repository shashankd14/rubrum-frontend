import {all, call, fork, put, takeEvery} from "redux-saga/effects";
import {
  SIGNIN_USER,
  SIGNOUT_USER,
  REFRESH_TOKEN,
  REFRESH_TOKEN_FAILURE,
} from "constants/ActionTypes";
import {showAuthMessage, userSignInSuccess, userSignOutSuccess, userSignUpSuccess} from "../../appRedux/actions/Auth";
import { GET_IP_ADDRESS_REQUEST } from "../../constants/ActionTypes";
const baseUrl = process.env.REACT_APP_BASE_URL; 

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
function* signInUserWithEmailPassword({ payload }) {
  const { email, password } = payload;
  const jsonPayload = {
    userName: email,
    password: password,
  };
  try {
    const signInUser = yield fetch(`${baseUrl}api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jsonPayload),
    });
    if (signInUser.status === 200) {
      const signeduser = yield signInUser.json();
      yield put(
        userSignInSuccess(
          signeduser.userName,
          signeduser.expires_in,
          signeduser.lastLoginTime,
          signeduser.access_token
        )
      );
      localStorage.setItem("userToken", signeduser.access_token);
      localStorage.setItem("userName", signeduser.userName);
      localStorage.setItem("userId", signeduser.userId);
      localStorage.setItem("Menus", JSON.stringify(signeduser.menusList));
      localStorage.setItem("refreshToken", signeduser.refresh_token);
      localStorage.setItem(
        "expiresIn",
        Date.now() + Number(signeduser.expires_in) * 1000
      );
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

  
function* getIPAddress1() {
      try {

          const response = yield fetch(`https://api.ipify.org/?format=json`, {
          method: 'GET'
        });
    
        if (response.status === 200) {
          const ipAddress = yield response.json();
          localStorage.setItem('ipAddress', ipAddress.ip);
        
        } 
      } catch (error) {
        console.error('Error during fetching IP Address:', error);
      }
    }

function* signOut() {
  try {
      localStorage.removeItem('user_id');
      localStorage.removeItem('userToken');
      localStorage.removeItem('userName');
      localStorage.removeItem('expiresIn');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('ipAddress');
      yield put(userSignOutSuccess(signOutUser));
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}
export function* signInUser() {
  yield takeEvery(SIGNIN_USER, signInUserWithEmailPassword);
}
export function* signOutUser() {
  yield takeEvery(SIGNOUT_USER, signOut);
}
export function* getIPAddress() {
  yield takeEvery(GET_IP_ADDRESS_REQUEST, getIPAddress1);
}
function* watchRefreshToken() {
  yield takeEvery(REFRESH_TOKEN, refreshTokenSaga);
}


export default function* rootSaga() {
  yield all([fork(signInUser),
    fork(signOutUser),
    fork(watchRefreshToken),
    fork(getIPAddress)]);
}
