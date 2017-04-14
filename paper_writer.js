(function () {
  'use strict';
  window.PaperWriter = class PaperWriter extends PaperRender {
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
      this.type = obj.type || 'pen'; //笔型
      this.size = obj.size || 1; //笔的粗细
      this.color = obj.color || 'black';
      this.factor = 1;
      this.init();
    }

    //writer 类的 start, move, end 是根据事件处理信息，然后调用基类的方法

    init () {

      this.move = (e, last) => {
        e.preventDefault();
        this.current = this.getInfo(e);
        super.move();
        this.callback(this.current);
      };

      this.end = (e, last) => {
        e.preventDefault();
        this.current = this.getInfo(e, last);
        super.end();
        this.callback(this.current);
      };

      this.clear = () => {
        super.clear();
        this.current = this.getInfo({
          type: 'clear'
        });
        this.callback(this.current);
        this.type = 'pen';
      }

      this.back = () => {
        super.back();
        this.current = this.getInfo({
          type: 'back'
        });
        this.callback(this.current);
      }

      this.forward = () => {
        super.forward();
        this.current = this.getInfo({
          type: 'forward'
        });
        this.callback(this.current);
      }

      this.bindCanvas();
    }

    bindCanvas () {
      this.context = this.canvas.getContext('2d');
      this.context.save();

      this.canvas.addEventListener('touchstart', e => {
        let that = this;
        e.preventDefault();
        this.last = this.getInfo(e);
        super.start();
        this.callback(this.last);
        this.canvas.addEventListener('touchmove', this.move, {passive: false});
        document.addEventListener('touchend', function _self(e) {
          that.end(e, that.last);
          that.canvas.removeEventListener('touchmove', that.move, {passive: false});
          document.removeEventListener('touchend', _self, {passive: false});
        }, {passive: false});
      }, {passive: false});

      this.canvas.addEventListener('mousedown', e => {
        let that = this;
        e.preventDefault();
        this.last = this.getInfo(e);
        super.start();
        this.callback(this.last);
        this.canvas.addEventListener('mousemove', this.move, {passive: false});
        document.addEventListener('mouseup', function _self(e) {
          that.end(e, that.last);
          that.canvas.removeEventListener('mousemove', that.move, {passive: false});
          document.removeEventListener('mouseup', _self, {passive: false});
        }, {passive: false});
      }, {passive: false});
    }

    getInfo (e, last) {
      let x, y;
      if (e.type === 'touchend') { //touchend 和 mouseup 这两个事件比较奇葩，需要特殊处理
        x = this.last.x;
        y = this.last.y;
      } else if (e.type === 'mouseup') { //mouseup 有 x, y 坐标，不过先偷懒一下
        x = this.last.x;
        y = this.last.y;
      } else if (e.type.substring(0, 5) === 'touch') {
        x = e.touches[0].clientX - e.currentTarget.getBoundingClientRect().left;
        y = e.touches[0].clientY - e.currentTarget.getBoundingClientRect().top;
      } else if (e.type.substring(0, 5) === 'mouse' || e.type === 'click'){ //包含 mouse 事件与 click 事件
        x = e.clientX - e.currentTarget.getBoundingClientRect().left;
        y = e.clientY - e.currentTarget.getBoundingClientRect().top;
      }
      return new DrawInfo({
        width: this.width,
        height: this.height,
        timeStamp: new Date(),
        type: this.kv.get(e.type) || e.type,
        x: x,
        y: y,
        pen: {
          type: this.type,
          size: this.size,
          color: this.color,
          opacity: 1
        }
      });
    }
  };
})();
