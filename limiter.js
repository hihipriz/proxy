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

const handleMissingProvider = (cache, provider, ip, providers) => {
    if (!providers) {
        cache.set(ip, [
            {
                provider,
                times: [Date.now()]
            }
        ]);

        return true;
    }

    const providerDoesntExist =
        providers.find(p => p.provider === provider) === undefined;

    if (providerDoesntExist) {
        providers.push({
            provider,
            times: [Date.now()]
        });

        cache.set(ip, providers);

        return true;
    }

    return false;
};

const cache = new Map();
const allowed = (ip, provider) => {
    const providers = cache.get(ip);
    const missing = handleMissingProvider(cache, provider, ip, providers);
    if (missing) return true;

    const filtered = providers.find(p => p.provider === provider);
    const times = (filtered && filtered.times) || [];

    // remove passed times. (can be made more efficient since it's a sorted list)
    times.filter(time => {
        const hour = 60 * 60000;
        const passed = Date.now() - time >= hour;
        return !passed;
    });

    // update map times
    filtered.times = times;
    const otherProviders = providers.find(p => p.provider !== provider);
    const newProviders = [];
    if (otherProviders) {
        newProviders.push(otherProviders);
    }
    newProviders.push(filtered);
    cache.set(ip, newProviders);

    if (times.length >= limit) {
        return false;
    }

    // request is allowed to we add current time
    times.push(Date.now());
    cache.set(ip, newProviders);

    return true;
};

module.exports = {
    allowed
};
