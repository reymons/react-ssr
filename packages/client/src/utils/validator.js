import { isPromiseLike } from "./is-promise-like";
import { isObject } from "./is-object";
import { KeyCollector } from "./key-collector";

const falsyValues = [undefined, null, 0, "", false];

function isPresent(value) {
  return !falsyValues.includes(value);
}
function Validator() {
  this.form = null;
  this.i = 0;
  this.errors = [];
  this.stack = [];
  this._err = "Invalid";
}

Validator.prototype.validate = function (data) {
  if (this.form) {
    if (!isObject(data)) {
      throw new Error(`Expected type of object. Got ${typeof data}`);
    }
    const keys = Object.keys(data);
    const cllctr = new KeyCollector(keys, this._doneCb);
    for (const key in data) {
      const validator = this.form[key];
      const value = data[key];
      validator.done((err) => cllctr.collect(key, err));
      validator.validate(value);
    }
    return;
  }

  const i = this.i++;
  const cb = this.stack[i];
  if (!cb) {
    if (this._doneCb) this._doneCb(null);
    this.i = 0;
    return;
  }
  const fn = (valid) => {
    if (valid) this.validate(data);
    else if (this._doneCb) {
      this._doneCb(this.errors[i]);
      this.i = 0;
    }
  };
  const result = cb(data);
  if (isPromiseLike(result)) {
    result.then(fn).catch(() => fn(false));
  } else {
    fn(result);
  }
};

Validator.prototype._assign = function (err, cb) {
  this.errors.push(err);
  this.stack.push(cb);
  return this;
};

Validator.prototype.done = function (cb) {
  this._doneCb = (err) => {
    cb(err === undefined ? this._err : err);
  };
  return this;
};

Validator.prototype.min = function (min, err) {
  return this._assign(err, (data) => data.length >= min);
};

Validator.prototype.max = function (max, err) {
  return this._assign(err, (data) => data.length <= max);
};

Validator.prototype.required = function (err) {
  return this._assign(err, isPresent);
};

Validator.prototype.async = function (cb, err) {
  return this.pipe((data) => {
    return new Promise((resolve, reject) => {
      cb(data, resolve, reject);
    });
  }, err);
};

Validator.prototype.pipe = function (cb, err) {
  return this._assign(err, cb);
};

Validator.prototype.formed = function (obj) {
  if (isObject(obj)) {
    this.form = obj;
    return this;
  }
  throw new Error(`Expected type of object. Got ${typeof obj}`);
};

Validator.prototype.err = function (err) {
  this._err = err;
  return this;
};

function v() {
  return new Validator();
}

export { v };
