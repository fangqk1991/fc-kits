import { Component, MyCheckbox, ViewController } from '../../src'
import { JsonTreeView } from '../../json'

@Component({
  components: {
    'my-checkbox': MyCheckbox,
    'json-tree-view': JsonTreeView,
  },
  template: `
    <div>
      <el-card>
        <my-checkbox v-model="checkboxValue">Check: {{ checkboxValue }}</my-checkbox>
      </el-card>
      <el-card class="mt-4">
        <json-tree-view :data="jsonData" />
      </el-card>
    </div>
  `,
})
export class WidgetsDemoView extends ViewController {
  checkboxValue = 1
  jsonData = {
    symbol: 'oneByOne',
    elements: [
      {
        name: '阶段 1',
        symbol: 'anyOf',
        elements: [
          {
            auditor: '{{__leader__}}',
          },
          {
            auditor: 'B',
          },
          {
            symbol: 'oneByOne',
            elements: [
              {
                name: '阶段 1',
                symbol: 'anyOf',
                elements: [
                  {
                    auditor: '22222222',
                  },
                  {
                    auditor: 'B',
                  },
                ],
              },
              {
                name: '阶段 2',
                auditor: 'C',
              },
              {
                name: '阶段 3',
                symbol: 'oneByOne',
                elements: [
                  {
                    name: '阶段 1',
                    symbol: 'anyOf',
                    elements: [
                      {
                        auditor: '{{__leader__}}',
                      },
                      {
                        auditor: 'B',
                      },
                    ],
                  },
                  {
                    name: '阶段 22',
                    auditor: '{{.leader}}',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: '阶段 22',
        auditor: '{{.leader}}',
      },
    ],
  }
}
