import { createContext, useState } from "react";

export let ListContext = createContext(null);

function ListContextProvider(props) {
  const [itemList, setItemList] = useState([]);

  return (
    <ListContext.Provider value={{itemList,  setItemList }}>
      {props.children}
    </ListContext.Provider>
  );
}

export default ListContextProvider;
