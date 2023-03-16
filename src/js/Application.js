import EventEmitter from "eventemitter3";
import image from "../images/planet.svg";

export default class Application extends EventEmitter {
  static get events() {
    return {
      READY: "ready",
    };
  }

  _loading = document.querySelector('.progress');

  constructor() {
    super();

    this._load();
    this.emit(Application.events.READY);
  }

  _render({name, terrain, population}) {
    return `
<article class="media">
  <div class="media-left">
    <figure class="image is-64x64">
      <img src="${image}" alt="planet">
    </figure>
  </div>
  <div class="media-content">
    <div class="content">
    <h4>${name}</h4>
      <p>
        <span class="tag">${terrain}</span> <span class="tag">${population}</span>
        <br>
      </p>
    </div>
  </div>
</article>
    `;
  }

  async _load(url, array) {

    this._startLoading();

    let currentUrl = url || 'https://swapi.boom.dev/api/planets';
    let planetsArray = array || [];
    let results = await fetch(currentUrl);

    if (results.status === 200) {

      let data = await results.json();

      if (data.next != null) {

        data.results.forEach((planet) => planetsArray.push(planet));

        this._load(data.next, planetsArray);
      } else {

        this._stopLoading();
        return this._create(planetsArray)
      }
    }
  }

  _create(planets) {

    planets.forEach((planet) => {

      const box = document.createElement("div");

      box.classList.add("box");
      box.innerHTML = this._render({
        name: planet.name,
        terrain: planet.terrain,
        population: planet.population,
      });

      document.body.querySelector(".main").appendChild(box);
    });
  }

  _startLoading() {

    this._loading.style.display = 'block';
  }

  _stopLoading() {

    this._loading.style.display = 'none';
  }
}