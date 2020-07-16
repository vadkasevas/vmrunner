let VM_RUNNER_RUN_ID = '';
let {test} = vm2Options.localScope;

function generateUid () {
    var u = '', i = 0;
    var four = 4;
    var pattern = 'xxxxxxxx-xxxx-' + four + 'xxx-yxxx-xxxxxxxxxxxx';
    while (i++ < 36) {
        var c = pattern[i - 1], r = Math.random () * 16 | 0, v = c == 'x' ? r : r & 0x3 | 0x8;
        u += c == '-' || c == four ? c : v.toString (16);
    }
    return u;
}

if (typeof vm2Options === 'undefined') {
    vm2Options = {};
}
let VM_RUNNER_HASH = vm2Options.VM_RUNNER_HASH;
let customOptions = vm2Options.customOptions || {};
let traceOptions = customOptions.trace || {};
let vm2Expression = vm2Options.expression || null;
let VM_RUNNER_TRACE = function (logLevel, prefix, message, data) {
    var alias = traceOptions && traceOptions.aliases && traceOptions.aliases[logLevel];
    var messageObj = {
        frame: vmCodeFrame (vm2Expression, this.line),
        prefix: prefix,
        message: message,
        logLevel: logLevel,
        data: data,
        line: this.line,
        date: new Date ()
    };
    if (alias) {
        try {
            return alias.apply (this, [messageObj]);
        } catch (e) {
            console.error (e);
        }
    }
};
return function vmRunnerWrapper () {
    VM_RUNNER_RUN_ID = generateUid ();
    return test;
}.apply (this);