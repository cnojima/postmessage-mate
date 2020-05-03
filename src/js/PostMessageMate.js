import React from 'react';
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import FlowChart from 'components/FlowChart';
import configureStore from './store'

/*******************************************************************************
 ****   React, Redux entry point - window.location.path must match a route  ****
 *******************************************************************************/
const root = document.getElementById("root");

if (root) {
  ReactDOM.render(
    <Provider store={configureStore({})}>
      <FlowChart />
    </Provider>, root
  );
}
