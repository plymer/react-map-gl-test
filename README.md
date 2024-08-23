# React-based Web GL Map Project

> Meant to act as a basis for geospatial data display across CMAC-West projects, this map will first function as a Weather Map to display surface observations, PIREPs, SIGMETs/AIRMETs, as well as satellite, radar, and lightning data. Later use of the map basis will be for a modernization of the Webcam website.

### Ryan Pimiskern

### August 14, 2024

## To Do:

- [x] Initialize map object
- [x] Find open-source/unlimited map tiles
- [x] Add a clock showing current time and date
- [x] Map center coordinate display
  - [ ] Need to make them fixed-width font
- [x] Enable map boundaries
- [x] Create `utilities/constants.ts` file which holds static data for the app
- [x] Initial animation capabilities (controls + frame rate)
- [x] Enable Tanstack Query aka React-Query data refetch (re-querying data every 60 seconds)
- [x] Add additional options for satellite imagery selection
- [ ] Fix caching of images (needs more investigation on how to capture tiles, and how to clear the cache)
  - The caching behaviour could be built into the minutely-refetch logic if we can figure it out
- [ ] Synchronize the timesteps available in the satellite layers
- [ ] Add Bedpost GeoJSON
- [ ] Add Radar from GeoMet
- [ ] Add CLDN data from DMS
- [ ] Add surface observations (re-use as much drawing logic from exisiting WxMap project as possible)

## Using:

- [React 18](https://react.dev/reference/react)
- [React Map GL](https://visgl.github.io/react-map-gl/)
- [Tanstack Query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [Bootstrap CSS](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
- [React Bootstrap](https://react-bootstrap.github.io/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Maputnik](https://maplibre.org/maputnik/)

