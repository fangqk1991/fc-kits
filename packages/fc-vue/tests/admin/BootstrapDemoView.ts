import { Component, HtmlDisplayPanel, ViewController } from '../../src'

@Component({
  components: {
    'html-display-panel': HtmlDisplayPanel,
  },
  template: `
    <div>
      <div class="card" style="width: 18rem;">
        <img src="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUA
    AAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO
        9TXL0Y4OHwAAAABJRU5ErkJggg==" class="card-img-top" alt="Red dot" />
        <div class="card-body">
          <h5 class="card-title">Card title</h5>
          <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          <a href="#" class="btn btn-primary">Go somewhere</a>
        </div>
      </div>
    </div>
  `,
})
export class BootstrapDemoView extends ViewController {}
