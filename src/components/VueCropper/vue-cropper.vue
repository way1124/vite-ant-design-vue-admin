<template>
  <div class="vue-cropper" ref="cropper" @mouseover="scaleImg" @mouseout="cancelScale">
    <div class="cropper-box" v-if="imgs">
      <div
        class="cropper-box-canvas"
        v-show="!loading"
        :style="{
          width: trueWidth + 'px',
          height: trueHeight + 'px',
          transform: 'scale(' + scale + ',' + scale + ') ' + 'translate3d(' + x / scale + 'px,' + y / scale + 'px,' + '0)' + 'rotateZ(' + rotate * 90 + 'deg)',
        }"
      >
        <img :src="imgs" alt="cropper-img" ref="cropperImg" />
      </div>
    </div>
    <div
      class="cropper-drag-box"
      :class="{
        'cropper-move': move && !crop,
        'cropper-crop': crop,
        'cropper-modal': cropping,
      }"
      @mousedown="startMove"
      @touchstart="startMove"
    ></div>
    <div
      v-show="cropping"
      class="cropper-crop-box"
      :style="{
        width: cropW + 'px',
        height: cropH + 'px',
        transform:
          'translate3d(' + cropOffsertX + 'px,' + cropOffsertY + 'px,' + '0)',
      }"
    >
      <span class="cropper-view-box">
        <img
          :style="{
            width: trueWidth + 'px',
            height: trueHeight + 'px',
            transform: 'scale(' + scale + ',' + scale + ') ' + 'translate3d(' + (x - cropOffsertX) / scale + 'px,' + (y - cropOffsertY) / scale + 'px,' + '0)' + 'rotateZ(' + rotate * 90 + 'deg)',
          }"
          :src="imgs"
          alt="cropper-img"
        />
      </span>
      <span class="cropper-face cropper-move" @mousedown="cropMove" @touchstart="cropMove"></span>
      <span class="crop-info" v-if="info" :style="{ top: cropInfo.top }">{{ cropInfo.width }} × {{ cropInfo.height }}</span>
      <span v-if="!fixedBox">
        <span class="crop-line line-w" @mousedown="changeCropSize($event, false, true, 0, 1)" @touchstart="changeCropSize($event, false, true, 0, 1)"></span>
        <span class="crop-line line-a" @mousedown="changeCropSize($event, true, false, 1, 0)" @touchstart="changeCropSize($event, true, false, 1, 0)"></span>
        <span class="crop-line line-s" @mousedown="changeCropSize($event, false, true, 0, 2)" @touchstart="changeCropSize($event, false, true, 0, 2)"></span>
        <span class="crop-line line-d" @mousedown="changeCropSize($event, true, false, 2, 0)" @touchstart="changeCropSize($event, true, false, 2, 0)"></span>
        <span class="crop-point point1" @mousedown="changeCropSize($event, true, true, 1, 1)" @touchstart="changeCropSize($event, true, true, 1, 1)"></span>
        <span class="crop-point point2" @mousedown="changeCropSize($event, false, true, 0, 1)" @touchstart="changeCropSize($event, false, true, 0, 1)"></span>
        <span class="crop-point point3" @mousedown="changeCropSize($event, true, true, 2, 1)" @touchstart="changeCropSize($event, true, true, 2, 1)"></span>
        <span class="crop-point point4" @mousedown="changeCropSize($event, true, false, 1, 0)" @touchstart="changeCropSize($event, true, false, 1, 0)"></span>
        <span class="crop-point point5" @mousedown="changeCropSize($event, true, false, 2, 0)" @touchstart="changeCropSize($event, true, false, 2, 0)"></span>
        <span class="crop-point point6" @mousedown="changeCropSize($event, true, true, 1, 2)" @touchstart="changeCropSize($event, true, true, 1, 2)"></span>
        <span class="crop-point point7" @mousedown="changeCropSize($event, false, true, 0, 2)" @touchstart="changeCropSize($event, false, true, 0, 2)"></span>
        <span class="crop-point point8" @mousedown="changeCropSize($event, true, true, 2, 2)" @touchstart="changeCropSize($event, true, true, 2, 2)"></span>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, Events, nextTick, onDeactivated, onMounted, PropType, reactive, ref, toRefs, watch } from "vue";
import exifmin from "./exif";

export default defineComponent({
  name: "vue-cropper",
  props: {
    img: {
      type: [String, Blob, null, File] as PropType<any>,
      default: "",
    },
    // 输出图片压缩比
    outputSize: {
      type: Number as PropType<Number>,
      default: 1,
    },
    outputType: {
      type: String as PropType<String>,
      default: "jpeg",
    },
    info: {
      type: Boolean as PropType<Boolean>,
      default: true,
    },
    // 是否开启滚轮放大缩小
    canScale: {
      type: Boolean as PropType<Boolean>,
      default: true,
    },
    // 是否自成截图框
    autoCrop: {
      type: Boolean as PropType<Boolean>,
      default: false,
    },
    autoCropWidth: {
      type: Number as PropType<number>,
      default: 0,
    },
    autoCropHeight: {
      type: Number as PropType<number>,
      default: 0,
    },
    // 是否开启固定宽高比
    fixed: {
      type: Boolean as PropType<Boolean>,
      default: false,
    },
    // 宽高比 w/h
    fixedNumber: {
      type: Array as PropType<Array<Number>>,
      default: () => {
        return [1, 1];
      },
    },
    // 固定大小 禁止改变截图框大小
    fixedBox: {
      type: Boolean as PropType<Boolean>,
      default: false,
    },
    // 输出截图是否缩放
    full: {
      type: Boolean as PropType<Boolean>,
      default: false,
    },
    // 是否可以拖动图片
    canMove: {
      type: Boolean as PropType<Boolean>,
      default: true,
    },
    // 是否可以拖动截图框
    canMoveBox: {
      type: Boolean as PropType<Boolean>,
      default: true,
    },
    // 上传图片按照原始比例显示
    original: {
      type: Boolean as PropType<Boolean>,
      default: false,
    },
    // 截图框能否超过图片
    centerBox: {
      type: Boolean as PropType<Boolean>,
      default: false,
    },
    // 是否根据dpr输出高清图片
    high: {
      type: Boolean as PropType<Boolean>,
      default: true,
    },
    // 截图框展示宽高类型
    infoTrue: {
      type: Boolean as PropType<Boolean>,
      default: false,
    },
    // 可以压缩图片宽高  默认不超过200
    maxImgSize: {
      type: Number as PropType<number>,
      default: 2000,
    },
    // 倍数  可渲染当前截图框的n倍 0 - 1000;
    enlarge: {
      type: Number as PropType<number>,
      default: 1,
    },

    // 自动预览的固定宽度
    preW: {
      type: Number as PropType<number>,
      default: 0,
    },
    /*
      图片布局方式 mode 实现和css背景一样的效果
      contain  居中布局 默认不会缩放 保证图片在容器里面 mode: 'contain'
      cover    拉伸布局 填充整个容器  mode: 'cover'
      如果仅有一个数值被给定，这个数值将作为宽度值大小，高度值将被设定为auto。 mode: '50px'
      如果有两个数值被给定，第一个将作为宽度值大小，第二个作为高度值大小。 mode: '50px 60px'
    */
    mode: {
      type: String as PropType<String>,
      default: "contain",
    },
    //限制最小区域,可传1以上的数字和字符串，限制长宽都是这么大
    // 也可以传数组[90,90]
    limitMinSize: {
      type: [Number, Array, String] as PropType<(number | string)[]>,
      default: () => {
        return 10;
      },
    },
		type: {
			type: String as PropType<string>,
			default: ''
		}
  },

  setup(props, ctx) {
    const data = reactive({
      // 容器高宽
      w: 0,
      h: 0,
      // 图片缩放比例
      scale: 1,
      // 图片偏移x轴
      x: 0,
      // 图片偏移y轴
      y: 0,
      // 图片加载
      loading: true,
      // 图片真实宽度
      trueWidth: 0,
      // 图片真实高度
      trueHeight: 0,
      move: true,
      // 移动的x
      moveX: 0,
      // 移动的y
      moveY: 0,
      // 开启截图
      crop: false,
      // 正在截图
      cropping: false,
      // 裁剪框大小
      cropW: 0,
      cropH: 0,
      cropOldW: 0,
      cropOldH: 0,
      // 判断是否能够改变
      canChangeX: false,
      canChangeY: false,
      // 改变的基准点
      changeCropTypeX: 1,
      changeCropTypeY: 1,
      // 裁剪框的坐标轴
      cropX: 0,
      cropY: 0,
      cropChangeX: 0,
      cropChangeY: 0,
      cropOffsertX: 0,
      cropOffsertY: 0,
      // 支持的滚动事件
      support: "",
      // 移动端手指缩放
      touches: [],
      touchNow: false,
      // 图片旋转
      rotate: 0,
      isIos: false,
      orientation: 0,
      imgs: "",
      // 图片缩放系数
      coe: 0.2,
      // 是否正在多次缩放
      scaling: false,
      scalingSet: 0,
      coeStatus: "",
      // 控制emit触发频率
      isCanShow: true,
    });

		const cropper = ref()

		const cropInfo = computed(() => {
      let obj = {
				top: '0px',
				width: 0,
				height: 0
			};
      obj.top = data.cropOffsertY > 21 ? "-21px" : "0px";
      obj.width = data.cropW > 0 ? data.cropW : 0;
      obj.height = data.cropH > 0 ? data.cropH : 0;
      if (props.infoTrue) {
        let dpr = 1;
        if (props.high && !props.full) {
          dpr = window.devicePixelRatio;
        }
        if ((props.enlarge.toString() !== "1") && !props.full) {
          dpr = Math.abs(Number(props.enlarge));
        }
        obj.width = obj.width * dpr;
        obj.height = obj.height * dpr;
        if (props.full) {
          obj.width = obj.width / data.scale;
          obj.height = obj.height / data.scale;
        }
      }
      obj.width = +obj.width.toFixed(0);
      obj.height = +obj.height.toFixed(0);
      return obj;
    })

    const isIE = computed(() => {
      var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
      const isIE = !!(window as any).ActiveXObject || 'ActiveXObject' in window; //判断是否IE浏览器
      return isIE;
    })

    const passive = computed(() => {
      return isIE ? null : {
        passive: false
      }
    })

		const getVersion = (name: string) => {
      var arr = navigator.userAgent.split(' ');
      var chromeVersion = '';
      let result = [];
      const reg = new RegExp(name, 'i')
      for(var i=0;i < arr.length;i++){
        if(reg.test(arr[i]))
          chromeVersion = arr[i]
      }
      if(chromeVersion){
          result = chromeVersion.split('/')[1].split('.');
      } else {
          result = ['0', '0', '0'];
      }
      return result
    }
    const checkOrientationImage = (img: any, orientation: number, width: number, height: number) => {
      // 如果是 chrome内核版本在81 safari 在 605 以上不处理图片旋转
      // alert(navigator.userAgent)
      if (Number(getVersion('chrome')[0]) >= 81) {
        orientation = -1
      } else {
        if (Number(getVersion('safari')[0]) >= 605 ) {
          const safariVersion = getVersion('version').map(r => Number(r))
          if (safariVersion[0] > 13 && safariVersion[1] > 1) {
              orientation = -1
          }
        } else {
          //  判断 ios 版本进行处理
         // 针对 ios 版本大于 13.4的系统不做图片旋转
         const isIos  = navigator.userAgent.toLowerCase().match(/cpu iphone os (.*?) like mac os/)
         if (isIos) {
           let version = isIos[1].split('_').map(r => Number(r))
           if (version[0] > 13 ||  (version[0] >= 13 && version[1] >= 4)) {
             orientation = -1
           }
         }
        }
      }

      // alert(`当前处理的orientation${orientation}`)
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      ctx?.save();

      switch (orientation) {
        case 2:
          canvas.width = width;
          canvas.height = height;
          // horizontal flip
          ctx?.translate(width, 0);
          ctx?.scale(-1, 1);
          break;
        case 3:
          canvas.width = width;
          canvas.height = height;
          //180 graus
          ctx?.translate(width / 2, height / 2);
          ctx?.rotate((180 * Math.PI) / 180);
          ctx?.translate(-width / 2, -height / 2);
          break;
        case 4:
          canvas.width = width;
          canvas.height = height;
          // vertical flip
          ctx?.translate(0, height);
          ctx?.scale(1, -1);
          break;
        case 5:
          // vertical flip + 90 rotate right
          canvas.height = width;
          canvas.width = height;
          ctx?.rotate(0.5 * Math.PI);
          ctx?.scale(1, -1);
          break;
        case 6:
          canvas.width = height;
          canvas.height = width;
          //90 graus
          ctx?.translate(height / 2, width / 2);
          ctx?.rotate((90 * Math.PI) / 180);
          ctx?.translate(-width / 2, -height / 2);
          break;
        case 7:
          // horizontal flip + 90 rotate right
          canvas.height = width;
          canvas.width = height;
          ctx?.rotate(0.5 * Math.PI);
          ctx?.translate(width, -height);
          ctx?.scale(-1, 1);
          break;
        case 8:
          canvas.height = width;
          canvas.width = height;
          //-90 graus
          ctx?.translate(height / 2, width / 2);
          ctx?.rotate((-90 * Math.PI) / 180);
          ctx?.translate(-width / 2, -height / 2);
          break;
        default:
          canvas.width = width;
          canvas.height = height;
      }

      ctx?.drawImage(img, 0, 0, width, height);
      ctx?.restore();
      canvas.toBlob(
        blob => {
          let url = URL.createObjectURL(blob);
          URL.revokeObjectURL(data.imgs)
          data.imgs = url;
        },
        "image/" + props.outputType,
        1
      );
    }

    // checkout img
    const checkedImg = () => {
      if (props.img === null || props.img === '') {
        data.imgs = ''
        clearCrop()
        return
      }
      data.loading = true;
      data.scale = 1;
      data.rotate = 0;
      clearCrop();
      let img = new Image();
      img.onload = () => {
        if (props.img === "") {
          ctx.emit("imgLoad", "error");
          ctx.emit("img-load", "error");
          return false;
        }

        let width = img.width;
        let height = img.height;
        exifmin.getData(img).then((item: any) => {
          data.orientation = item.orientation || 1;
          let max = Number(props.maxImgSize);
          if (!data.orientation && (width < max) && (height < max)) {
            data.imgs = props.img;
            return;
          }

          if (width > max) {
            height = (height / width) * max;
            width = max;
          }

          if (height > max) {
            width = (width / height) * max;
            height = max;
          }
          checkOrientationImage(img, data.orientation, width, height);
        });
      };

      img.onerror = () => {
        ctx.emit("imgLoad", "error");
        ctx.emit("img-load", "error");
      };

      // 判断如果不是base64图片 再添加crossOrigin属性，否则会导致iOS低版本(10.2)无法显示图片
      if (props.img.substr(0, 4) !== "data") {
        img.crossOrigin = "";
      }

      if (isIE) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
          var url = URL.createObjectURL(this.response);
          img.src = url;
        };
        xhr.open("GET", props.img, true);
        xhr.responseType = "blob";
        xhr.send();
      } else {
        img.src = props.img;
      }
    }
    // 当按下鼠标键
    const startMove = (e: any) => {
      e.preventDefault();
      // 如果move 为true 表示当前可以拖动
      if (data.move && !data.crop) {
        if (!props.canMove) {
          return false;
        }
        // 开始移动
        data.moveX = ('clientX' in e ? e.clientX : e.touches[0].clientX) - data.x;
        data.moveY = ('clientY' in e ? e.clientY : e.touches[0].clientY) - data.y;
        if (e.touches) {
          window.addEventListener("touchmove", moveImg);
          window.addEventListener("touchend", leaveImg);
          if (e.touches.length == 2) {
            // 记录手指刚刚放上去
            data.touches = e.touches;
            window.addEventListener("touchmove", touchScale);
            window.addEventListener("touchend", cancelTouchScale);
          }
        } else {
          window.addEventListener("mousemove", moveImg);
          window.addEventListener("mouseup", leaveImg);
        }
        // 触发图片移动事件
        ctx.emit("imgMoving", {
          moving: true,
          axis: getImgAxis()
        });
        ctx.emit("img-moving", {
          moving: true,
          axis: getImgAxis()
        });
      } else {
        // 截图ing
        data.cropping = true;
        // 绑定截图事件
        window.addEventListener("mousemove", createCrop);
        window.addEventListener("mouseup", endCrop);
        window.addEventListener("touchmove", createCrop);
        window.addEventListener("touchend", endCrop);
        data.cropOffsertX = e.offsetX
          ? e.offsetX
          : e.touches[0].pageX - cropper.value.offsetLeft;
        data.cropOffsertY = e.offsetY
          ? e.offsetY
          : e.touches[0].pageY - cropper.value.offsetTop;
        data.cropX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
        data.cropY = 'clientY' in e ? e.clientY : e.touches[0].clientY;
        data.cropChangeX = data.cropOffsertX;
        data.cropChangeY = data.cropOffsertY;
        data.cropW = 0;
        data.cropH = 0;
      }
    }

    // 移动端缩放
    const touchScale = (e: TouchEvent) => {
      e.preventDefault();
      let scale = data.scale;
      // 记录变化量
      // 第一根手指
      var oldTouch1 = {
        x: data.touches[0]['clientX'],
        y: data.touches[0]['clientY']
      };
      var newTouch1 = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
      // 第二根手指
      var oldTouch2 = {
        x: data.touches[1]['clientX'],
        y: data.touches[1]['clientY']
      };
      var newTouch2 = {
        x: e.touches[1].clientX,
        y: e.touches[1].clientY
      };
      var oldL = Math.sqrt(
        Math.pow(oldTouch1.x - oldTouch2.x, 2) +
          Math.pow(oldTouch1.y - oldTouch2.y, 2)
      );
      var newL = Math.sqrt(
        Math.pow(newTouch1.x - newTouch2.x, 2) +
          Math.pow(newTouch1.y - newTouch2.y, 2)
      );
      var cha = newL - oldL;
      // 根据图片本身大小 决定每次改变大小的系数, 图片越大系数越小
      // 1px - 0.2
      var coe = 1;
      coe =
        coe / data.trueWidth > coe / data.trueHeight
          ? coe / data.trueHeight
          : coe / data.trueWidth;
      coe = coe > 0.1 ? 0.1 : coe;
      var num = coe * cha;
      if (!data.touchNow) {
        data.touchNow = true;
        if (cha > 0) {
          scale += Math.abs(num);
        } else if (cha < 0) {
          scale > Math.abs(num) ? (scale -= Math.abs(num)) : scale;
        }
        data.touches = e.touches as any;
        setTimeout(() => {
          data.touchNow = false;
        }, 8);
        if (!checkoutImgAxis(data.x, data.y, scale)) {
          return false;
        }
        data.scale = scale;
      }
    }

    const cancelTouchScale = (e: TouchEvent) => {
      window.removeEventListener("touchmove", touchScale);
    }

    // 移动图片
    const moveImg = (e: any) => {
      e.preventDefault();
      if (e.touches && e.touches.length === 2) {
        data.touches = e.touches;
        window.addEventListener("touchmove", touchScale);
        window.addEventListener("touchend", cancelTouchScale);
        window.removeEventListener("touchmove", moveImg);
        return false;
      }
      let nowX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
      let nowY = 'clientY' in e ? e.clientY : e.touches[0].clientY;

      let changeX = 0, changeY = 0;
      changeX = nowX - data.moveX;
      changeY = nowY - data.moveY;

      nextTick(() => {
        if (props.centerBox) {
          let axis = getImgAxis(changeX, changeY, data.scale);
          let cropAxis = getCropAxis();
          let imgW = data.trueHeight * data.scale;
          let imgH = data.trueWidth * data.scale;
          let maxLeft, maxTop, maxRight, maxBottom;
          switch (data.rotate) {
            case 1:
            case -1:
            case 3:
            case -3:
              maxLeft =
                data.cropOffsertX -
                (data.trueWidth * (1 - data.scale)) / 2 +
                (imgW - imgH) / 2;
              maxTop =
                data.cropOffsertY -
                (data.trueHeight * (1 - data.scale)) / 2 +
                (imgH - imgW) / 2;
              maxRight = maxLeft - imgW + data.cropW;
              maxBottom = maxTop - imgH + data.cropH;
              break;
            default:
              maxLeft =
                data.cropOffsertX - (data.trueWidth * (1 - data.scale)) / 2;
              maxTop =
                data.cropOffsertY - (data.trueHeight * (1 - data.scale)) / 2;
              maxRight = maxLeft - imgH + data.cropW;
              maxBottom = maxTop - imgW + data.cropH;
              break;
          }

          // 图片左边 图片不能超过截图框
          if (axis.x1 >= cropAxis.x1) {
            changeX = maxLeft;
          }

          // 图片上边 图片不能超过截图框
          if (axis.y1 >= cropAxis.y1) {
            changeY = maxTop;
          }

          // 图片右边
          if (axis.x2 <= cropAxis.x2) {
            changeX = maxRight;
          }

          // 图片下边
          if (axis.y2 <= cropAxis.y2) {
            changeY = maxBottom;
          }
        }
        data.x = changeX;
        data.y = changeY;
        // 触发图片移动事件
        ctx.emit("imgMoving", {
          moving: true,
          axis: getImgAxis()
        });
        ctx.emit("img-moving", {
          moving: true,
          axis: getImgAxis()
        });
      });
    }
    // 移动图片结束
    const leaveImg = (e: any) => {
      window.removeEventListener("mousemove", moveImg);
      window.removeEventListener("touchmove", moveImg);
      window.removeEventListener("mouseup", leaveImg);
      window.removeEventListener("touchend", leaveImg);
      // 触发图片移动事件
      ctx.emit("imgMoving", {
        moving: false,
        axis: getImgAxis()
      });
      ctx.emit("img-moving", {
        moving: false,
        axis: getImgAxis()
      });
    }
    // 缩放图片
    const scaleImg = () => {
      if (props.canScale) {
				const p = passive.value || { passive: false }
        window.addEventListener(data.support, changeSize, p);
      }
    }
    // 移出框
    const cancelScale = () => {
      if (props.canScale) {
        window.removeEventListener(data.support, changeSize);
      }
    }
    // 改变大小函数
    const changeSize = (e: any) => {
      e.preventDefault();
      let scale = data.scale;
      var change = e.deltaY || e.wheelDelta;
      // 根据图片本身大小 决定每次改变大小的系数, 图片越大系数越小
      var isFirefox = navigator.userAgent.indexOf("Firefox");
      change = isFirefox > 0 ? change * 30 : change;
      // 修复ie的滚动缩放
      if (isIE) {
        change = -change;
      }
      // 1px - 0.2
      let coe = data.coe;
      coe =
        coe / data.trueWidth > coe / data.trueHeight
          ? coe / data.trueHeight
          : coe / data.trueWidth;
      let num = coe * change;
      num < 0
        ? (scale += Math.abs(num))
        : scale > Math.abs(num)
        ? (scale -= Math.abs(num))
        : scale;
      // 延迟0.1s 每次放大大或者缩小的范围
      let status = num < 0 ? "add" : "reduce";
      if (status !== data.coeStatus) {
        data.coeStatus = status;
        data.coe = 0.2;
      }
      if (!data.scaling) {
        data.scalingSet = setTimeout(() => {
          data.scaling = false;
          data.coe = data.coe += 0.01;
        }, 50);
      }
      data.scaling = true;
      if (!checkoutImgAxis(data.x, data.y, scale)) {
        return false;
      }
      data.scale = scale;
    }

    // 修改图片大小函数
    const changeScale = (num: number) => {
      let scale = data.scale;
      num = num || 1;
      let coe = 20;
      coe =
        coe / data.trueWidth > coe / data.trueHeight
          ? coe / data.trueHeight
          : coe / data.trueWidth;
      num = num * coe;
      num > 0
        ? (scale += Math.abs(num))
        : scale > Math.abs(num)
        ? (scale -= Math.abs(num))
        : scale;
      if (!checkoutImgAxis(data.x, data.y, scale)) {
        return false;
      }
      data.scale = scale;
    }
    // 创建截图框
    const createCrop = (e: any) => {
      e.preventDefault();
      // 移动生成大小
      var nowX = 'clientX' in e ? e.clientX : e.touches ? e.touches[0].clientX : 0;
      var nowY = 'clientY' in e ? e.clientY : e.touches ? e.touches[0].clientY : 0;
      nextTick(() => {
        var fw = nowX - data.cropX;
        var fh = nowY - data.cropY;
        if (fw > 0) {
          data.cropW =
            fw + data.cropChangeX > data.w ? data.w - data.cropChangeX : fw;
          data.cropOffsertX = data.cropChangeX;
        } else {
          data.cropW =
            data.w - data.cropChangeX + Math.abs(fw) > data.w
              ? data.cropChangeX
              : Math.abs(fw);
          data.cropOffsertX =
            data.cropChangeX + fw > 0 ? data.cropChangeX + fw : 0;
        }

        if (!props.fixed) {
          if (fh > 0) {
            data.cropH =
              fh + data.cropChangeY > data.h ? data.h - data.cropChangeY : fh;
            data.cropOffsertY = data.cropChangeY;
          } else {
            data.cropH =
              data.h - data.cropChangeY + Math.abs(fh) > data.h
                ? data.cropChangeY
                : Math.abs(fh);
            data.cropOffsertY =
              data.cropChangeY + fh > 0 ? data.cropChangeY + fh : 0;
          }
        } else {
					const fixedNumber = props.fixedNumber.map(r => Number(r))
          var fixedHeight =
            (data.cropW / fixedNumber[0]) * fixedNumber[1];
          if (fixedHeight + data.cropOffsertY > data.h) {
            data.cropH = data.h - data.cropOffsertY;
            data.cropW =
              (data.cropH / fixedNumber[1]) * fixedNumber[0];
            if (fw > 0) {
              data.cropOffsertX = data.cropChangeX;
            } else {
              data.cropOffsertX = data.cropChangeX - data.cropW;
            }
          } else {
            data.cropH = fixedHeight;
          }
          data.cropOffsertY = data.cropOffsertY;
        }
      });
    }

    // 改变截图框大小
    const changeCropSize = (e: any, w: boolean, h: boolean, typeW: number, typeH: number) => {
      e.preventDefault();
      window.addEventListener("mousemove", changeCropNow);
      window.addEventListener("mouseup", changeCropEnd);
      window.addEventListener("touchmove", changeCropNow);
      window.addEventListener("touchend", changeCropEnd);
      data.canChangeX = w;
      data.canChangeY = h;
      data.changeCropTypeX = typeW;
      data.changeCropTypeY = typeH;
      data.cropX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
      data.cropY = 'clientY' in e ? e.clientY : e.touches[0].clientY;
      data.cropOldW = data.cropW;
      data.cropOldH = data.cropH;
      data.cropChangeX = data.cropOffsertX;
      data.cropChangeY = data.cropOffsertY;
      if (props.fixed) {
        if (data.canChangeX && data.canChangeY) {
          data.canChangeY = false;
        }
      }
      ctx.emit('change-crop-size', {
        width: data.cropW,
        height: data.cropH
      })
    }

    // 正在改变
    const changeCropNow = (e: any) => {
      e.preventDefault();
      var nowX = 'clientX' in e ? e.clientX : e.touches ? e.touches[0].clientX : 0;
      var nowY = 'clientY' in e ? e.clientY : e.touches ? e.touches[0].clientY : 0;
      // 容器的宽高
      let wrapperW = data.w;
      let wrapperH = data.h;

      // 不能超过的坐标轴
      let minX = 0;
      let minY = 0;

      if (props.centerBox) {
        let axis = getImgAxis();
        let imgW = axis.x2;
        let imgH = axis.y2;
        minX = axis.x1 > 0 ? axis.x1 : 0;
        minY = axis.y1 > 0 ? axis.y1 : 0;
        if (wrapperW > imgW) {
          wrapperW = imgW;
        }

        if (wrapperH > imgH) {
          wrapperH = imgH;
        }
      }

      nextTick(() => {
        var fw = nowX - data.cropX;
        var fh = nowY - data.cropY;
        if (data.canChangeX) {
          if (data.changeCropTypeX === 1) {
            if (data.cropOldW - fw > 0) {
              data.cropW =
                wrapperW - data.cropChangeX - fw <= wrapperW - minX
                  ? data.cropOldW - fw
                  : data.cropOldW + data.cropChangeX - minX;
              data.cropOffsertX =
                wrapperW - data.cropChangeX - fw <= wrapperW - minX
                  ? data.cropChangeX + fw
                  : minX;
            } else {
              data.cropW =
                Math.abs(fw) + data.cropChangeX <= wrapperW
                  ? Math.abs(fw) - data.cropOldW
                  : wrapperW - data.cropOldW - data.cropChangeX;
              data.cropOffsertX = data.cropChangeX + data.cropOldW;
            }
          } else if (data.changeCropTypeX === 2) {
            if (data.cropOldW + fw > 0) {
              data.cropW =
                data.cropOldW + fw + data.cropOffsertX <= wrapperW
                  ? data.cropOldW + fw
                  : wrapperW - data.cropOffsertX;
              data.cropOffsertX = data.cropChangeX;
            } else {
              // 右侧坐标抽 超过左侧
              data.cropW =
                wrapperW - data.cropChangeX + Math.abs(fw + data.cropOldW) <=
                wrapperW - minX
                  ? Math.abs(fw + data.cropOldW)
                  : data.cropChangeX - minX;
              data.cropOffsertX =
                wrapperW - data.cropChangeX + Math.abs(fw + data.cropOldW) <=
                wrapperW - minX
                  ? data.cropChangeX - Math.abs(fw + data.cropOldW)
                  : minX;
            }
          }
        }

        if (data.canChangeY) {
          if (data.changeCropTypeY === 1) {
            if (data.cropOldH - fh > 0) {
              data.cropH =
                wrapperH - data.cropChangeY - fh <= wrapperH - minY
                  ? data.cropOldH - fh
                  : data.cropOldH + data.cropChangeY - minY;
              data.cropOffsertY =
                wrapperH - data.cropChangeY - fh <= wrapperH - minY
                  ? data.cropChangeY + fh
                  : minY;
            } else {
              data.cropH =
                Math.abs(fh) + data.cropChangeY <= wrapperH
                  ? Math.abs(fh) - data.cropOldH
                  : wrapperH - data.cropOldH - data.cropChangeY;
              data.cropOffsertY = data.cropChangeY + data.cropOldH;
            }
          } else if (data.changeCropTypeY === 2) {
            if (data.cropOldH + fh > 0) {
              data.cropH =
                data.cropOldH + fh + data.cropOffsertY <= wrapperH
                  ? data.cropOldH + fh
                  : wrapperH - data.cropOffsertY;
              data.cropOffsertY = data.cropChangeY;
            } else {
              data.cropH =
                wrapperH - data.cropChangeY + Math.abs(fh + data.cropOldH) <=
                wrapperH - minY
                  ? Math.abs(fh + data.cropOldH)
                  : data.cropChangeY - minY;
              data.cropOffsertY =
                wrapperH - data.cropChangeY + Math.abs(fh + data.cropOldH) <=
                wrapperH - minY
                  ? data.cropChangeY - Math.abs(fh + data.cropOldH)
                  : minY;
            }
          }
        }

				const fixedNumber = props.fixedNumber.map(r => Number(r))

        if (data.canChangeX && props.fixed) {
          var fixedHeight =
            (data.cropW / fixedNumber[0]) * fixedNumber[1];
          if (fixedHeight + data.cropOffsertY > wrapperH) {
            data.cropH = wrapperH - data.cropOffsertY;
            data.cropW =
              (data.cropH / fixedNumber[1]) * fixedNumber[0];
          } else {
            data.cropH = fixedHeight;
          }
        }

        if (data.canChangeY && props.fixed) {
          var fixedWidth =
            (data.cropH / fixedNumber[1]) * fixedNumber[0];
          if (fixedWidth + data.cropOffsertX > wrapperW) {
            data.cropW = wrapperW - data.cropOffsertX;
            data.cropH =
              (data.cropW / fixedNumber[0]) * fixedNumber[1];
          } else {
            data.cropW = fixedWidth;
          }
        }
      });
    }

    const checkCropLimitSize = () => {
      let { cropW, cropH } = data;
			let limitMinSize: any = props.limitMinSize

      let limitMinNum = new Array;
      if (!Array.isArray(limitMinSize)) {
        limitMinNum = [limitMinSize, limitMinSize]
      } else {
        limitMinNum = limitMinSize
      }

      //限制最小宽度和高度
      cropW = parseFloat(limitMinNum[0])
      cropH = parseFloat(limitMinNum[1])
      return [cropW, cropH]
    }
    // 结束改变
    const changeCropEnd = (e: TouchEvent|MouseEvent) => {
      window.removeEventListener("mousemove", changeCropNow);
      window.removeEventListener("mouseup", changeCropEnd);
      window.removeEventListener("touchmove", changeCropNow);
      window.removeEventListener("touchend", changeCropEnd);
    }

    // 创建完成
    const endCrop = () => {
      if (data.cropW === 0 && data.cropH === 0) {
        data.cropping = false;
      }
      window.removeEventListener("mousemove", createCrop);
      window.removeEventListener("mouseup", endCrop);
      window.removeEventListener("touchmove", createCrop);
      window.removeEventListener("touchend", endCrop);
    }
    // 开始截图
    const startCrop = () => {
      data.crop = true;
    }
    // 停止截图
    const stopCrop = () => {
      data.crop = false;
    }
    // 清除截图
    const clearCrop = () => {
      data.cropping = false;
      data.cropW = 0;
      data.cropH = 0;
    }
    // 截图移动
    const cropMove = (e: any) => {
      e.preventDefault();
      if (!props.canMoveBox) {
        data.crop = false;
        startMove(e);
        return false;
      }

      if (e.touches && e.touches.length === 2) {
        data.crop = false;
        startMove(e);
        leaveCrop();
        return false;
      }
      window.addEventListener("mousemove", moveCrop);
      window.addEventListener("mouseup", leaveCrop);
      window.addEventListener("touchmove", moveCrop);
      window.addEventListener("touchend", leaveCrop);
      let x = 'clientX' in e ? e.clientX : e.touches[0].clientX;
      let y = 'clientY' in e ? e.clientY : e.touches[0].clientY;
      let newX, newY;
      newX = x - data.cropOffsertX;
      newY = y - data.cropOffsertY;
      data.cropX = newX;
      data.cropY = newY;
      // 触发截图框移动事件
      ctx.emit("cropMoving", {
        moving: true,
        axis: getCropAxis()
      });
      ctx.emit("crop-moving", {
        moving: true,
        axis: getCropAxis()
      });
    }

    const moveCrop = (e?: any, isMove: boolean = false) => {
      let nowX = 0;
      let nowY = 0;
      if (e) {
        e.preventDefault();
        nowX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
        nowY = 'clientY' in e ? e.clientY : e.touches[0].clientY;
      }
      nextTick(() => {
        let cx, cy;
        let fw = nowX - data.cropX;
        let fh = nowY - data.cropY;
        if (isMove) {
          fw = data.cropOffsertX;
          fh = data.cropOffsertY;
        }
        // 不能超过外层容器
        if (fw <= 0) {
          cx = 0;
        } else if (fw + data.cropW > data.w) {
          cx = data.w - data.cropW;
        } else {
          cx = fw;
        }

        if (fh <= 0) {
          cy = 0;
        } else if (fh + data.cropH > data.h) {
          cy = data.h - data.cropH;
        } else {
          cy = fh;
        }

        // 不能超过图片
        if (props.centerBox) {
          let axis = getImgAxis();
          // 横坐标判断
          if (cx <= axis.x1) {
            cx = axis.x1;
          }

          if (cx + data.cropW > axis.x2) {
            cx = axis.x2 - data.cropW;
          }

          // 纵坐标纵轴
          if (cy <= axis.y1) {
            cy = axis.y1;
          }

          if (cy + data.cropH > axis.y2) {
            cy = axis.y2 - data.cropH;
          }
        }

        data.cropOffsertX = cx;
        data.cropOffsertY = cy;

        // 触发截图框移动事件
        ctx.emit("cropMoving", {
          moving: true,
          axis: getCropAxis()
        });
        ctx.emit("crop-moving", {
          moving: true,
          axis: getCropAxis()
        });
      });
    }

    // 算出不同场景下面 图片相对于外层容器的坐标轴
    const getImgAxis = (x: number = data.x, y: number=data.y, scale: number=data.scale) => {
      x = x || data.x;
      y = y || data.y;
      scale = scale || data.scale;
      // 如果设置了截图框在图片内， 那么限制截图框不能超过图片的坐标
      // 图片的坐标
      let obj = {
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 0
      };
      let imgW = data.trueWidth * scale;
      let imgH = data.trueHeight * scale;
      switch (data.rotate) {
        case 0:
          obj.x1 = x + (data.trueWidth * (1 - scale)) / 2;
          obj.x2 = obj.x1 + data.trueWidth * scale;
          obj.y1 = y + (data.trueHeight * (1 - scale)) / 2;
          obj.y2 = obj.y1 + data.trueHeight * scale;
          break;
        case 1:
        case -1:
        case 3:
        case -3:
          obj.x1 = x + (data.trueWidth * (1 - scale)) / 2 + (imgW - imgH) / 2;
          obj.x2 = obj.x1 + data.trueHeight * scale;
          obj.y1 = y + (data.trueHeight * (1 - scale)) / 2 + (imgH - imgW) / 2;
          obj.y2 = obj.y1 + data.trueWidth * scale;
          break;
        default:
          obj.x1 = x + (data.trueWidth * (1 - scale)) / 2;
          obj.x2 = obj.x1 + data.trueWidth * scale;
          obj.y1 = y + (data.trueHeight * (1 - scale)) / 2;
          obj.y2 = obj.y1 + data.trueHeight * scale;
          break;
      }
      return obj;
    }

    // 获取截图框的坐标轴
    const getCropAxis = () => {
      let obj = {
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 0
      };
      obj.x1 = data.cropOffsertX;
      obj.x2 = obj.x1 + data.cropW;
      obj.y1 = data.cropOffsertY;
      obj.y2 = obj.y1 + data.cropH;
      return obj;
    }

    const leaveCrop = () => {
      window.removeEventListener("mousemove", moveCrop);
      window.removeEventListener("mouseup", leaveCrop);
      window.removeEventListener("touchmove", moveCrop);
      window.removeEventListener("touchend", leaveCrop);
      // 触发截图框移动事件
      ctx.emit("cropMoving", {
        moving: false,
        axis: getCropAxis()
      });
      ctx.emit("crop-moving", {
        moving: false,
        axis: getCropAxis()
      });
    }

    const getCropChecked = (cb: Function) => {
      let canvas = document.createElement("canvas");
      let img = new Image();
      let rotate = data.rotate;
      let trueWidth = data.trueWidth;
      let trueHeight = data.trueHeight;
      let cropOffsertX = data.cropOffsertX;
      let cropOffsertY = data.cropOffsertY;
      img.onload = () => {
        if (data.cropW !== 0) {
          let context = canvas.getContext("2d");
          let dpr = 1;
          if (props.high && !props.full) {
            dpr = window.devicePixelRatio;
          }
          if ((props.enlarge !== 1) && !props.full) {
            dpr = Math.abs(Number(props.enlarge));
          }
          let width = data.cropW * dpr;
          let height = data.cropH * dpr;
          let imgW = trueWidth * data.scale * dpr;
          let imgH = trueHeight * data.scale * dpr;
          // 图片x轴偏移
          let dx =
            (data.x - cropOffsertX + (data.trueWidth * (1 - data.scale)) / 2) *
            dpr;
          // 图片y轴偏移
          let dy =
            (data.y - cropOffsertY + (data.trueHeight * (1 - data.scale)) / 2) *
            dpr;
          //保存状态
          setCanvasSize(width, height);
          context?.save();
          switch (rotate) {
            case 0:
              if (!props.full) {
                context?.drawImage(img, dx, dy, imgW, imgH);
              } else {
                // 输出原图比例截图
                setCanvasSize(width / data.scale, height / data.scale);
                context?.drawImage(
                  img,
                  dx / data.scale,
                  dy / data.scale,
                  imgW / data.scale,
                  imgH / data.scale
                );
              }
              break;
            case 1:
            case -3:
              if (!props.full) {
                // 换算图片旋转后的坐标弥补
                dx = dx + (imgW - imgH) / 2;
                dy = dy + (imgH - imgW) / 2;
                context?.rotate((rotate * 90 * Math.PI) / 180);
                context?.drawImage(img, dy, -dx - imgH, imgW, imgH);
              } else {
                setCanvasSize(width / data.scale, height / data.scale);
                // 换算图片旋转后的坐标弥补
                dx =
                  dx / data.scale + (imgW / data.scale - imgH / data.scale) / 2;
                dy =
                  dy / data.scale + (imgH / data.scale - imgW / data.scale) / 2;
                context?.rotate((rotate * 90 * Math.PI) / 180);
                context?.drawImage(
                  img,
                  dy,
                  -dx - imgH / data.scale,
                  imgW / data.scale,
                  imgH / data.scale
                );
              }
              break;
            case 2:
            case -2:
              if (!props.full) {
                context?.rotate((rotate * 90 * Math.PI) / 180);
                context?.drawImage(img, -dx - imgW, -dy - imgH, imgW, imgH);
              } else {
                setCanvasSize(width / data.scale, height / data.scale);
                context?.rotate((rotate * 90 * Math.PI) / 180);
                dx = dx / data.scale;
                dy = dy / data.scale;
                context?.drawImage(
                  img,
                  -dx - imgW / data.scale,
                  -dy - imgH / data.scale,
                  imgW / data.scale,
                  imgH / data.scale
                );
              }
              break;
            case 3:
            case -1:
              if (!props.full) {
                // 换算图片旋转后的坐标弥补
                dx = dx + (imgW - imgH) / 2;
                dy = dy + (imgH - imgW) / 2;
                context?.rotate((rotate * 90 * Math.PI) / 180);
                context?.drawImage(img, -dy - imgW, dx, imgW, imgH);
              } else {
                setCanvasSize(width / data.scale, height / data.scale);
                // 换算图片旋转后的坐标弥补
                dx =
                  dx / data.scale + (imgW / data.scale - imgH / data.scale) / 2;
                dy =
                  dy / data.scale + (imgH / data.scale - imgW / data.scale) / 2;
                context?.rotate((rotate * 90 * Math.PI) / 180);
                context?.drawImage(
                  img,
                  -dy - imgW / data.scale,
                  dx,
                  imgW / data.scale,
                  imgH / data.scale
                );
              }
              break;
            default:
              if (!props.full) {
                context?.drawImage(img, dx, dy, imgW, imgH);
              } else {
                // 输出原图比例截图
                setCanvasSize(width / data.scale, height / data.scale);
                context?.drawImage(
                  img,
                  dx / data.scale,
                  dy / data.scale,
                  imgW / data.scale,
                  imgH / data.scale
                );
              }
          }
          context?.restore();
        } else {
          let width = trueWidth * data.scale;
          let height = trueHeight * data.scale;
          let context = canvas.getContext("2d");
          context?.save();
          switch (rotate) {
            case 0:
              setCanvasSize(width, height);
              context?.drawImage(img, 0, 0, width, height);
              break;
            case 1:
            case -3:
              // 旋转90度 或者-270度 宽度和高度对调
              setCanvasSize(height, width);
              context?.rotate((rotate * 90 * Math.PI) / 180);
              context?.drawImage(img, 0, -height, width, height);
              break;
            case 2:
            case -2:
              setCanvasSize(width, height);
              context?.rotate((rotate * 90 * Math.PI) / 180);
              context?.drawImage(img, -width, -height, width, height);
              break;
            case 3:
            case -1:
              setCanvasSize(height, width);
              context?.rotate((rotate * 90 * Math.PI) / 180);
              context?.drawImage(img, -width, 0, width, height);
              break;
            default:
              setCanvasSize(width, height);
              context?.drawImage(img, 0, 0, width, height);
          }
          context?.restore();
        }
        cb(canvas);
      };
      // 判断图片是否是base64
      var s = props.img.substr(0, 4);
      if (s !== "data") {
        img.crossOrigin = "Anonymous";
      }
      img.src = data.imgs;

      function setCanvasSize(width: number, height: number) {
        canvas.width = Math.round(width);
        canvas.height = Math.round(height);
      }
    }

    // 获取转换成base64 的图片信息
    const getCropData = (cb: Function) => {
      getCropChecked((data: any) => {
        cb(data.toDataURL("image/" + data.outputType, data.outputSize));
      });
    }

    //canvas获取为blob对象
    const getCropBlob = (cb: Function) => {
      getCropChecked((data: any) => {
        data.toBlob(
          (blob: any) => cb(blob),
          "image/" + data.outputType,
          data.outputSize
        );
      });
    }

    // 自动预览函数
    const showPreview = () => {
      // 优化不要多次触发
      if (data.isCanShow) {
        data.isCanShow = false;
        setTimeout(() => {
          data.isCanShow = true;
        }, 16);
      } else {
        return false;
      }
      let w = data.cropW;
      let h = data.cropH;
      let scale = data.scale;
      var obj = {
				w: 0,
				h: 0,
				url: '',
				img: {},
				html: '',
				div: {
					width: `${w}px`,
        	height: `${h}px`
				}
			};
      let transformX = (data.x - data.cropOffsertX) / scale;
      let transformY = (data.y - data.cropOffsertY) / scale;
      let transformZ = 0;
      obj.w = w;
      obj.h = h;
      obj.url = data.imgs;
      obj.img = {
        width: `${data.trueWidth}px`,
        height: `${data.trueHeight}px`,
        transform: `scale(${scale})translate3d(${transformX}px, ${transformY}px, ${transformZ}px)rotateZ(${data.rotate * 90}deg)`
      };
      obj.html = `
      <div class="show-preview" style="width: ${obj.w}px; height: ${obj.h}px,; overflow: hidden">
        <div style="width: ${w}px; height: ${h}px">
          <img src=${obj.url} style="width: ${data.trueWidth}px; height: ${data.trueHeight}px; transform:scale(${scale})translate3d(${transformX}px, ${transformY}px, ${transformZ}px)rotateZ(${data.rotate * 90}deg)">
        </div>
      </div>`;
      ctx.emit("realTime", obj);
      ctx.emit("real-time", obj);
    }
    // reload 图片布局函数
    const reload = () => {
      let img = new Image();
      img.onload = () => {
        // 读取图片的信息原始信息， 解析是否需要旋转
        // 读取图片的旋转信息
        // 得到外层容器的宽度高度
        data.w = parseFloat(window.getComputedStyle(cropper.value).width);
        data.h = parseFloat(window.getComputedStyle(cropper.value).height);

        // 存入图片真实高度
        data.trueWidth = img.width;
        data.trueHeight = img.height;

        // 判断是否需要压缩大图
        if (!props.original) {
          // 判断布局方式 mode
          data.scale = checkedMode();
        } else {
          data.scale = 1;
        }

        nextTick(() => {
          data.x =
            -(data.trueWidth - data.trueWidth * data.scale) / 2 +
            (data.w - data.trueWidth * data.scale) / 2;
          data.y =
            -(data.trueHeight - data.trueHeight * data.scale) / 2 +
            (data.h - data.trueHeight * data.scale) / 2;
          data.loading = false;
          // // 获取是否开启了自动截图
          if (props.autoCrop) {
            goAutoCrop();
          }
          // 图片加载成功的回调
          ctx.emit("img-load", "success");
          ctx.emit("imgLoad", "success");
          setTimeout(() => {
            showPreview();
          }, 20);
        });
      };
      img.onerror = () => {
        ctx.emit("imgLoad", "error");
        ctx.emit("img-load", "error");
      };
      img.src = data.imgs;
    }
    // 背景布局的函数
    const checkedMode = () => {
      let scale = 1;
      // 通过字符串分割
      let imgW = data.trueWidth;
      let imgH = data.trueHeight;
      const arr = props.mode.split(" ");
      switch (arr[0]) {
        case "contain":
          if (data.trueWidth > data.w) {
            // 如果图片宽度大于容器宽度
            scale = data.w / data.trueWidth;
          }

          if (data.trueHeight * scale > data.h) {
            scale = data.h / data.trueHeight;
          }
          break;
        case "cover":
          // 扩展布局 默认填充满整个容器
          // 图片宽度大于容器
          imgW = data.w;
          scale = imgW / data.trueWidth;
          imgH = imgH * scale;
          // 如果扩展之后高度小于容器的外层高度 继续扩展高度
          if (imgH < data.h) {
            imgH = data.h;
            scale = imgH / data.trueHeight;
          }
          break;
        default:
          try {
            let str = arr[0];
            if (str.search("px") !== -1) {
              str = str.replace("px", "");
              imgW = parseFloat(str);
              const scaleX = imgW / data.trueWidth;
              let scaleY = 1;
              let strH = arr[1];
              if (strH.search("px") !== -1) {
                strH = strH.replace("px", "");
                imgH = parseFloat(strH);
                scaleY = imgH / data.trueHeight;
              }
              scale = Math.min(scaleX,scaleY)

            }
            if (str.search("%") !== -1) {
              str = str.replace("%", "");
              imgW = (parseFloat(str) / 100) * data.w;
              scale = imgW / data.trueWidth;
            }

            if (arr.length === 2 && str === "auto") {
              let str2 = arr[1];
              if (str2.search("px") !== -1) {
                str2 = str2.replace("px", "");
                imgH = parseFloat(str2);
                scale = imgH / data.trueHeight;
              }
              if (str2.search("%") !== -1) {
                str2 = str2.replace("%", "");
                imgH = (parseFloat(str2) / 100) * data.h;
                scale = imgH / data.trueHeight;
              }
            }
          } catch (error) {
            scale = 1;
          }
      }
      return scale;
    }
    // 自动截图函数
    const goAutoCrop = (cw?: number, ch?: number) => {
      if (data.imgs === '' || data.imgs === null) return
      clearCrop();
      data.cropping = true;
      let maxWidth = data.w;
      let maxHeight = data.h;
      if (props.centerBox) {
        const switchWH = Math.abs(data.rotate) % 2 > 0
        let imgW = (switchWH ? data.trueHeight : data.trueWidth) * data.scale;
        let imgH = (switchWH ? data.trueWidth : data.trueHeight) * data.scale;
        maxWidth = imgW < maxWidth ? imgW : maxWidth;
        maxHeight = imgH < maxHeight ? imgH : maxHeight;
      }
      // 截图框默认大小
      // 如果为0 那么计算容器大小 默认为80%
      var w = cw ? cw : parseFloat(props.autoCropWidth.toString());
      var h = ch ? ch : parseFloat(props.autoCropHeight.toString());
      if (w === 0 || h === 0) {
        w = maxWidth * 0.8;
        h = maxHeight * 0.8;
      }
      w = w > maxWidth ? maxWidth : w;
      h = h > maxHeight ? maxHeight : h;
			const fixedNumber = props.fixedNumber.map(r => Number(r))
      if (props.fixed) {
        h = (w / fixedNumber[0]) * fixedNumber[1];
      }
      // 如果比例之后 高度大于h
      if (h > data.h) {
        h = data.h;
        w = (h / fixedNumber[1]) * fixedNumber[0];
      }
      changeCrop(w, h);
    }
    // 手动改变截图框大小函数
    const changeCrop = (w: number, h: number) => {
			const fixedNumber = props.fixedNumber.map(r => Number(r))
      if (props.centerBox) {
        // 修复初始化时候在centerBox=true情况下
        let axis = getImgAxis();
        if (w > axis.x2 - axis.x1) {
          // 宽度超标
          w = axis.x2 - axis.x1;
          h = (w / fixedNumber[0]) * fixedNumber[1];
        }
        if (h > axis.y2 - axis.y1) {
          // 高度超标
          h = axis.y2 - axis.y1;
          w = (h / fixedNumber[1]) * fixedNumber[0];
        }
      }
      // 判断是否大于容器
      data.cropW = w;
      data.cropH = h;
      checkCropLimitSize()
      nextTick(() => {
        // 居中走一走
        data.cropOffsertX = (data.w - data.cropW) / 2;
        data.cropOffsertY = (data.h - data.cropH) / 2;
        if (props.centerBox) {
          moveCrop(null, true);
        }
      });
    }
    // 重置函数， 恢复组件置初始状态
    const refresh = () => {
      let img = props.img;
      data.imgs = "";
      data.scale = 1;
      data.crop = false;
      data.rotate = 0;
      data.w = 0;
      data.h = 0;
      data.trueWidth = 0;
      data.trueHeight = 0;
      clearCrop();
			nextTick(() => {
        checkedImg();
      });
    }

    // 向左边旋转
    const rotateLeft = () => {
      data.rotate = data.rotate <= -3 ? 0 : data.rotate - 1;
    }

    // 向右边旋转
    const rotateRight = () => {
      data.rotate = data.rotate >= 3 ? 0 : data.rotate + 1;
    }

    // 清除旋转
    const rotateClear = () => {
      data.rotate = 0;
    }

    // 图片坐标点校验
    const checkoutImgAxis = (x: number = data.x, y: number=data.y, scale: number=data.scale) => {
      x = x || data.x;
      y = y || data.y;
      scale = scale || data.scale;
      let canGo = true;
      // 开始校验 如果说缩放之后的坐标在截图框外 则阻止缩放
      if (props.centerBox) {
        let axis = getImgAxis(x, y, scale);
        let cropAxis = getCropAxis();
        // 左边的横坐标 图片不能超过截图框
        if (axis.x1 >= cropAxis.x1) {
          canGo = false;
        }

        // 右边横坐标
        if (axis.x2 <= cropAxis.x2) {
          canGo = false;
        }

        // 纵坐标上面
        if (axis.y1 >= cropAxis.y1) {
          canGo = false;
        }

        // 纵坐标下面
        if (axis.y2 <= cropAxis.y2) {
          canGo = false;
        }
      }
      return canGo;
    }

		onMounted(() => {
			data.support =
      "onwheel" in document.createElement("div") ? "wheel" : ((document as any).onmousewheel !== undefined ? "mousewheel" : "DOMMouseScroll");
			var u = navigator.userAgent;
			data.isIos = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
			// 兼容blob
			if (!HTMLCanvasElement.prototype.toBlob) {
				Object.defineProperty(HTMLCanvasElement.prototype, "toBlob", {
					value: function(callback: Function, type: any, quality: any) {
						console.log(type, quality)
						var binStr = atob(this.toDataURL(type, quality).split(",")[1]),
							len = binStr.length,
							arr = new Uint8Array(len);
						for (var i = 0; i < len; i++) {
							arr[i] = binStr.charCodeAt(i);
						}
						callback(new Blob([arr], { type: props.type || "image/png" }));
					}
				});
			}
			showPreview();
			checkedImg();
		})

		onDeactivated(() => {
			window.removeEventListener("mousemove", moveCrop);
			window.removeEventListener("mouseup", leaveCrop);
			window.removeEventListener("touchmove", moveCrop);
			window.removeEventListener("touchend", leaveCrop);
			cancelScale()
		})

		// 如果图片改变， 重新布局
		// 当传入图片时, 读取图片信息同时展示
		watch(() => props.img, () => checkedImg())
		watch(() => data.imgs, (val) => {
			if (val) {
				reload()
			}
		})
		watch(data, () => showPreview())
		watch(() => props.autoCrop, (val) => {
			if (val) {
				goAutoCrop()
			}
		})

		// 修改了自动截图框
		watch(() => props.autoCropWidth, () => {
			if (props.autoCrop) {
				goAutoCrop()
			}
		})
		watch(() => props.autoCropHeight, () => {
			if (props.autoCrop) {
				goAutoCrop()
			}
		})

		watch(() => props.mode, () => checkedImg())
		watch(() => data.rotate, () => {
			showPreview();
      if (props.autoCrop) {
        goAutoCrop(data.cropW, data.cropH);
      } else {
        if (data.cropW > 0 || data.cropH > 0) {
          goAutoCrop(data.cropW, data.cropH);
        }
      }
		})
		

		return {
			cropper,
			...toRefs(data),
			cropInfo,
			passive,
			scaleImg,
			cancelScale,
			startMove,
			cropMove,
			changeCropSize,
			getCropData,
			getCropBlob,
			rotateClear,
			rotateRight,
			rotateLeft,
			refresh,
			changeScale,
			startCrop,
			stopCrop,
		}
  },
});
</script>

<style scoped lang="less">
@import url("./style.less");
</style>
