if (!Object.prototype.map) {
    Object.defineProperty(Object.prototype, "map", {
        value: function (callback) {
            const res = [];
            for (let i in this) {
                res.push(callback(this[i], i));
            }
            return res;
        }
    });
}