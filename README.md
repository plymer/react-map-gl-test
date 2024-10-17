# React-based Web GL Map Project

> Meant to act as a basis for geospatial data display across CMAC-West projects, this map will first function as a Weather Map to display surface observations, PIREPs, SIGMETs/AIRMETs, as well as satellite, radar, and lightning data. Later use of the map basis will be for a modernization of the Webcam website.

Ryan Pimiskern
August 14, 2024

---

## Progress:

### General:

- [x] Initialize map object
- [x] Find open-source/unlimited map tiles (OpenFreeMap.org)
- [x] Add a clock showing current time and date
- [x] Map center coordinate display
  - [ ] Need to make them fixed-width font
  - [ ] Change the coordinate display to show cursor position on the map
- [x] Enable map boundaries
- [x] Create `lib/constants.ts` file which holds static data for the app
- [ ] Add static data to the map tiles
  - [x] Bedposts
  - [ ] TAF Site locations (w/ 5nm ring)
  - [ ] GFA Boundaries
  - [ ] FIR Boundaries

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
  - [ ] Rework lightning data pre-processing on the server
  - [ ] Create custom hook for lightning fetch
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
  - [ ] Add PIREPs, display for 1 hour after issuance
- SIGMET/AIRMET
  - [ ] Add SIGMET/AIRMET display with initial positions
  - [ ] Create motion vector info to display up-to-date position

## Major Project Dependencies:

- [React 18](https://react.dev/reference/react)
- [React Map GL](https://visgl.github.io/react-map-gl/)
- [Tanstack Query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide-React](https://lucide.dev/icons/)
- [Maputnik](https://maplibre.org/maputnik/)
- [OpenFreeMap](https://openfreemap.org/)

## Build and Deploy:

1. Clone this repository
2. `cd` into the directory containing the cloned repo
3. Run the command `npm install`
4. To test, run the command `npm run dev` and visit [http://localhost:5173/](http://localhost:5173/)
5. To build:
   - For deploying on `weg-dv`, run `npm run build-dv` and copy `dist` contents to `~pimiskernr/react-map-test`
   - For deploying to elsewhere, run `npm run build` and copy the `dist` to the server's `public_html` directory

## Useful Tools & Links:

- [Converting Hex to HSL colours](https://htmlcolors.com/hex-to-hsl)
- [Tailwind Colours](https://tailwindcss.com/docs/customizing-colors)
- [Data-driven styling](https://maplibre.org/maplibre-gl-js/docs/examples/data-driven-lines/)
- [Expressions for data-driven styling](https://maplibre.org/maplibre-style-spec/expressions/)

## Notes

- [AniMet](https://eccc-msc.github.io/msc-animet/?extent=-13733882,3940424,-6303626,10783308)

- Functionapps: what language paradigm do we want to use for the backend stuff? Python? TypeScript?
  - Look up docs for "Build and Deploy X Webapps with Azure Pipelines"

METAR retrieval

- two modes: showing station plots / listing strings of METARs (plus TAF) for one site at a time
  - station plots => time series of conditions for all sites
    - make one http request for a large chunk of data for all sites, at all times OR do we do like for the GeoMet layer where we only initially grab the current conditions and then request everything else whenever we want to animate
    - pre-process the data to map directly to flight categories out of the database (maybe even IN the database) so we can just apply data-driven styling on the map itself
    - station IDs can actually be added as a layer in the basemap (so one less thing to have to draw procedurally)
  - AMSAS-like display => time series of raw METARs for one site
    - this should be easy, so long as we can query the db for a single site
- [A tutorial on using React Router DOM](https://www.freecodecamp.org/news/how-to-use-urls-for-state-management-in-react/) for managing state in the URL (also shows a good example of how to handle a 'sub page' that gets its state from above and shows content)
