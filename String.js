if (!String.prototype.capitalizeFirst) {
    Object.defineProperty(String.prototype, "capitalizeFirst", {
        value: function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        }
    });
}

if (!String.prototype.replaceAll) {
    Object.defineProperty(String.prototype, "replaceAll", {
        value: function (search, replacement) {
            return this.replace(new RegExp(search, "g"), replacement);
        }
    });
}