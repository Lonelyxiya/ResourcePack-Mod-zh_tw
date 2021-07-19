const path = require("path");
const fs = require("fs");
const config = require(`${process.cwd()}/config.json`)
const {LangToJson} = require("./LangToJson");
const {
    parse,
    stringify
} = require('comment-json')
const CopyDir = require('./CopyDir').CopyDir;
const CurseForgeIndex = require('./CurseForgeIndex').CurseForgeIndex;

async function LangFile(ModID, slug, id, name) {
    if (config.Blacklist_modId.includes(ModID)) return; //黑名單(模組ID)

    if (!fs.existsSync(`${process.cwd()}/../assets/${ModID}`)) {
        fs.mkdirSync(`${process.cwd()}/../assets/${ModID}`);
    }

    /*
    Patchouli 手冊自動添加解析器
    */
    // let PatchouliDir = `${process.cwd()}/../jar/${slug}/assets/${ModID}/patchouli_books/`
    // if (fs.existsSync(PatchouliDir)) {
    //     let DirName = fs.readdirSync(PatchouliDir).toString().split("\n");
    //     for (let i = 0; i < DirName.length; i++) {
    //         let BookDir = `${process.cwd()}/../jar/${slug}/assets/${ModID}/patchouli_books/${DirName[i]}/en_us`;
    //         if (fs.existsSync(BookDir)) {
    //             if (!fs.existsSync(`${process.cwd()}/../assets/${ModID}/patchouli_books`)) {
    //                 fs.mkdirSync(`${process.cwd()}/../assets/${ModID}/patchouli_books`);
    //                 fs.mkdirSync(`${process.cwd()}/../assets/${ModID}/patchouli_books/${DirName[i]}`);
    //                 fs.mkdirSync(`${process.cwd()}/../assets/${ModID}/patchouli_books/${DirName[i]}/zh_tw`);
    //             }
    //             await CopyDir(BookDir, `${process.cwd()}/../assets/${ModID}/patchouli_books/${DirName[i]}/zh_tw`);
    //             console.log(`複製完成 Patchouli 手冊檔案 (${ModID})`)
    //         }
    //     }
    // }
    if (!fs.existsSync(`${process.cwd()}/../jar/${slug}/assets/${ModID}/lang/en_us.lang`)) return;

    if (!fs.existsSync(`${process.cwd()}/../assets/${ModID}/lang`)) {
        fs.mkdirSync(`${process.cwd()}/../assets/${ModID}/lang`);
    }

    let New = fs.readFileSync(`${process.cwd()}/../jar/${slug}/assets/${ModID}/lang/en_us.lang`).toString();
    let Before = {};
    if (fs.existsSync(`${process.cwd()}/../assets/${ModID}/lang/zh_tw.json`)) {
        Before = parse(fs.readFileSync(`${process.cwd()}/../assets/${ModID}/lang/zh_tw.json`).toString(), null, true);
    }
    let data = stringify(Object.assign({}, Before, LangToJson(New)), null, 4)

    if (fs.existsSync(`${process.cwd()}/../jar/${slug}/assets/${ModID}/lang/zh_cn.lang`)) {
        console.log(`${name} (${id}-${ModID}) 模組存在有簡體中文翻譯。`)
    }
    fs.writeFile(`${process.cwd()}/../assets/${ModID}/lang/zh_tw.json`, data, function (error) {
        if (error) {
            console.log(`寫入語系檔案時發生未知錯誤。\n錯誤模組檔案: ${name} (${id}-${ModID})\n錯誤原因: ${error}`);
        }
        CurseForgeIndex(ModID, id, name);
        return console.log(`處理 ${name} (${id}-${ModID}) 的原始語系檔案完成`);
    })
}

exports.LangFile = LangFile;