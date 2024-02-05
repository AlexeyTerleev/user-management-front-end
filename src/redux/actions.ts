// redux/actions.ts
import { UserData } from '../types/UserTypes';

export const SET_USER = 'SET_USER';
export const SET_PAGE_STATE = 'SET_PAGE_STATE';

export interface SetUserAction {
  type: typeof SET_USER;
  payload: UserData;
}

export interface SetPageStateAction {
  type: typeof SET_PAGE_STATE;
  payload: string;
}

export type ActionTypes = SetUserAction | SetPageStateAction;

export const setUser = (user: UserData | undefined) => ({
  type: SET_USER,
  payload: user,
});

export const setPageState = (pageState: string) => ({
  type: SET_PAGE_STATE,
  payload: pageState,
});