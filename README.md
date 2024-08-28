# React-based Web GL Map Project

> Meant to act as a basis for geospatial data display across CMAC-West projects, this map will first function as a Weather Map to display surface observations, PIREPs, SIGMETs/AIRMETs, as well as satellite, radar, and lightning data. Later use of the map basis will be for a modernization of the Webcam website.

Ryan Pimiskern
August 14, 2024

## Rationale for project:

The current WxMap project deals with _stateful_ code structure, since the project is an interactive map with a user interface baked on top of it. The technology stack in use is basic, utilizing Javascript, CSS, and HTML in addition to a small amount of PHP for handling of server requests. Certain components of the stack are a part of the NodeJS ecosystem, which is an industry-standard asset system used for full-stack Web Development. State management is being done in a rudimentary and complicated fashion and modern tools have overtaken native methods for doing so.

My project here is a proof of concept / exploratory look at converting the work that has been done, utilizing it as a spiritual successor, and leaning fully into industry-standard methods and tools. Leveraging modern toolkits like React and TypeScript in an up-to-date technology stack, we can build a more performant product to the user while also having an easily-maintained codebase that follows industry standards and best practices.

Despite the initial learning curve, the tools that exist within the React ecosystem such as Tanstack-Query and Axios remove an incredible amount of overhead for things like data fetching routines and error handling for example. Creating re-usable data and UI components with compartmentalized code structures will allow onboarding and maintaining the project to be quick and efficient. The amount of training, tutorials, and documentation that exists within this ecosystem should not be understated either.

Another longer-term benefit for this project is that it initiates a modernization of the programming culture within CMAC-West while providing a relevant experience for any future Co-op students or interns looking to gain valuable work experience. The first iteration of the WxMap project was a good start, but this is the push that we need as an office.

## Progress:

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
- [x] Fix caching of images for satellite loop
  - [ ] Add progressive / regressive features that only load animation frames when animating, otherwise, only load single layers of the data and keep it up to date
- [ ] Synchronize the timesteps available in the satellite layers
- [ ] Add Bedpost GeoJSON
  - This will be added to the base map style layer so as not to require any extra processing
  - There are performance gains by embedding this vector data into the TileJSON returned in the base map
- [ ] Add Radar from GeoMet
  - GeoMet data is in 6-minute bins, which will require us to normalize the data across the 10-minute bins that are used for
- [ ] Add CLDN data from DMS
  - In current WxMap implementation, DMS is queried and all lightning data is being handled by the **client**
  - I am proposing and _strongly_ recommending that we move this DMS query/data formatting logic to the server
    - I have created a Python script to perform parallel downloads of the lightning data from the store at `hubwx/data/shared/lightning/`, which then parses the lightning strikes into a GeoJSON Feature Collection which can be easily displayed on MapLibre/MapBox GL maps
- [ ] Add surface observations (re-use as much drawing logic from exisiting WxMap project as possible)

  - First iteration should just be a popup marker for each site in order to build some base geo-located point data (for re-use in Webcam project)
  - Later iteration question is, _"Do the surface observations need to have all of their elements rendered for previous time steps?"_
    - This question is posed because reducing the amount of data retained and formatted would enhance performance
    - I also question the need since if a user is interested in a timeseries of the data from sites, we have the ability to do a "drill-down" on the observations and TAF

- [x] Add keyboard shortcuts for next/prev/play/pause of animation

## Major Project Dependencies:

- [React 18](https://react.dev/reference/react)
- [React Map GL](https://visgl.github.io/react-map-gl/)
- [Tanstack Query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [Bootstrap CSS](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
- [React Bootstrap](https://react-bootstrap.github.io/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Maputnik](https://maplibre.org/maputnik/)
