class Dep {
  //订阅,维护一个订阅数组
  constructor() {
    this.subs = [];
  }
  addSub(sub) {
    this.subs.push(sub);
  }
  notify() {
    this.subs.forEach(item => {
      item.update();
    });
  }
}
//统一update方法
class Watcher {
  constructor(fn) {
    this.fn = fn;
  }
  update() {
    this.fn();
  }
}

let w1 = new Watcher(function() {
  console.log("1");
});
let w2 = new Watcher(function() {
  console.log("2");
});
let w3= new Watcher(function() {
  console.log("3");
});

let dep = new Dep();

// 添加订阅
dep.addSub(w1);
dep.addSub(w2);
dep.addSub(w3);
dep.notify();
