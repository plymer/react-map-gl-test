# React-based Web GL Map Project

> Meant to act as a basis for geospatial data display across CMAC-West projects, this map will first function as a Weather Map to display surface observations, PIREPs, SIGMETs/AIRMETs, as well as satellite, radar, and lightning data. Later use of the map basis will be for a modernization of the Webcam website.

Ryan Pimiskern
August 14, 2024

---

## Progress:

### General:

- [x] Initialize map object
- [x] Find open-source/unlimited map tiles
- [x] Add a clock showing current time and date
- [x] Map center coordinate display
  - [ ] Need to make them fixed-width font
- [x] Enable map boundaries
- [x] Create `utilities/constants.ts` file which holds static data for the app
- [ ] Add static data to the map tiles
  - [x] Bedposts
  - [ ] TAF Site locations (w/ 5nm ring)

### Animation:

- [x] Initial animation capabilities (controls + frame rate)
- [x] Add keyboard shortcuts for next/prev/play/pause of animation

### Data Handling:

- [x] Enable Tanstack Query aka React-Query data refetch (re-querying data every 60 seconds)
- Satellite
  - [x] Create satellite data layer
  - [x] Add additional options for satellite imagery selection
  - [x] Fix caching of images for satellite loop
    - [ ] Add progressive / regressive features that only load animation frames when animating, otherwise, only load single layers of the data and keep it up to date
  - [ ] Synchronize the timesteps available in the satellite layers so that GOES-East/West are not showing different times
- Radar
  - [x] Add Radar from GeoMet
  - [ ] Map data bins from 6 to 10 minutes
    - GeoMet data is in 6-minute bins, which will require us to normalize the data across the 10-minute bins that are used for
- Lightning
  - [x] Create Lightning Layer
  - [ ] Create hook for lightning fetch
  - [ ] Add CLDN data from DMS
    - In current WxMap implementation, DMS is queried and all lightning data is being handled by the **client**
    - I am proposing and _strongly_ recommending that we move this DMS query/data formatting logic to the server
      - I have created a Python script to perform parallel downloads of the lightning data from the store at `hubwx/data/shared/lightning/`, which then parses the lightning strikes into a GeoJSON Feature Collection which can be easily displayed on MapLibre/MapBox GL maps
- Surface Obs
  - [ ] Add surface observations (re-use as much drawing logic from exisiting WxMap project as possible)
  - First iteration should just be a popup marker for each site in order to build some base geo-located point data (for re-use in Webcam project)
  - Later iteration question is, _"Do the surface observations need to have all of their elements rendered for previous time steps?"_
    - This question is posed because reducing the amount of data retained and formatted would enhance performance
    - I also question the need since if a user is interested in a timeseries of the data from sites, we have the ability to do a "drill-down" on the observations and TAF
    - Invesigate **sprites** and how it might/might not improve performance
      - not sure of what the limitations are for size etc
      - I have SVG files for all wind barbs, wx symbols, etc from a [repo](https://www.github.com/plymer/wx-symbols)
- PIREPS
  - [ ] Add PIREPs
    - [ ] Set validity length of data
- SIGMET/AIRMET
  - [ ] Add SIGMET/AIRMET display with initial positions
  - [ ] Calculate motion and evolution

## Major Project Dependencies:

- [React 18](https://react.dev/reference/react)
- [React Map GL](https://visgl.github.io/react-map-gl/)
- [Tanstack Query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Maputnik](https://maplibre.org/maputnik/)
