import { Component, Prop } from 'vue-property-decorator'
import { ViewController } from '../ViewController'

@Component({
  template: `
    <router-link v-if="useRouter && !isLinkExternal" :to="link" @click="$emit('click')">
      <el-dropdown-item :class="customClass">
        <img v-if="iconUrl" :src="iconUrl" alt="icon"/>
        <slot />
      </el-dropdown-item>
    </router-link>
    <a v-else :href="link" @click="$emit('click')">
      <el-dropdown-item :class="customClass">
        <img v-if="iconUrl" :src="iconUrl" alt="icon"/>
        <slot />
      </el-dropdown-item>
    </a>
  `,
})
export class LinkDropdownItem extends ViewController {
  @Prop({ default: false, type: Boolean }) readonly useRouter!: string
  @Prop({ default: 'javascript:', type: String }) readonly link!: string
  @Prop({ default: '', type: String }) readonly iconUrl!: string
  @Prop({ default: '', type: String }) readonly customClass!: string

  get isLinkExternal() {
    return typeof this.link === 'string' && this.link.startsWith('http')
  }
}
