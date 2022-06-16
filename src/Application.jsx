import Nullstack from 'nullstack';
import './Application.css';
import Home from './Home';

class Application extends Nullstack {

  prepare({ page }) {
    page.locale = 'pt-BR';
  }

  render() {
    return (
      <main>
        <Home route="/" />
      </main>
    )
  }

}

export default Application;