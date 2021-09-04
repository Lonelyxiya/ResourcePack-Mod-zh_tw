const fs = require("fs");
const path = require("path");
const request = require("request");
const config = require(`${process.cwd()}/config.json`)
const compressing = require('compressing');
const CurseForge = require("mc-curseforge-api");
const { GetModID } = require("./Module/GetModID");
require('dotenv').config();
const {
    parse,
} = require('comment-json')

let ModDirPath = path.join(__dirname, "mod");
if (!fs.existsSync(ModDirPath)) {
    fs.mkdirSync(ModDirPath);
}
if (!fs.existsSync(path.join(__dirname, "../assets"))) {
    fs.mkdirSync(path.join(__dirname, "../assets"));
}


let ModList;
for (let k = 0; k < 1; k++) {
    let url = config.DownloadUrl;
    let stream = fs.createWriteStream(path.join("ModList.json"));
    request(url).pipe(stream).on("close", function () {
        ModList = Array(parse(fs.readFileSync("ModList.json").toString()).files)[0];
        console.log(`準備開始處理模組包語系檔案，全部共有 ${ModList.length - 1} 個模組，開始處理中。`);
        aaa()
    })

    function aaa() {
        for (let i = 0; i < ModList.length; i++) {
            let slug, fileID, fileName;
            let CurseForgeID = ModList[i].projectID;
            CurseForge.getModFiles(CurseForgeID).then((files) => {
                for (let j = 0; j < files.length; j++) {
                    files = files.reverse();
                    files.sort(function (a, b) {
                        return Date.parse(b.timestamp) - Date.parse(a.timestamp);
                    });
                    let data = files[j].minecraft_versions;
                    if (data.includes(config.ver) || data.includes("1.16.4") || data.includes("1.16.3") || data.includes("1.16.2") || data.includes("1.16.1") || data.includes("1.16")) {
                        fileID = String(files[j].id);
                        fileName = String(files[j].download_url.split("https://edge.forgecdn.net/files/")[1].replace("/", "").split("/")[1]);
                        let test = path.join(ModDirPath, fileName);
                        slug = fileName.split(".jar")[0];
                        try {
                            files[j].download(test, true).then(r => {
                                console.log(`${fileName} 下載完成。`);
                                compressing.zip.uncompress(`./mod/${fileName}`, "../jar/" + slug).then(() => GetModID(slug, CurseForgeID, fileName))
                            });
                        } catch (err) {
                            console.log("發生未知錯誤 \n" + err);
                        }
                        break;
                    }
                }
            });
        }
    }
}