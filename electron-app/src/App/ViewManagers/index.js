import GridView from "./Grid";

export const ViewTypes = {
  GRID: "grid",
  LIST: "list",
  PREVIEW: "preview",
};

const ViewTypeToComponentMap = {
  [ViewTypes.GRID]: GridView,
};

export function getViewFromType(viewType) {
  return ViewTypeToComponentMap[viewType] || GridView;
}

export { GridView };
