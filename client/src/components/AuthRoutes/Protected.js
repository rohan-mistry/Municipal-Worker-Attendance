import React from 'react';
import { Route, Redirect, useHistory } from 'react-router-dom';
import { url } from '../../config';
import { IsLogin } from './CheckLogin';

const Protected = ({ component: Component,access, ...rest }) => {
  const history = useHistory();

  const checkBlocked = async() => {

    const accId = localStorage.getItem("_id") || sessionStorage.getItem("_id");
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
				'x-auth-token': localStorage.getItem('token') || sessionStorage.getItem('token')
			}
    };
    const result = await fetch(`${url}/user/check/blocked/${accId}`,requestOptions);
    const data = await result.json();
    console.log(data);
    if(result.status !== 200) {
      console.log('wasted');
      sessionStorage.clear();
      localStorage.clear();
      history.push('/unauthorized');
      return;
    }
  }
  checkBlocked();
  console.log('after check');
  const role = localStorage.getItem('role') || sessionStorage.getItem('role');
  console.log(access);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (
          IsLogin() && role === access
        ) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: '/',
              }}
            />
          );
        }
      }}
    />
  );
};

export default Protected;