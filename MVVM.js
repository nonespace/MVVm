function Vue(options) {
  this.$options = options;  //挂载到options
  var data = (this._data = this.$options.data); //挂载data名字任意
  observe(data); //添加get,set 数据劫持
  for (const key in data) {
    Object.defineProperty(this, key, {
      enumerable: true,
      get() {
        return this._data[key];
      },
      set(newVal) {
        this._data[key] = newVal;
      }
    });
  }
  /** 
   * vue => this[key] 取到值
   * 将数组中的key挂载到this上
  */ 
  initComputed.call(this);  //初始化监听属性
  new Complile(options.el, this);
}
function initComputed() {
  let vm = this;
  let {computed} = this.$options
  Object.keys(computed).forEach(key => {
    Object.defineProperty(vm, key,{
      get:typeof computed[key] === 'function'?computed[key]:computed[key].get,
    });
  });
  /**
   * Object.keys获得数组,遍历添加get 
   * 因为计算属性只需要获取值,它的依赖取决于里面 内部使用的 数据
   * 
  */
}
function Observe(data) {  //数据劫持类
  let dep = new Dep(); //初始化订阅
  for (const key in data) {
    let val = data[key];
    observe(val);
    Object.defineProperty(data, key, {
      enumerable: true, //可枚举
      get() {
        Dep.target && dep.addSub(Dep.target); //Dep.target也可以用全局变量代替
        return val;
      },
      set(newVal) {
        if (newVal === val) {
          return;
        }
        val = newVal;
        observe(newVal);
         /***
          vue 早期版本存在的问题,新添加的数组没有get,set,(现在修复了)
          对象处罚set时候,对新数据添加劫持
         */
        dep.notify();//发布
      }
    });
  }
}

function observe(data) {
  if (typeof data !== "object") {
    return;
  }
  return new Observe(data);
}

function Complile(el, vm) {
  /**
   编译模板类主要就是完成,
   MVVM实例数据的替换
  */
  vm.$el = document.querySelector(el);

  let fragment = document.createDocumentFragment();
  while ((child = vm.$el.firstChild)) {
    fragment.appendChild(child);
  }
  replace(fragment);
  function replace(fragment) {
    Array.from(fragment.childNodes).forEach(node => {
      let text = node.textContent;
      let reg = /\{\{(.*)\}\}/;
      if (node.nodeType === 3 && reg.test(text)) {
        let val = getVal(vm,RegExp.$1)
        new Watcher(vm, RegExp.$1, function(newVal) {
          node.textContent = text.replace(/\{\{(.*)\}\}/, newVal);
        });
        node.textContent = text.replace(/\{\{(.*)\}\}/, val);
      }
      if (node.nodeType === 1) {
        let attrs = node.attributes;
        Array.from(attrs).forEach(attr => {
          let { name } = attr;
          let exp = attr.value;
          if (name.indexOf("v-") === 0) {
            node.value = getVal(vm,exp);
          }
          new Watcher(vm, exp, function(newVal) {
            node.value = newVal;
          });
          node.addEventListener("input", function(e) {
            let newVal = e.target.value;
            let val = vm;
            let arr = exp.split(".");
            if (arr.length >= 2) {
              let valList = arr.map(key => {
                val = val[key];
                return val;
              });
              valList[valList.length - 2][arr.pop()] = newVal;
            } else {
              vm[exp] = newVal;
            }
          });
        });
      }
      if (node.childNodes) {
        replace(node);
      }
    });
  }

  vm.$el.appendChild(fragment);
}

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
  constructor(vm, exp, fn) {
    this.fn = fn;
    this.vm = vm;
    this.exp = exp;
    Dep.target = this;
    let val = vm;
    let arr = exp.split(".");
    arr.forEach(key => {
      val = val[key];
    });
    //触发get 方法,添加watcher
    Dep.target = null;
  }
  update() {
    let val = getVal(this.vm,this.exp)
    this.fn(val);
  }
}

function getVal(vm,exp){
  let val = vm;
  let arr = exp.split(".");
  arr.forEach(key => {
    val = val[key];
  });
  return val
}
