import { useHistory, useLocation } from "react-router-dom";
import { QueryVariables, QueryVariablesEnum } from "../interfaces/QueryVariables";

interface ReturnObject extends QueryVariables {
  setUrlQueryVariables: (variableName: QueryVariablesEnum, variableValue: string) => void;
  deleteUrlQueryVariables: (variableName: QueryVariablesEnum) => void;
}

export default function useManageUrlQueryVariables(): ReturnObject {
  const location = useLocation();
  const history = useHistory();

  const variables = new URLSearchParams(location.search);
  const restaurantId = variables.get(QueryVariablesEnum.RESTAURANTID);
  const orderId = variables.get(QueryVariablesEnum.ORDERID);

  const setUrlQueryVariables = (
    variableName: QueryVariablesEnum,
    variableValue: string
  ): void => {
    const queryVariables = {
      restaurantId,
      orderId,
    };
    const oldQueryValue = queryVariables[variableName];
    if (oldQueryValue !== variableValue) {
      if (oldQueryValue) {
        const newSearchQuery = history.location.search.replace(
          `${variableName}=${oldQueryValue}`,
          `${variableName}=${variableValue}`
        );
        history.push({
          pathname: history.location.pathname,
          search: newSearchQuery,
        });
      } else if (variableValue && variableName) {
        const newSearchQuery = `${history.location.search}&${variableName}=${variableValue}`;
        history.push({
          pathname: history.location.pathname,
          search: newSearchQuery,
        });
      }
    }
  };

  const deleteUrlQueryVariables = (variableName: QueryVariablesEnum): void => {
    const queryVariables = {
      restaurantId,
      orderId,
    };
    const variableValue = queryVariables[variableName];
    if (variableValue) {
      const taskSearchQuery = `${variableName}=${variableValue}`;
      const searchQuery = decodeURI(history.location.search);
      let newSearchQuery: string;
      if (searchQuery.indexOf(`?${taskSearchQuery}&`) > -1) {
        newSearchQuery = searchQuery.replace(`?${taskSearchQuery}&`, "&");
      } else if (searchQuery.indexOf(`&${taskSearchQuery}&`) > -1) {
        newSearchQuery = searchQuery.replace(`?${taskSearchQuery}&`, "");
      } else {
        newSearchQuery = searchQuery.replace(`?${taskSearchQuery}`, "");
        newSearchQuery = searchQuery.replace(`&${taskSearchQuery}`, "");
      }

      history.push({
        pathname: history.location.pathname,
        search: newSearchQuery,
      });
    }
  };

  return {
    restaurantId: restaurantId || "",
    orderId: orderId || "",
    setUrlQueryVariables,
    deleteUrlQueryVariables,
  };
}
