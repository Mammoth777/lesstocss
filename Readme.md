# less转css
> 并没有什么用的一个东西， 2333  *just for fun*
## 执行
在项目文件夹里， 用`node`执行`lesstocss.js`即可。（需已安装less, 2333）
```bash
cd myProject
npm i less --save
node lesstocss.js inputPath outputPath
```
### 0.0

默认将`less文件`内的所有less文件转换至`css文件夹`相同目录内

- 默认参数
    + inputPath: less
    + outputPath: css

## config
在`lesstocss.js`内配置
```javascript
const config = {
    singleDir: false, // 是否输出到单文件夹
    exclude: ['node_modules'], // 忽略的.less文件 例： ['demo.less', 'demo1.less']
}
```
