const BN = require('bn.js');
const BigNumber = require('bignumber.js');
export default {
  toolNumber(num_str) {
    num_str = num_str.toString();
    if (num_str.indexOf("+") != -1) {
      num_str = num_str.replace("+", "");
    }
    if (num_str.indexOf("E") != -1 || num_str.indexOf("e") != -1) {
      var resValue = "",
        power = "",
        result = null,
        dotIndex = 0,
        resArr = [],
        sym = "";
      var numStr = num_str.toString();
      if (numStr[0] == "-") {
        numStr = numStr.substr(1);
        sym = "-";
      }
      if (numStr.indexOf("E") != -1 || numStr.indexOf("e") != -1) {
        var regExp = new RegExp(
          "^(((\\d+.?\\d+)|(\\d+))[Ee]{1}((-(\\d+))|(\\d+)))$",
          "ig"
        );
        result = regExp.exec(numStr);
        if (result != null) {
          resValue = result[2];
          power = result[5];
          result = null;
        }
        if (!resValue && !power) {
          return false;
        }
        dotIndex = resValue.indexOf(".") == -1 ? 0 : resValue.indexOf(".");
        resValue = resValue.replace(".", "");
        resArr = resValue.split("");
        if (Number(power) >= 0) {
          var subres = resValue.substr(dotIndex);
          power = Number(power);
          for (var i = 0; i <= power - subres.length; i++) {
            resArr.push("0");
          }
          if (power - subres.length < 0) {
            resArr.splice(dotIndex + power, 0, ".");
          }
        } else {
          power = power.replace("-", "");
          power = Number(power);
          for (var i = 0; i < power - dotIndex; i++) {
            resArr.unshift("0");
          }
          var n = power - dotIndex >= 0 ? 1 : -(power - dotIndex);
          resArr.splice(n, 0, ".");
        }
      }
      resValue = resArr.join("");

      return sym + resValue;
    } else {
      return num_str;
    }
  },
  isNumber(val) {
    return typeof val === 'number' && isFinite(val)
  },
  safeDiv(a, b) {
    let c = new BigNumber(a).div(new BigNumber(b));
    return c;
  },
  safeMul(a, b) {
    let c = new BigNumber(a).multipliedBy(new BigNumber(b));
    return c.toNumber();
  },
  toFixed(x) {
    if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split('e-')[1]);
      if (e) {
        x = this.safeMul(x, Math.pow(10, e - 1));
        x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
      }
    } else {
      var e = parseInt(x.toString().split('+')[1]);
      if (e > 20) {
        e -= 20;
        x = this.safeDiv(x, Math.pow(10, e));
        x += (new Array(e + 1)).join('0');
      }
    }
    return x;
  },
  asDouble(value, factor, decimal) {
    if (!value) {
      return 0
    }
    let _factor = this.isNumber(factor) ? factor : 4;
    let _value;
    if (decimal) {
      _value = this.safeDiv(value.toString(), Math.pow(10,
        decimal)); //this.toFixed(Number(value) / Math.pow(10, decimal)).toString();
      _value = _value.toString();
      if (_value.indexOf('e') >= 0) {
        _value = this.toFixed(_value).toString();
      }
      return _value.indexOf('.') > 0 ? (_value.substr(0, _value.indexOf('.') + _factor + 1)) : (
        _value);
    } else {
      _value = value.toString(); //this.toFixed(value).toString();
      if (_value.indexOf('e') >= 0) {
        _value = this.toFixed(_value).toString();
      }
      return _value.indexOf('.') > 0 ? (_value.substr(0, _value.indexOf('.') + _factor + 1)) : (
        _factor > 0 ? _value + '.' + '0000000000000000000000000000000'.substr(0, _factor) : _value);
    }
  },
  numberFormat(number, digits, decimal) {
    decimal = decimal || 0;
    if (number > Math.pow(10, 6 + decimal)) {
      return this.asDouble(number, digits || 4, 6 + decimal) + "M";
    } else if (number > Math.pow(10, 3 + decimal)) {
      return this.asDouble(number, digits || 4, 3 + decimal) + "K";
    } else {
      return this.asDouble(number, digits || 4, decimal);
    }
  },
  formatDuring(mss) {
    var hours = parseInt((mss) / (1000 * 60 * 60));
    var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = parseInt((mss % (1000 * 60)) / 1000);
    hours = hours < 10 ? ('0' + hours) : hours;
    minutes = minutes < 10 ? ('0' + minutes) : minutes;
    seconds = seconds < 10 && seconds >= 0 ? ('0' + seconds) : seconds;
    return hours + " : " + minutes + " : " + seconds;
  },
  toThousands(num, digits) {
    digits = digits || 2
    num = (num || 0).toString();
    let number = 0,
      floatNum = '',
      intNum = '';
    if (num.indexOf('.') > 0) {
      number = num.indexOf('.');
      floatNum = num.substr(number + 1, digits); // arr.substr(form, length)
      intNum = num.substring(0, number); // arr.substring(start, end)
      if (floatNum.length < digits) {
        var fit_digits = digits - floatNum.length;
        for (var i = 0; i < fit_digits - length; i++) {
          floatNum += "0";
        }
      }
    } else {
      intNum = num;
      for (var i = 0; i < digits - length; i++) {
        floatNum += "0";
      }
    }
    let result = [],
      counter = 0;
    intNum = intNum.split('');
    for (let i = intNum.length - 1; i >= 0; i--) {
      counter++;
      result.unshift(intNum[i]);
      if (!(counter % 3) && i != 0) {
        result.unshift(',');
      }
    }
    return result.join('') + '.' + floatNum;
  },
  supplyRateAPY(supplyRatePerBlock) {
    supplyRatePerBlock = Number(supplyRatePerBlock) / 1e18;
    return ((Number(supplyRatePerBlock) * 5 * 60 * 24 + 1) ** (365 - 1) - 1) * 100;
  },
  borrowRateAPY(borrowRatePerBlock) {
    borrowRatePerBlock = Number(borrowRatePerBlock) / 1e18;
    return ((Number(borrowRatePerBlock) * 5 * 60 * 24 + 1) ** (365 - 1) - 1) * 100;
  }


}
