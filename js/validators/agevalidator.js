function AgeValidator(pattern) {
    this._pattern = pattern;
}
AgeValidator.prototype.validate = function(ageToValidate) {
    var result = ageToValidate >= 18 && 
            ageToValidate  < 180 && 
            ((!this._pattern)? true : !!(ageToValidate.toString().match(this._pattern)));
    return result ? {"isValid": true, "errorMessage": ""}:
     {"isValid": false, "errorMessage": "Age is incorrect"};
}

function buildAgeValidator(pattern) {
    return new AgeValidator(pattern);
}
exports.build = buildAgeValidator;