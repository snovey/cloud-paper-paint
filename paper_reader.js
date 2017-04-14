(function () {
  'use strict';
  window.PaperReader = class PaperReader extends PaperRender {
    constructor(obj) {
      super();
      this.width  = obj.width;
      this.height = obj.height;
      this.callback = obj.callback;
      let node = document.createElement('canvas');
      node.width = this.width;
      node.height = this.height;
      typeof obj.el === 'string' ? document.querySelector(obj.el).appendChild(node) : obj.el.appendChild(node);
      this.canvas = node;
      const canvas = node;
      this.context = canvas.getContext('2d');
    }

    dispatch (di) {
      let current, last; //记录上一次与本次事件的坐标
      this.type = di.pen.type;
      this.size = di.pen.size;
      this.color = di.pen.color;
      this.factor = Math.min(this.width/di.width, this.height/di.height);
      switch(di.type) {
        case ('start'):
          this.last = di;
          super.start();
          break;
        case ('move'):
          this.current = di;
          super.move();
          this.last = this.current;
          break;
        case ('end'):
          this.current = di;
          super.end();
          break;
        case ('clear'):
          super.clear();
          break;
        case ('back'):
          super.back();
          break;
        case ('forward'):
          super.forward();
          break;
      }
    }
  };
})();
