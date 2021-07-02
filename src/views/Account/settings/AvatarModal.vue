<template>

  <a-modal
    title="修改头像"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    :width="800"
    :footer="null"
    @cancel="cancelHandel">
    <a-row>
      <a-col :xs="24" :md="12" :style="{height: '350px'}">
        <vue-cropper
          ref="cropperRef"
          :img="options.img"
          :info="true"
          :autoCrop="options.autoCrop"
          :autoCropWidth="options.autoCropWidth"
          :autoCropHeight="options.autoCropHeight"
          :fixedBox="options.fixedBox"
          @realTime="realTime"
        >
        </vue-cropper>
      </a-col>
      <a-col :xs="24" :md="12" :style="{height: '350px'}">
        <div class="avatar-upload-preview">
          <img :src="previews.url" :style="previews.img"/>
        </div>
      </a-col>
    </a-row>
    <br>
    <a-row>
      <a-col :lg="2" :md="2">
        <a-upload name="file" :beforeUpload="beforeUpload" :showUploadList="false">
          <a-button>
            <template #icon><UploadOutlined /></template>
            选择图片
          </a-button>
        </a-upload>
      </a-col>
      <a-col :lg="{span: 1, offset: 2}" :md="2">
        <a-button @click="changeScale(1)"><template #icon><PlusOutlined /></template></a-button>
      </a-col>
      <a-col :lg="{span: 1, offset: 1}" :md="2">
        <a-button @click="changeScale(-1)"><template #icon><MinusOutlined /></template></a-button>
      </a-col>
      <a-col :lg="{span: 1, offset: 1}" :md="2">
        <a-button @click="rotateLeft"><template #icon><UndoOutlined /></template></a-button>
      </a-col>
      <a-col :lg="{span: 1, offset: 1}" :md="2">
        <a-button @click="rotateRight"><template #icon><RedoOutlined /></template></a-button>
      </a-col>
      <a-col :lg="{span: 2, offset: 6}" :md="2">
        <a-button type="primary" @click="finish('blob')">保存</a-button>
      </a-col>
    </a-row>
  </a-modal>

</template>
<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue';
import { message } from 'ant-design-vue';

import { VueCropper } from '@/components/VueCropper';

import { post } from "@/utils/request";

export default defineComponent({
  components: {
    VueCropper
  },
  setup(_, ctx) {
    const cropperRef = ref()
    const state = reactive({
      visible: false,
      id: null,
      confirmLoading: false,
      fileList: [],
      uploading: false,
      options: {
        img: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        autoCrop: true,
        autoCropWidth: 200,
        autoCropHeight: 200,
        fixedBox: true
      },
      previews: {}
    })

    const edit = (id: any) => {
      state.visible = true
      state.id = id
      /* 获取原始头像 */
    }
    const close = () => {
      state.id = null
      state.visible = false
    }
    const cancelHandel = () => {
      close()
    }
    const changeScale = (num: number) => {
      num = num || 1
      cropperRef.value.changeScale(num)
    }
    const rotateLeft = () => {
      cropperRef.value.rotateLeft()
    }
    const rotateRight = () => {
      cropperRef.value.rotateRight()
    }
    const beforeUpload = (file: File) => {
      const reader = new FileReader()
      // 把Array Buffer转化为blob 如果是base64不需要
      // 转化为base64
      reader.readAsDataURL(file)
      reader.onload = () => {
        state.options.img = reader.result?.toString() || ''
      }
      // 转化为blob
      // reader.readAsArrayBuffer(file)

      return false
    }

    // 上传图片（点击上传按钮）
    const finish = (type: string) => {
      const formData = new FormData()
      // 输出
      if (type === 'blob') {
        cropperRef.value.getCropBlob((data: any) => {
          const img = window.URL.createObjectURL(data)
          // state.model = true
          // state.modelSrc = img
          formData.append('file', data, "state.fileName")
          post('https://www.mocky.io/v2/5cc8019d300000980a055e76', formData, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .then((response) => {
              console.log('upload response:', response)
              message.success('上传成功')
              // ctx.emit('ok', response.url)
              // state.visible = false
            })
        })
      } else {
        cropperRef.value.getCropData((data: any) => {
          // state.model = true
          // state.modelSrc = data
          console.log(data)
        })
      }
    }
    const okHandel = () => {
      state.confirmLoading = true
      setTimeout(() => {
        state.confirmLoading = false
        close()
        message.success('上传头像成功')
      }, 2000)
    }

    const realTime = (item: any) => {
      state.previews = item
    }

    return {
      cropperRef,
      ...toRefs(state),
      edit,
      cancelHandel,
      changeScale,
      rotateLeft,
      rotateRight,
      beforeUpload,
      finish,
      okHandel,
      realTime,
    }
  }
})
</script>

<style lang="less" scoped>

  .avatar-upload-preview {
    position: absolute;
    top: 50%;
    transform: translate(50%, -50%);
    width: 180px;
    height: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
