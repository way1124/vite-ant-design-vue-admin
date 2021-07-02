import { App } from 'vue';
import VueCropper from './vue-cropper.vue';


const install = function(app: App) {
	app.component('VueCropper', VueCropper);
}

export { VueCropper }

export default {
	version: '0.0.1',
	install,
	VueCropper,
	vueCropper: VueCropper
}
