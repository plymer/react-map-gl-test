# Thoughts on Data Handling

- Use a database to hold all _raw_ results from a GetCapabilities request for each layer we can query (all satellite types, all radar, all NWP)
- Parse the data to map the most-coarse time steps available
  - Thinking along the lines of satellite being 10 minute chunks (which is what I want the timesteps to be)
  - Map the radar (6 minutes) to the nearest 10-minute bin
  - NWP would be its own thing
