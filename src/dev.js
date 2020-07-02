import vmBabelPlugin from "./babel-plugin";

const breakpointPlugin = require('./breakpoint-plugin');
const {parse, transform, traverse} = require("@babel/core");


const source =  `console.log(__line);
class TestClass{
    stat(){
        var self = this;
        var propVariable = 1;
        //trace:;
        1;
    }
}
var val = 1;
var val2 = 2;
trace:val,val2,this;

`;

const transformed = transform(source, {
    filename: 'test.js',
    "presets": [["@babel/preset-env",{targets:{node:'current',esmodules:false}}]],
    babelrc: false,
    configFile: false,
    //debug:true,
    plugins: [
        [vmBabelPlugin],
        ['babel-plugin-transform-line'],
    ],
    parserOpts: { allowReturnOutsideFunction: true }
});

console.log(transformed.code);