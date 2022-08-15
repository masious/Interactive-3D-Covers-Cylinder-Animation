import React from "react";
import './App.scss'

class Movie extends React.Component {
  handleClick = (e) => {
    const { onClick, index } = this.props
    onClick(index)
  }
  render() {
    const { activeIndex, movie, index } = this.props;
    const { Poster, Title, Year } = movie;

    let className = "movie";

    const rotation = (activeIndex + index) * 36

    return (
      <div onClick={this.handleClick} className={className} style={{'--rotation': `${rotation}deg`}}>
        {index}<div className="movie__poster">
          <img src={Poster} alt=""/>
        </div>
        <div className="movie__title">{Title}</div>
        <div className="movie__year">({Year})</div>
      </div>
    );
  }
}

class ArrowMover extends React.Component {
  handleKeyPress = e => {
    console.log(e.key);
    switch (e.key) {
      case "ArrowRight":
        this.props.onRight();
        break;
      case "ArrowLeft":
        this.props.onLeft();
        break;
      default:
        console.log("It's so stupid to be forced to have a default case!");
    }
  };
  render() {
    return (
      <input
        type="text"
        style={{ width: 0, height: 0, outline: 0, border: 0 }}
        autoFocus
        onKeyDown={this.handleKeyPress}
      />
    );
  }
}

class MoviesList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      origin: 'center',
      activeIndex: 0
    }
  }

  handleMouseMove = (e) => {
    const x = `${(e.pageX - e.clientX / 2) * 2}`
    this.setState({
      origin: `center ${(e.pageY - e.clientY / 2 + 100) * -2}px`
      // origin: `center `
    })
  }

  handleRight = () => {
    this.setState({ activeIndex: this.state.activeIndex + 1});
  };

  handleLeft = () => {
    this.setState({ activeIndex: this.state.activeIndex - 1});
  };

  setActiveIndex = (index) => {
    this.setState({ activeIndex: (10 - index) })
  }

  render() {
    const { movies } = this.props;

    const {activeIndex} = this.state

    return (
      <div style={{ perspectiveOrigin: this.state.origin }} onMouseMove={this.handleMouseMove} className="movies">
        {movies && movies.map((movie, index) => (
          <Movie onClick={this.setActiveIndex} index={index} key={`${movie.imdbID}`} activeIndex={activeIndex} movie={movie} />
        ))}
        <ArrowMover onRight={this.handleRight} onLeft={this.handleLeft} />
      </div>
    );
  }
}

const words = [
  'house',
  'american',
  'confessions',
  'phone',
  'there',
  'double',
  'king',
  'paper',
  'blue'
];
const query = words[Math.floor(Math.random() * words.length)]

export default class App extends React.Component {
  

  state = {
    movies: []
  };

  componentDidMount() {
    this.query(query)    
  }

  query (query) {
    fetch(`https://www.omdbapi.com/?apikey=e0c61f54&s=${query}&page=1&type=movie`)
      .then(r => r.json())
      .then(d => d.Search)
      .then(movies => this.setState({ movies }));
  }

  render() {
    const { movies } = this.state;
    if (movies.length === 0) {
      return null;
    }

    // const renderedCount = 10;
    // const renderBeginIndex = activeIndex - Math.floor(renderedCount / 2);
    // const renderEndIndex = activeIndex + Math.floor(renderedCount / 2);

    //   let renderedMovies = []
    // for(let i = renderBeginIndex; i <= renderEndIndex; i++) {
    //   console.log(i);
    //   renderedMovies.push(getItem(movies, i, renderedCount));
    // }

    return (
      <div className="App">
        {/* <input type='text' className='search' disabled value={query} /> */}
        <MoviesList movies={movies} />
      </div>
    );
  }
}
