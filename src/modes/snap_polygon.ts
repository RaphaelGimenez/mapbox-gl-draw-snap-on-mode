import MapboxDraw, { DrawPolygon, lib } from "@mapbox/mapbox-gl-draw";
const { geojsonTypes, modes, cursors } = MapboxDraw.constants;
const { doubleClickZoom } = MapboxDraw.lib;
const DrawPolygonMode = MapboxDraw.modes.draw_polygon;

import {
  addPointTovertices,
  createSnapList,
  getGuideFeature,
  IDS,
  shouldHideGuide,
  snap,
} from "../utils";
import booleanIntersects from "@turf/boolean-intersects";
import { difference } from "@turf/difference";
import { featureCollection, point } from "@turf/helpers";
import { Map } from "mapbox-gl";

const SnapPolygonMode = { ...DrawPolygonMode };

type State = {
  map: Map;
  polygon: DrawPolygon;
  currentVertexPosition: number;
  vertices: any;
  snapList: any;
  selectedFeatures: any;
  verticalGuide: any;
  horizontalGuide: any;
  ghostPoint: GeoJSON.Feature<GeoJSON.Point>;
  snappedLng: number;
  snappedLat: number;
  options: MapboxDraw.MapboxDrawOptions;
  moveendCallback?: () => void;
  optionsChangedCallBAck?: (options: any) => void;
};

SnapPolygonMode.onSetup = function (options) {
  const polygon = this.newFeature({
    type: geojsonTypes.FEATURE,
    properties: {},
    geometry: {
      type: geojsonTypes.POLYGON,
      coordinates: [[]],
    },
  }) as DrawPolygon;

  const verticalGuide = this.newFeature(getGuideFeature(IDS.VERTICAL_GUIDE));
  const horizontalGuide = this.newFeature(
    getGuideFeature(IDS.HORIZONTAL_GUIDE)
  );

  this.addFeature(polygon);
  this.addFeature(verticalGuide);
  this.addFeature(horizontalGuide);

  const selectedFeatures = this.getSelected();
  this.clearSelectedFeatures();
  doubleClickZoom.disable(this);

  const [snapList, vertices] = createSnapList(
    this.map,
    (this as any)._ctx.api,
    polygon,
    (this as any)._ctx.options.snapOptions.sources
  );

  const state: State = {
    map: this.map,
    polygon,
    currentVertexPosition: 0,
    vertices,
    snapList,
    selectedFeatures,
    verticalGuide,
    horizontalGuide,
    snappedLat: 0,
    snappedLng: 0,
    ghostPoint: point([0, 0], { meta: "feature", active: "true" }),
    /// Adding default options
    options: (options = Object.assign((this as any)._ctx.options, {
      overlap: true,
    })),
  };

  const moveendCallback = () => {
    const [snapList, vertices] = createSnapList(
      this.map,
      (this as any)._ctx.api,
      polygon,
      state.options.snapOptions.sources
    );
    state.vertices = vertices;
    state.snapList = snapList;
  };
  // for removing listener later on close
  state["moveendCallback"] = moveendCallback;

  const optionsChangedCallBAck = (options: any) => {
    state.options = options;
  };

  // for removing listener later on close
  state["optionsChangedCallBAck"] = optionsChangedCallBAck;

  this.map.on("moveend", moveendCallback);
  this.map.on("draw.snap.options_changed", optionsChangedCallBAck);

  return state;
};

SnapPolygonMode.onClick = function (state: State, e) {
  // We save some processing by rounding on click, not mousemove
  const lng = state.snappedLng;
  const lat = state.snappedLat;

  // End the drawing if this click is on the previous position
  if (state.currentVertexPosition > 0) {
    this.updateUIClasses({ mouse: cursors.POINTER });

    if (lib.CommonSelectors.isVertex(e)) {
      return this.changeMode(modes.SIMPLE_SELECT, {
        featureIds: [state.polygon.id],
      });
    }
  }

  addPointTovertices(state.map, state.vertices, { lng, lat });

  state.polygon.updateCoordinate(`0.${state.currentVertexPosition}`, lng, lat);

  state.currentVertexPosition++;

  state.polygon.updateCoordinate(`0.${state.currentVertexPosition}`, lng, lat);
};

SnapPolygonMode.onMouseMove = function (state: State, e) {
  const { lng, lat } = snap(state, e);
  state.snappedLng = lng;
  state.snappedLat = lat;

  state.ghostPoint.geometry.coordinates = [lng, lat];

  state.polygon.updateCoordinate(`0.${state.currentVertexPosition}`, lng, lat);

  if (lib.CommonSelectors.isVertex(e)) {
    this.updateUIClasses({ mouse: cursors.POINTER });
  } else {
    this.updateUIClasses({ mouse: cursors.ADD });
  }
};

// This is 'extending' DrawPolygon.toDisplayFeatures
SnapPolygonMode.toDisplayFeatures = function (state: State, geojson, display) {
  if (shouldHideGuide(state, geojson)) return;

  display(state.ghostPoint);
  // This relies on the the state of SnapPolygonMode being similar to DrawPolygon
  (DrawPolygonMode as any).toDisplayFeatures(state, geojson, display);
};

// This is 'extending' DrawPolygon.onStop
SnapPolygonMode.onStop = function (state) {
  this.deleteFeature(IDS.VERTICAL_GUIDE, { silent: true });
  this.deleteFeature(IDS.HORIZONTAL_GUIDE, { silent: true });

  // remove moveemd callback
  this.map.off("moveend", state.moveendCallback);
  this.map.off("draw.snap.options_changed", state.optionsChangedCallBAck);

  var userPolygon = state.polygon;
  if (state.options.overlap) {
    (DrawPolygonMode as any).onStop.call(this, state);
    return;
  }
  // if overlap is false, mutate polygon so it doesnt overlap with existing ones
  // get all editable features to check for intersections
  var features = (this as any)._ctx.store.getAll();

  try {
    var edited = userPolygon;
    features.forEach(function (feature: any) {
      if (userPolygon.id === feature.id) return false;
      if (!booleanIntersects(feature, edited)) return;
      edited = difference(featureCollection([edited, feature]));
    });
    state.polygon.coordinates =
      edited.coordinates || edited.geometry.coordinates;
  } catch (err) {
    // cancel this polygon if a difference cannot be calculated
    (DrawPolygonMode as any).onStop.call(this, state);
    this.deleteFeature(state.polygon.id, { silent: true });
    return;
  }

  // monkeypatch so DrawPolygon.onStop doesn't error
  var rc = state.polygon.removeCoordinate;
  state.polygon.removeCoordinate = () => {};
  // This relies on the the state of SnapPolygonMode being similar to DrawPolygon
  (DrawPolygonMode as any).onStop.call(this, state);
  state.polygon.removeCoordinate = rc.bind(state.polygon);
};

export default SnapPolygonMode;
