import Nullstack from 'nullstack';
import Logo from 'nullstack/logo';
import './Home.css';

class Home extends Nullstack {

  tag = '';
  user;
  message = '';

  prepare({ project, page }) {
    page.title = `${project.name} - Find users repo!`;
    page.description = `${project.name} foi feito com Nullstack`;
  }

  static async fetchUser({database, tag}) {
    const response = await fetch(`https://api.github.com/users/${tag}`);

    if(response.status != 200) return false;

    const data = await response.json();
    const user = {
      tag: tag,
      name : data.name,
      avatar : data.avatar_url,
      stars: 0
    };
    
    return await database.collection('users').insertOne(user);
  }

  static async refreshStars({database, tag}) {
    const responseRepos = await (await fetch(`https://api.github.com/users/${tag}/repos`)).json();

    const repoStars = responseRepos.reduce((counter, obj) => {
      return counter + Number(obj.stargazers_count);
    }, 0);

    return await database.collection('users').findOneAndUpdate(
      { "tag": tag },
      { $set: { stars: repoStars } },
    );
  }

  static async findUserByTag({database, tag}){
    let user = await database.collection('users').findOne({tag}); 

    if(!user){
      user = await this.fetchUser({database, tag});
      if(!user) return {error: 'Usuario invalido'};
    }

    user = await this.refreshStars({database, tag});

    return {result: user.value};
  }

  async submitTag(){
    const {error, result} = await this.findUserByTag({tag: this.tag});
    this.message = error;
    this.user = result;
  }

  render({ project }) {
    return (
      <div>
        <form onsubmit={this.submitTag}>
          <label htmlFor="tag">github.com/</label>
          <input name="tag" bind={this.tag}/>
          <button>Go!</button>
        </form>

        { this.user && 
          <div>
            <img src={this.user.avatar}/>
            <p>Stars: {this.user.stars}</p>
          </div>
        }

        {this.message && this.message}
      </div>
    )
  }

}

export default Home;