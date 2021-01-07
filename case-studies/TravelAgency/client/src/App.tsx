import React from 'react';
import './App.css';
import FriendView from './components/Friend/FriendView';
import CustomerView from './components/Customer/CustomerView';

import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";

enum Endpoint { Friend, Customer, };

type Context = {
  clearEndpoint: () => void,
};

export const Context = React.createContext<Context>({
  clearEndpoint: () => {},
});

const Provider: React.FunctionComponent<Context> = props => {
  return (
    <Context.Provider value={{
      clearEndpoint: props.clearEndpoint,
    }}>
      {props.children}
    </Context.Provider>
  );
}

function App() {

  const [endpoint, setEndpoint] = React.useState<Endpoint>();
  
  return (
    <Provider clearEndpoint={() => setEndpoint(undefined)}>
      <div className="App">
      <AppBar position='sticky'>
        <Toolbar>
          <Typography variant='h6'>
            {endpoint === undefined ? 'Travel Agency'
            : `Logged in as: ${endpoint === Endpoint.Friend ? 'Friend' : 'Customer'}`}
          </Typography>
        </Toolbar>
      </AppBar>

      <div style={{ marginTop: '2rem', }}>
      {endpoint === undefined &&
        <div>
          <Typography variant='h5'>Log In As</Typography>
          <div>
            <Button style={{
              marginLeft: '10px',
              marginRight: '10px',
            }}variant='contained' onClick={() => setEndpoint(Endpoint.Friend)}>Friend</Button>
            <Button style={{
              marginLeft: '10px',
              marginRight: '10px',
            }}variant='contained' onClick={() => setEndpoint(Endpoint.Customer)}>Customer</Button>
          </div>
        </div>}
      
      {endpoint === Endpoint.Friend &&
        <FriendView />}
      
      {endpoint === Endpoint.Customer &&
        <CustomerView />}
      </div>
      </div>
    </Provider>
  );
}

export default App;
