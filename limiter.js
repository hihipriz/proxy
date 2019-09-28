const cache = new Map();
const check = (ip) => {
    if (!cache.get(ip)) {
        cache.set(ip, [Date.now()]);
    } else {
        const times = cache.get(ip);

        // remove passed times. (can be made more efficient since it's a sorted list)
        times.filter((time) => {
            const hour = 60 * 60000;
            const passed = Date.now() - time >= hour;
            return !passed;
        });
        cache.set(ip, times);

        // todo: make this configurable
        if (times.length >= 10) {
            return false;
        }

        times.push(Date.now());
        cache.set(ip, times);

        return true;
    }
};

module.exports = {
    check,
};
