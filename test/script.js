const babelCore = require("@babel/core")

var expr = `let BaseMenuContext = this.BaseMenuContext; //__line`;

const { code, map, ast } = babelCore.transformSync(expr, {
    //sourceType:'script',
    "presets": [["@babel/preset-env",{
        targets:{node:true,esmodules:false},
        modules: false
    }]],
    "plugins": [
        ['babel-plugin-transform-line'],
        "@babel/plugin-transform-runtime",
        ["@babel/plugin-syntax-dynamic-import"],
        ["@babel/plugin-proposal-optional-chaining"],
        ["@babel/plugin-proposal-decorators", {"legacy": true}],
        /*["transform-es2015-modules-commonjs-simple", {
            "noMangle": true
        }],
        ["@babel/plugin-transform-modules-commonjs", {
            "allowTopLevelThis": true
        }]*/
    ],
    "sourceMaps": false,
    "retainLines": true
});


console.log(code);