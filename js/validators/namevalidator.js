function NameValidator(pattern) {
    this._pattern = pattern;
}
NameValidator.prototype.validate = function(nameToValidate) {
    var result = (!this._pattern)? true : !!(nameToValidate.match(this._pattern));
    return result ? {"isValid": true, "errorMessage": ""}:
     {"isValid": false, "errorMessage": "You have to enter your name"};
}

function buildNameValidator(pattern) {
    return new NameValidator(pattern);
}
exports.build = buildNameValidator;