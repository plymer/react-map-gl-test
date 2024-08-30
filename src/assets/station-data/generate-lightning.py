from datetime import datetime, timedelta, timezone
import os, requests as html
from geojson import MultiPoint, Point, Feature, FeatureCollection
from multiprocessing import cpu_count
from multiprocessing.pool import ThreadPool


coords = []
timeElapsed = timedelta()


# this function creates a GET request for a url containing lightning data and then processes it
# for conversion into geojson at a later time
def download_url(url):

    response = ""
    dt = timedelta()
    points = []
    
    try:
        response = html.get(url)
        if response.status_code != 200:
            raise Exception()

    except:
        print("Error accessing " + url + "\nCode " + str(response.status_code) + " - Failed to retrieve lightning data.")

    else:
        dt += response.elapsed

        lightningEvents = response.text.strip().split(";")

        for l in lightningEvents:
            if l != "":
                # text file contains space-separated columns, with lat and lon in the 2nd and 3rd columns
                event = l.split(" ")
                # round the coordinates to 3 decimal places to reduce file size
                # print(event[0]) # TODO:: split this by ":"
                lat = round(float(event[1]), 4)
                lon = round(float(event[2]), 4)
                # geojson format requires lon,lat format for coordinates
                points.append((lon, lat))
    
    return [dt, points]

# we will use this function to parallelize the downloading of the files
# by invoking multiple threads calling the download_url function and passing the
# searchURLs array
def download_parallel(urls):

    totalTime = timedelta()
    points = []

    cpus = cpu_count()
    response = ThreadPool(cpus - 1).imap_unordered(download_url, urls)
    for r in response:
        totalTime += r[0]
        points.extend(r[1])

    return [totalTime, points]


# get the location of this script and then change our working directory to "../data"
path = os.path.dirname(os.path.realpath(__file__))
os.chdir(path)
path = os.getcwd()

# lightning stored in 2-minute bins on DMS
# this script will be called every 2 minutes via cron
# we will query the DMS and generate a GeoJSON file with all of the flash data in it
# we will query the DMS in parallel and accumulate a larger dataset, several hours deep
# time strings are in YYYYMMDDHHmm format i.e. 202408020802 (2024 August 2, 08:02Z)

# build a series of date strings to create valid URLs for retrieving lightning data
# we want to grab 30 miniutes' worth of data to plot

# example of a text file's location:
#   https://ecdc-hubwxexternal-as.azurewebsites.net/hubwx/data/shared/lightning/Lightning_202408020800.txt

baseURL = "https://ecdc-hubwxexternal-as.azurewebsites.net/hubwx/data/shared/lightning/Lightning_"
searchURLs = []

now = datetime.now(timezone.utc)

# looking for t minutes of data, with a bin size of dt minutes
t = 10
dt = 1
timeSteps = round(t / dt)
i = 0
while (i < timeSteps):
    # do some date math where we take 2 minutes times i away from the time string
    # then generate the URL-safe date string
    dateString = (now - timedelta(minutes=(2*i))).strftime("%Y%m%d%H%M")
    searchURLs.append(baseURL + str(dateString) + ".txt")
    i += 1


output = download_parallel(searchURLs)

# modified from https://stackoverflow.com/a/34924247
# simplify the number of points - the "d" value is the search distance between points
# here it is in decimal degrees, i.e. 0.02 degrees radius, or 1.2 nautical miles
# for an area of active lightning, this can cut the number of points from ~1500 to around ~900
# when this was being tested on a night where there was a large squall line in detection range
# --------
# since we are applying a 5nm-radius circle to the lightning data on the map, we can cut this down
# to a 2.5nm radius simplification aka 0.04 degrees
d = 0.04
hpoints = {((x - (x % d)), (y - (y % d))) : (x,y) for x, y in output[1]}

simplified = []

for x in hpoints.values():
    simplified.append(x)

print(len(simplified))

# g = []

# for p in simplified:

#     # g += Feature(geometry=Point(p))
#     g.append(Feature(geometry=Point(p)))

g = [Feature(geometry=MultiPoint(simplified))]

fc = FeatureCollection(g)

# this is fine for now, however, we will want to split these lightning events into 5-minute chunks
# probably using FeatureCollections with a time property that we can reference later
with open(path + "/lightning.geojson", "w") as file:
    file.write(str(fc))

# print("Lightning data saved in " + fileName + " after " + str(timeElapsed))