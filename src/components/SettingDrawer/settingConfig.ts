import message from 'ant-design-vue/es/message'
// import defaultSettings from '../defaultSettings';
// import themeColor from './themeColor.js'

// let lessNodesAppended
const colorList = [
  {
    key: '薄暮', color: '#F5222D'
  },
  {
    key: '火山', color: '#FA541C'
  },
  {
    key: '日暮', color: '#FAAD14'
  },
  {
    key: '明青', color: '#13C2C2'
  },
  {
    key: '极光绿', color: '#52C41A'
  },
  {
    key: '拂晓蓝（默认）', color: '#1890FF'
  },
  {
    key: '极客蓝', color: '#2F54EB'
  },
  {
    key: '酱紫', color: '#722ED1'
  }
]

const updateTheme = (newPrimaryColor: string) => {
  console.log(newPrimaryColor)
  const hideMessage = message.loading('正在切换主题！', 0)

	// defineConfig({
	// 	css: {
	// 		preprocessorOptions: {
	// 			less: {
	// 				modifyVars: { // 更改主题在这里
	// 					'primary-color': '#52c41a',
	// 					'link-color': '#1DA57A',
	// 					'border-radius-base': '2px'
	// 				},
	// 			}
	// 		}
	// 	}
	// })
	// updateStyle('test', newPrimaryColor)
//   window.location.reload()
//   themeColor.changeColor(newPrimaryColor).finally(() => {
    setTimeout(() => {
      hideMessage()
    }, 10)
//   })
}

const updateColorWeak = (colorWeak: boolean) => {
  // document.body.className = colorWeak ? 'colorWeak' : '';
  const app = document.body.querySelector('#app')
  colorWeak ? app?.classList.add('colorWeak') : app?.classList.remove('colorWeak')
}

export { updateTheme, colorList, updateColorWeak }