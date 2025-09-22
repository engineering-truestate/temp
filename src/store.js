// store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import blogReducer from './slices/blogSlice';
import authReducer from './slices/authSlice';
import userAuthReducer from './slices/userAuthSlice';
import projectsReducer from './slices/projectSlice';
import userReducer from './slices/userSlice'; 
import agentReducer from './slices/agentSlice';
import taskReducer from './slices/taskSlice';
import wishlistReducer from './slices/wishlistSlice';
import compareReducer from './slices/compareSlice';
import requirementReducer from './slices/requirementSlice';
import vaultConfirmationReducer from './slices/vaultConfirmationSlice';
import pageTrackerReducer from './slices/pageTrackerSlice';
import modalReducer from './slices/modalSlice';
import loaderReducer from "./slices/loaderSlice";
import reportReducer from "./slices/reportSlice";



const rootReducer = combineReducers({
  blog: blogReducer,
  auth: authReducer,
  userAuth: userAuthReducer,
  projectsState: projectsReducer,
  user: userReducer,
  agent: agentReducer,
  tasks: taskReducer,
  wishlist: wishlistReducer,
  compare: compareReducer,
  requirement: requirementReducer,
  vaultConfirmation: vaultConfirmationReducer,
  pageTracker: pageTrackerReducer,
  modal: modalReducer,
  loader: loaderReducer,
  report: reportReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'userAuth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export default store;

