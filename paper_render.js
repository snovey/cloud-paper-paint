(function () {
  'use strict';
  window.PaperRender = class PaperRender {
    constructor() {
      this.kv = new Map([['touchstar', 'start'], ['touchmove', 'move'], ['touchend', 'end'], ['mousedown', 'start'], ['mousemove', 'move'], ['mouseup', 'end']]);
      this.backs = [];
      this.forwards = [];
    }

    //基类的 start, move, end 是根据信息进行操作

    start () {
      this.context.lineWidth = this.size;
      this.context.strokeStyle = this.color;
      switch (this.type) {
        case 'pen': //画笔
          break;
        case 'eraser': //橡皮
          // 这里需要设置 CSS 光标样式
          break;
        case 'rect': //矩形
        case 'ellipse': //椭圆
          this.corner = this.last;
          [this.duplicate, this.layer] = this.fork();
          break;
      }
    }

    move () {
      // console.log(last.x, last.y, current.x, current.y);
      switch (this.type) {
        case 'pen':
          this.drawLine(this.context, this.last, this.current);
          break;
        case 'eraser':
          this.context.clearRect(this.current.x*this.factor, this.current.y*this.factor, this.size*10*this.factor, this.size*10*this.factor);
          break;
        case 'rect':
          this.layer.clearRect(0, 0, this.duplicate.width, this.duplicate.height);
          this.layer.strokeRect(this.corner.x*this.factor, this.corner.y*this.factor, (this.current.x-this.corner.x)*this.factor, (this.current.y-this.corner.y)*this.factor);
          break;
        case 'ellipse':
          // this.layer.clearRect(0, 0, this.duplicate.width, this.duplicate.height);
          // this.context.beginPath();
          // this.layer.ellipse((this.current.x+this.corner.x)*this.factor/2, (this.current.y+this.corner.y)*this.factor/2, (this.current.x-this.corner.x)*this.factor, (this.current.y-this.corner.y)*this.factor, 0, 0, Math.PI*2);
          // this.context.closePath();
          // this.context.stroke();
          this.layer.clearRect(0, 0, this.duplicate.width, this.duplicate.height);
          this.drawEllipse(this.layer, this.corner.x*this.factor, this.corner.y*this.factor, (this.current.x-this.corner.x)*this.factor, (this.current.y-this.corner.y)*this.factor);
          break;
      }
      this.last = this.current;
    }

    end () {
      switch(this.type) {
        case 'rect':
          this.context.strokeRect(this.corner.x*this.factor, this.corner.y*this.factor, (this.current.x-this.corner.x)*this.factor, (this.current.y-this.corner.y)*this.factor);
          break;
        case 'ellipse':
          this.drawEllipse(this.context, this.corner.x*this.factor, this.corner.y*this.factor, (this.current.x-this.corner.x)*this.factor, (this.current.y-this.corner.y)*this.factor);
          break;
      }
      this.backs.push(this.context.getImageData(0, 0, this.width, this.height));
      this.forwards = [];
    }

    clear () {
      this.context.clearRect(0, 0, this.width, this.height);
      this.backs.push(this.context.getImageData(0, 0, this.width, this.height));
    }

    back () {
      this.forwards.push(this.backs.pop());
      this.context.clearRect(0, 0, this.width, this.height);
      this.context.putImageData(this.backs[this.backs.length-1], 0, 0);
    }

    forward () {
      this.backs.push(this.forwards.pop());
      this.context.clearRect(0, 0, this.width, this.height);
      this.context.putImageData(this.backs[this.backs.length-1], 0, 0);
    }

    writeText (e) {
      current = this.getInfo(e);
      let text = document.createElement('div');
      text.className = 'text';
      text.style.left = e.clientX+'px';
      text.style.top = e.clientY+'px';
      document.body.appendChild(text);
    }

    fork () {
      let duplicate, layer;
      let that = this;
      // console.log(this);
      duplicate = document.createElement('canvas');
      duplicate.width = this.width;
      duplicate.height = this.height;
      duplicate.style.position = 'absolute';
      duplicate.style.left = this.canvas.getBoundingClientRect().left+'px';
      duplicate.style.top = this.canvas.getBoundingClientRect().top+'px';
      duplicate.style['z-index'] = 1;
      layer = duplicate.getContext('2d');
      layer.lineWidth = this.size;
      layer.strokeStyle = this.color;
      document.body.appendChild(duplicate);

      duplicate.addEventListener('touchmove', this.move, {passive: false});
      document.addEventListener('touchend', function _self(e) {
        duplicate.removeEventListener('touchmove', that.move, {passive: false});
        document.removeEventListener('touchend', _self, {passive: false});
        document.body.removeChild(duplicate);
      }, {passive: false});

      duplicate.addEventListener('mousemove', this.move, {passive: false});
      document.addEventListener('mouseup', function _self(e) {
        duplicate.removeEventListener('mousemove', that.move, {passive: false});
        document.removeEventListener('mouseup', _self, {passive: false});
        document.body.removeChild(duplicate);
      }, {passive: false});

      return [duplicate, layer];
    }

    drawLine (context, first, last) {
      context.beginPath();
      context.moveTo(this.factor*first.x, this.factor*first.y);
      context.lineTo(this.factor*last.x, this.factor*last.y);
      context.stroke();
      context.closePath();
    }

    drawEllipse(context, cx, cy, rx, ry) {
      context.save(); // save state
      context.beginPath();

      context.translate(cx-rx, cy-ry);
      context.scale(rx, ry);
      context.arc(1, 1, 1, 0, 2 * Math.PI, false);

      context.restore(); // restore to original state
      context.stroke();
    }

  };
})();
