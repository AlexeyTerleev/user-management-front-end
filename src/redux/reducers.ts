// redux/reducers.ts
import { UserData } from '../types/UserTypes';
import { ActionTypes, SET_USER, SET_PAGE_STATE } from './actions';

export interface AppState {
  user: UserData | undefined;
  pageState: string;
}

const initialState: AppState = {
  user: undefined,
  pageState: 'get',
};

const rootReducer = (state = initialState, action: ActionTypes): AppState => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case SET_PAGE_STATE:
      return { ...state, pageState: action.payload };
    default:
      return state;
  }
};

export default rootReducer;
