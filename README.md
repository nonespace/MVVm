
## 什么是数据双向绑定？
vue是一个mvvm框架，即数据双向绑定，即当数据发生变化的时候，视图也就发生变化，当视图发生变化的时候，数据也会跟着同步变化。这也算是vue的精髓之处了。数据双向绑定，一定是对于UI控件来说的。

前端常见的框架  Vue angular ，具体实现不一样 angular 使用  脏值检测 。  Vue使用的 数据劫持,发布订阅 基于**Object.defineProperty**，这也就导致不能兼容ie8一下低版本浏览器。



## Object.defineProperty

> [MDN详细描述](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)


## 发布订阅
  **发布订阅模式**顾名思义  分成两部分,发布和订阅.并且是先订阅,后发布

举个例子

```javascript
class Dep {
  //订阅,维护一个订阅数组
  constructor() {
    this.subs = [];
  }
  //订阅
  addSub(sub) {
    this.subs.push(sub);
  }
  //发布
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

```

