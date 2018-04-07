const less = require('less')
const path = require('path')
const fs = require('fs')

/**
 * 传入 less和css文件路径
 * @name convert_less_to_css
 * @param {string} input 
 * @param {string} output
 * @return {Promise}
 */
function convert(input, output) {
    if (typeof input != 'string' || typeof output != 'string') return;
    return new Promise((resolve, reject) => {
        fs.readFile(input, 'utf-8', (err, data) => {
            if (err) throw err;
            less.render(data, (err, result) => {
                if (err) throw err;
                if (!fs.existsSync(path.dirname(output))) {
                    let newOutput = path.dirname(output);
                    fs.mkdirSync(newOutput);
                }
                fs.writeFile(output, result.css, 'utf-8', err => {
                    if (err) throw err;
                    resolve(result.css);
                })
            })
        })
    })
}

/**
 * 
 * @param {string} inputDir 绝对路径
 * @param {string} outputDir 绝对路径
 * @param {string} inputRootDir 根路径入口
 * @param {object} config {include, exclude}
 */
function findLess(inputDir, outputDir, inputRootDir, config) {
    let { singleDir } = config;
    console.log(singleDir, 'singledir');
    if(config.exclude && config.exclude.includes(inputDir)){
        // 文件夹被排除
        console.log(`${inputDir} 已排除`);
        return;
    }else{
        null;
    }
    if (!isDir(inputRootDir)) throw new Error('inputRootDir must be directory')    
    fs.readdir(inputDir, (err, files) => {
        if (err) throw err;
        files.forEach(file => {
            if(config.exclude && config.exclude.includes(file)){
                // 文件夹被排除
                console.log(`${file} 已排除`);
                return;
            }else{
                console.log(file);
            }
            file = path.join(inputDir, file);
            if (isFile(file) && path.extname(file) === '.less') {
                // 如果是less文件
                let outputFile = '';
                if(singleDir){
                    // 输出到单个文件夹
                    outputFile = file.replace(inputDir, outputDir);
                }else{
                    outputFile = file.replace(inputRootDir, outputDir);
                }
                convert(
                    file,
                    outputFile.replace(/\.less$/, '.css')
                ).then(res => {
                    console.log(file, 'convert done');
                })
            } else if (isDir(file)) {
                // 如果是文件夹
                findLess(file, outputDir, inputRootDir, config);
            }
        });
    })
}

function isFile(path) {
    return fs.existsSync(path) && fs.statSync(path).isFile();
}
function isDir(path) {
    return fs.existsSync(path) && fs.statSync(path).isDirectory();
}

/**
 * 主函数
 * 传入： 入口路径 + 出口路径(两个路径均为本文件位置的相对路径)
 * 
 * @param {string} inputDir  相对路径
 * @param {string} outputDir 相对路径
 * @param {object} config 
 */
function main(inputDir = 'less', outputDir = 'css', config) {
    if (!inputDir) {
        throw new Error('【main函数】需要传入口文件夹（相对路径）0.0')
    }
    let inputRootDir = inputDir;
    findLess(inputDir, outputDir, inputRootDir, config);
}

const config = {
    singleDir: false, // 是否输出到单文件夹
    exclude: ['node_modules']
}

let [inputDir, outputDir] = process.argv.splice(2);
main(inputDir, outputDir, config)