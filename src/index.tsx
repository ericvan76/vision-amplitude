import { AppLoading } from 'expo';
import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { updateChartList } from './actions/chart';
import { updateQueryList } from './actions/query';
import { Main } from './components/Main';
import { CHART_DEFINITIONS, QUERY_DEFINITIONS } from './config';
import * as reducers from './reducers';
import { INITIAL_STATE } from './reducers/initialState';
import { rootSaga } from './sagas';

const sagaMiddleware = createSagaMiddleware();
const rootReducer = combineReducers(reducers);

const store = createStore(
  rootReducer,
  INITIAL_STATE,
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

// load queries and charts
store.dispatch(updateQueryList(QUERY_DEFINITIONS));
store.dispatch(updateChartList(CHART_DEFINITIONS));

interface Props { }

interface State {
  isReady: boolean;
}
export class App extends React.PureComponent<Props, State> {

  public state: State = {
    isReady: false
  };
  public render(): JSX.Element {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this.cacheResourcesAsync}
          onFinish={this.finishLoading}
          onError={console.warn}
        />
      );
    }
    return (
      <Provider store={store}>
        <Main />
      </Provider>
    );
  }
  private readonly finishLoading = () => {
    this.setState((state: State) => {
      return {
        ...state,
        isReady: true
      };
    });
  }

  private readonly cacheResourcesAsync = async () => {
    // tslint:disable:no-require-imports no-floating-promises

    // tslint:enable:no-require-imports no-floating-promises
  }
}
