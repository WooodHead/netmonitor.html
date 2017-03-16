const I = require("immutable");
const {
  ADD_TIMING_MARKER,
  CLEAR_TIMING_MARKERS,
  CLEAR_REQUESTS,
} = require("../constants");

const TimingMarkers = I.Record({
  firstDocumentDOMContentLoadedTimestamp: -1,
  firstDocumentLoadTimestamp: -1,
});

function addTimingMarker(state, action) {
  if (action.marker.name === "document::DOMContentLoaded" &&
      state.firstDocumentDOMContentLoadedTimestamp === -1) {
    return state.set("firstDocumentDOMContentLoadedTimestamp",
                     action.marker.unixTime / 1000);
  }

  if (action.marker.name === "document::Load" &&
      state.firstDocumentLoadTimestamp === -1) {
    return state.set("firstDocumentLoadTimestamp",
                     action.marker.unixTime / 1000);
  }

  return state;
}

function clearTimingMarkers(state) {
  return state.withMutations(st => {
    st.remove("firstDocumentDOMContentLoadedTimestamp");
    st.remove("firstDocumentLoadTimestamp");
  });
}

function timingMarkers(state = new TimingMarkers(), action) {
  switch (action.type) {
    case ADD_TIMING_MARKER:
      return addTimingMarker(state, action);

    case CLEAR_REQUESTS:
    case CLEAR_TIMING_MARKERS:
      return clearTimingMarkers(state);

    default:
      return state;
  }
}

module.exports = {
  TimingMarkers,
  timingMarkers
};
