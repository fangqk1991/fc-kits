import { Component, Prop, Watch } from 'vue-property-decorator'
import { JsonEditorDialog, ViewController } from '..'

interface CommonNode {
  isLeaf: boolean
  curKey: string
  keychain: string[]
  val: {} | string | number | undefined
  parent?: CommonNode
  children?: CommonNode[]
}

@Component({
  template: `
    <div>
      <small v-if="!readonly">点击节点可编辑对应数据</small>
      <el-tree
        v-if="rootNode"
        :data="[rootNode]"
        :props="defaultProps"
        :default-expand-all="true"
        :expand-on-click-node="false"
        class="fc-tree"
      >
        <div slot-scope="{ node, data }" @click="onEditNode(data)" style="width: 100%;">
          <b v-if="!data.isLeaf">
            {{ data.curKey }}
            <span v-if="Array.isArray(data.val)">[]</span>
            <span v-else>{}</span>
          </b>
          <b v-else class="text-danger">{{ data.curKey }}: {{ data.val }}</b>
        </div>
      </el-tree>
    </div>
  `,
})
export class JsonTreeView extends ViewController {
  @Prop({ default: null, type: Object }) readonly data!: {}
  @Prop({ default: false, type: Boolean }) readonly readonly!: boolean

  rootNode: CommonNode | null = null
  defaultProps = {
    children: 'children',
    label: 'label',
  }

  @Watch('data', { immediate: true, deep: true })
  onDataChanged() {
    this.reloadRootNode()
  }

  async reloadRootNode() {
    const rootNode: CommonNode = {
      isLeaf: false,
      keychain: [],
      curKey: '',
      val: this.data,
      children: [],
    } as CommonNode
    let todoNodes = [rootNode] as CommonNode[]
    while (todoNodes.length > 0) {
      let nextTodoNodes: CommonNode[] = []
      for (const node of todoNodes) {
        const val = node.val as {}
        const subKeys = Object.keys(val)
        node.children = subKeys.map((key) => {
          const subVal = val[key]
          const isLeaf = !(subVal && typeof subVal === 'object')
          return {
            curKey: key,
            isLeaf: isLeaf,
            parent: node,
            keychain: [...node.keychain, key],
            val: subVal,
          }
        })
        nextTodoNodes = nextTodoNodes.concat(node.children.filter((item) => !item.isLeaf))
      }
      todoNodes = nextTodoNodes
    }
    this.rootNode = rootNode
  }

  async viewDidLoad() {
    this.reloadRootNode()
  }

  onEditNode(commonNode: CommonNode) {
    if (this.readonly) {
      return
    }

    if (!(commonNode.val && typeof commonNode.val === 'object')) {
      commonNode = commonNode.parent!
    }

    const keychain = commonNode.keychain
    const dialog = JsonEditorDialog.dialogForEdit(commonNode.val as {})
    dialog.title = `编辑 ${['ROOT', ...keychain].join('.')}`
    dialog.show((newVal) => {
      let curData = this.data
      if (keychain.length > 0) {
        for (let i = 0; i < keychain.length - 1; ++i) {
          curData = curData[keychain[i]]
        }
        curData[commonNode.curKey] = newVal
      } else {
        Object.keys(curData).forEach((key) => {
          delete curData[key]
        })
        Object.assign(curData, newVal)
      }
      this.reloadRootNode()
      this.$emit('change', this.data)
    })
  }
}
