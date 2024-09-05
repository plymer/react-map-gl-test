from datetime import datetime, timedelta, timezone
import os, requests as html
from geojson import MultiPoint
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
                # round the coordinates to 2 decimal places to reduce file size
                # print(event[0]) # TODO:: split this by ":"
                lat = round(float(event[1]), 2)
                lon = round(float(event[2]), 2)
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
os.chdir("../data")
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
t = 30
dt = 2
timeSteps = round(t / dt)
i = 0
while (i < timeSteps):
    # do some date math where we take 2 minutes times i away from the time string
    # then generate the URL-safe date string
    dateString = (now - timedelta(minutes=(2*i))).strftime("%Y%m%d%H%M")
    searchURLs.append(baseURL + str(dateString) + ".txt")
    i += 1


output = download_parallel(searchURLs)

timeElapsed = output[0]
coords = output[1]

# print(coords)

# we have collected our lightning strikes and now we want to write them out to a file in the ../data folder
fileName = path + "/lightning.geojson"


# this is fine for now, however, we will want to split these lightning events into 5-minute chunks
# probably using FeatureCollections with a time property that we can reference later
with open(fileName, "w") as file:
    file.write(str(MultiPoint(coords)))

print("Lightning data saved in " + fileName + " after " + str(timeElapsed))