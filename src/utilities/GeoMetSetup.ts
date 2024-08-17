export const parseTimes = (xml: string) => {
    const parser = new DOMParser();

    let dimString = parser.parseFromString(xml, "text/xml").getElementsByTagName("Dimension")[0].childNodes[0].nodeValue?.split("/");

    if (dimString) {
        let timeStart = Date.parse(dimString[0]);
        let timeEnd = Date.parse(dimString[1]);
        let timeDiff = parseInt(dimString[2].replace(/[a-zA-z]/g, "")) * 1000 * 60;

        let timeSlices = (timeEnd - timeStart) / timeDiff;

        if (timeSlices > 60) {
            timeSlices = 60;
            timeEnd = timeStart - timeSlices * timeDiff;
        }
        return { timeStart: timeStart, timeEnd: timeEnd, timeSlices: timeSlices, timeDiff: timeDiff };
    }
};

export const makeISOTimeStamp = (time: number, slice?: number, delta?: number) => {
    var totalDelta: number;

    slice && delta ? (totalDelta = slice * delta) : (totalDelta = 0);

    return new Date(time + totalDelta).toISOString().replace(/.\d+Z$/g, "Z");
};
