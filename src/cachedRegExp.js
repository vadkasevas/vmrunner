var cache = new MalibunCache();
import MalibunCache from "./MalibunCache";

export default function cachedRegExp(pattern,options){
    if(pattern instanceof RegExp){
        var key = pattern.toString();
        if (!cache.has(key)) {
            cache.set(key, pattern, 60 * 1000);
            return pattern;
        } else {
            var result = cache.get(key);
            result.lastIndex = 0;
            return result;
        }
    }else {
        var key = `${pattern}:${options || ''}`;
        if (!cache.has(key)) {
            var re = new RegExp(pattern, options);
            cache.set(key, re, 60 * 1000);
            return re;
        } else {
            var result = cache.get(key);
            result.lastIndex = 0;
            return result;
        }
    }
};

