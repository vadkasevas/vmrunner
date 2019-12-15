import VMRunner from "./VMRunner";

const npmiconv = require('iconv-lite');

if(false) {
    const NumberProxy = new Proxy(Number, {
        get: function (target, property) {
            return target[property];
        },
        set: function (target, key, value, receiver) {

        },
        getOwnPropertyDescriptor(target, name) {
            return Object.getOwnPropertyDescriptor(target, name);
        },
        ownKeys(target) {
            return Object.getOwnPropertyNames(target);
        },
        defineProperty(target, name, propertyDescriptor) {

        },
        deleteProperty(target, name) {

        },
        preventExtensions(target) {

        },
        has(target, name) {
            return name in target;
        }
    });

// Convert from an encoded buffer to js string.
//let str = iconv.decode(Buffer.from([0x68, 0x65, 0x6c, 0x6c, 0x6f]), 'win1251');
    Meteor.afterStartup(() => {
        let runResult = new VMRunner()
            .withConvertResult(false)
            .withGlobalScope({
                'glob': "GLOBAL VALUE"
            })
            .withUser(Meteor.users.findOne('tLNsKCdQh2Coheqiu'))
            .run(`return OutgoingProjects.find().count()`, {local: 'local'});

        console.log('runResult:', runResult);
    });
}


