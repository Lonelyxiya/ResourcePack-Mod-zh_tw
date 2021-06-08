const path = require("path");
const fs = require("fs");
const config = require(`${process.cwd()}/config.json`)
const {
    parse,
    stringify
} = require('comment-json')
const CopyDir = require('./CopyDir').CopyDir;

async function LangFile(ModID, slug, id, name) {
    if (config.Blacklist_modId.includes(ModID)) return; //黑名單(模組ID)
    /*
    Patchouli 手冊自動添加解析器
    */
    let PatchouliDir = path.join(__dirname, `${process.cwd()}/../jar/${slug}/data/${ModID}/patchouli_books/`)
    if (fs.existsSync(PatchouliDir)) {
        let DirName = fs.readdirSync(PatchouliDir).toString().split("\n");
        for (let i = 0; i < DirName.length; i++) {
            let BookDir = path.join(__dirname, `${process.cwd()}/../jar/${slug}/data/${ModID}/patchouli_books/${DirName[i]}/en_us`)
            if (fs.existsSync(BookDir)) {
                if (!fs.existsSync(`${process.cwd()}/../assets/${ModID}/patchouli_books`)) {
                    fs.mkdirSync(path.join(__dirname, `${process.cwd()}/../assets/${ModID}/patchouli_books`));
                    fs.mkdirSync(path.join(__dirname, `${process.cwd()}/../assets/${ModID}/patchouli_books/${DirName[i]}`));
                    fs.mkdirSync(path.join(__dirname, `${process.cwd()}/../assets/${ModID}/patchouli_books/${DirName[i]}/zh_tw`));
                }
                await CopyDir(BookDir, `${process.cwd()}/../assets/${ModID}/patchouli_books/${DirName[i]}/zh_tw`);
                console.log(`複製完成 Patchouli 手冊檔案 (${ModID})`)
            }
        }
    }
    if (!fs.existsSync(`${process.cwd()}/../jar/${slug}/assets/${ModID}/lang/en_us.json`)) return;

    if (!fs.existsSync(`${process.cwd()}/../assets/${ModID}`)) {
        fs.mkdirSync(`${process.cwd()}/../assets/${ModID}`);
    }
    if (!fs.existsSync(`${process.cwd()}/../assets/${ModID}/lang`)) {
        fs.mkdirSync(`${process.cwd()}/../assets/${ModID}/lang`);
    }

    let nwe = parse(fs.readFileSync(`${process.cwd()}/../jar/${slug}/assets/${ModID}/lang/en_us.json`).toString());
    let before = {};
    if (fs.existsSync(`${process.cwd()}/../assets/${ModID}/lang/zh_tw.json`)) {
        before = parse(fs.readFileSync(`${process.cwd()}/../assets/${ModID}/lang/zh_tw.json`).toString(), null, true);
    }
    let data = stringify(Object.assign({}, before, nwe), null, 4)

    fs.writeFile(`${process.cwd()}/../assets/${ModID}/lang/zh_tw.json`, data, function (error) {
        console.log(`處理 ${name} (${id}-${ModID}) 的原始語系檔案完成`)
        if (error) {
            console.log(`解析語系Json檔案時發生錯誤。\n錯誤模組檔案: ${name} (${id}-${ModID})\n錯誤原因: ${error}`);
        }
    })
}

exports.LangFile = LangFile;