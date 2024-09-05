import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { createSnapList, getGuideFeature, IDS, snap } from "../utils";
const { doubleClickZoom } = MapboxDraw.lib;
const DirectSelect = MapboxDraw.modes.direct_select;
const Constants = MapboxDraw.constants;

interface DirectSelectMode extends MapboxDraw.DrawCustomMode {
  pathsToCoordinates: (featureId: string, paths: any) => any;
  dragVertex: (state: any, e: any, delta: any) => void;
}

const SnapDirectSelect = { ...(DirectSelect as DirectSelectMode) };

SnapDirectSelect.onSetup = function (opts) {
  const featureId = opts.featureId;
  const feature = this.getFeature(featureId);

  if (!feature) {
    throw new Error("You must provide a featureId to enter direct_select mode");
  }

  if (feature.type === Constants.geojsonTypes.POINT) {
    throw new TypeError("direct_select mode doesn't handle point features");
  }

  const [snapList, vertices] = createSnapList(
    this.map,
    (this as any)._ctx.api,
    feature,
    (this as any)._ctx.options.snapOptions.sources
  );

  const verticalGuide = this.newFeature(getGuideFeature(IDS.VERTICAL_GUIDE));
  const horizontalGuide = this.newFeature(
    getGuideFeature(IDS.HORIZONTAL_GUIDE)
  );

  this.addFeature(verticalGuide);
  this.addFeature(horizontalGuide);

  const state = {
    map: this.map,
    featureId,
    feature,
    dragMoveLocation: opts.startPos || null,
    dragMoving: false,
    canDragMove: false,
    selectedCoordPaths: opts.coordPath ? [opts.coordPath] : [],
    vertices,
    snapList,
    verticalGuide,
    horizontalGuide,
    options: {},
    optionsChangedCallBAck: (options: any) => {},
  };

  state.options = (this as any)._ctx.options;

  this.setSelectedCoordinates(
    this.pathsToCoordinates(featureId, state.selectedCoordPaths)
  );
  this.setSelected(featureId);
  doubleClickZoom.disable(this);

  this.setActionableState({
    trash: true,
    combineFeatures: false,
    uncombineFeatures: false,
  });

  const optionsChangedCallBAck = (options: any) => {
    state.options = options;
  };

  // for removing listener later on close
  state["optionsChangedCallBAck"] = optionsChangedCallBAck;
  this.map.on("draw.snap.options_changed", optionsChangedCallBAck);

  return state;
};

SnapDirectSelect.dragVertex = function (state, e, delta) {
  const { lng, lat } = snap(state, e);

  state.feature.updateCoordinate(state.selectedCoordPaths[0], lng, lat);
};

SnapDirectSelect.onStop = function (state) {
  this.deleteFeature(IDS.VERTICAL_GUIDE, { silent: true });
  this.deleteFeature(IDS.HORIZONTAL_GUIDE, { silent: true });

  // remove moveemd callback
  //   this.map.off("moveend", state.moveendCallback);
  this.map.off("draw.snap.options_changed", state.optionsChangedCallBAck);

  // This relies on the the state of SnapPolygonMode being similar to DrawPolygon
  DirectSelect.onStop?.call(this, state);
};

export default SnapDirectSelect;
