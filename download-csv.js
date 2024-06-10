import fs from "fs";
import Papa from "papaparse";

const sheetData = {
    id: "1_uUxjdztolJlJrm0Smv3gJAaYLBQxLKVklZsIOb7N_g",
    name: "list"
}

try {
    const data = await fetch(`https://docs.google.com/spreadsheets/d/${sheetData.id}/gviz/tq?tqx=out:csv&sheet=${sheetData.name}`, {
        method: "get",
        headers: {
            "content-type": "text/csv;charset=UTF-8",
        },
    });

    if (data.status === 200) {
        const rawData = await data.text();
        var csvData = Papa.parse(rawData);

        const csvDataNoHeader = csvData.data.slice(1);

        const JSONData = csvDataNoHeader.map((key) => ({
            name: key[0],
            link: key[1],
            creator: key[2],
            home: key[3],
            isInteractive: key[4] === "t" || key[4] === "T",
            isJumpChain: key[5] === "t" || key[5] === "T",
            themes: key[6].split(",").map(v => v.trim()),
            franchise: key[7].split(",").map(v => v.trim()),
            mechanics: key[8].split(",").map(v => v.trim()),
            imageLink: key[9],
            description: key[10],
            version: key[11],
            upvotes: parseInt(key[12]) ?? 0,
            altLink: key[13]
        })).sort((a, b) => a.upvotes - b.upvotes);

        fs.writeFile("./data.json", JSON.stringify(JSONData, null, 2), (error) => {
            if (error) {
                console.log("An error has occurred ", error);
                return;
            }
            console.log("Data written successfully to disk");
        });
    } else {
        console.error("http error", data.status)
    }

} catch (e) {
    console.log(err);
}