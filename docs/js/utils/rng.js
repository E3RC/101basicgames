var RNG = {
  seed: null,
  srand: function(s) { this.seed = s; },
  rand: function() {
    if (this.seed !== null) { this.seed = (this.seed * 1664525 + 1013904223) & 0x7fffffff; return this.seed / 0x7fffffff; }
    return Math.random();
  },
  int: function(min, max) { return Math.floor(this.rand() * (max - min + 1)) + min; },
  pick: function(arr) { return arr[this.int(0, arr.length - 1)]; },
  shuffle: function(arr) {
    for (var i = arr.length - 1; i > 0; i--) { var j = this.int(0, i); var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp; }
    return arr;
  }
};
