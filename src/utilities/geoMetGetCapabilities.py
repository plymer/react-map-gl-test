# this file will be run on the server and will generate a JSON (or put something in a database that will return a JSON)
# that we can call via API that will handle all of the parsing of time steps and URLs so that our app
# can simply populate the query data response and everything will time-map to the correct animationcontext frames

output = {
  # root of object contains all data for setting up the animation state
  "timeStart" : 1725200400000,
  "timeEnd" : 1725211200000,
  "timeDelta" : 600000,
  "timeSteps" : 18,
  "geoMetProducts" : [
    {
      "productType" : "satellite",
      "products" : [
        {
          "productMenuName" : "Cloud Type / Night Microphysics",
          "productString" : "1km_DayCloudType-NightMicrophysics",
          "productSubDomains" : [
            {
              "subDomain" : "GOES-East",
              "urls" : []
            },
            {
              "subDomain" : "GOES-West",
              "urls" : []
            }
          ]},
          {
          "productMenuName" : "IR Sandwich",
          "productString" : "1km_DayCloudType-NightMicrophysics",
          "productSubDomains" : [
            {
              "subDomain" : "GOES-East",
              "urls" : []
            },
            {
              "subDomain" : "GOES-West",
              "urls" : []
            }
          ]}
      ]},
      {
      "productType" : "radar",
      "products" : [
        {
          "productMenuName" : "Rain",
          "productString" : "RADAR_1KM_RRAI"
        },
        {
          "productMenuName" : "Snow",
          "productString" : "RADAR_1KM_RSNO"
        }

      ]}
  ]
}