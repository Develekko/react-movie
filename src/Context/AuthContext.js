import { createContext, useState } from "react";

export let AuthContext = createContext(null);

function AuthContextProvider(props) {
  const [userData, setUserData] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  return (
    <AuthContext.Provider value={{ userData, setUserData ,userProfile,setUserProfile}}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
