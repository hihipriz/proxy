// Data model:

// [
// 10.9.0.1: [{
//     provider: 'ipGeo',
//     times: [10:01, 11:02]
// },
// {
//     provider: 'ip',
//     times: [10:01, 11:02]
// },
// ],

// 10.9.0.2: [{
//     provider: 'ipGeo',
//     times: [10:01, 11:02]
// }]

const config = require('config');

const limit = config.get('requestLimit');

const cache = new Map();
const allowed = (ip, provider) => {
    const providers = cache.get(ip);
    const providerDoesntExist =        providers && !providers.filter((p) => p.provider === provider);

    if (!providers || providerDoesntExist) {
        cache.set(ip, [
            {
                provider,
                times: [Date.now()],
            },
        ]);

        return true;
    }

    const { times } = providers.filter((p) => p.provider === provider)[0];

    // remove passed times. (can be made more efficient since it's a sorted list)
    times.filter((time) => {
        const hour = 60 * 60000;
        const passed = Date.now() - time >= hour;
        return !passed;
    });
    cache.set(ip, times);

    if (times.length >= limit) {
        return false;
    }

    times.push(Date.now());
    cache.set(ip, times);

    return true;
};

module.exports = {
    allowed,
};
