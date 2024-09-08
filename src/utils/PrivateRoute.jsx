import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import ReaderContext from "./ReaderContext";

const PrivateRoute = ({ element }) => {
  let { authTokens } = useContext(ReaderContext);

  return authTokens ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
