if (!Object.prototype.capitalizeFirst) {
    Object.defineProperty(String.prototype, "capitalizeFirst", {
        value: function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        }
    });
}

if (!Object.prototype.replaceAll) {
    Object.defineProperty(String.prototype, "replaceAll", {
        value: function (search, replacement) {
            return this.replace(new RegExp(search, "g"), replacement);
        }
    });
}