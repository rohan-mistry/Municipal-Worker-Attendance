import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { IsLogin } from './CheckLogin';

const SignInRoute = ({ component: Component, ...rest }) => {

  const role = localStorage.getItem('role') || sessionStorage.getItem('role');
  
  return (
    <Route
      {...rest}
      render={(props) => {
        if (
          !IsLogin()
        ) {
          return <Component {...props} />;
        } else {
          if(role === 'admin')
            return (
              <Redirect
                to={{
                  pathname: '/admin',
                }}
              />
            );
          else if (role === 'worker')
            return (
              <Redirect
                to={{
                  pathname: '/worker',
                }}
              />
            );   
        }
      }}
    />
  );
};

export default SignInRoute;