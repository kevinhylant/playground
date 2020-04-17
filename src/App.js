import React, { useState } from 'react';
import cx from 'classnames/bind';
import { useForm } from 'react-hook-form'
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
  useParams,
  Redirect,
} from "react-router-dom";
import useWindowSize from 'react-use/lib/useWindowSize'
import ReactConfetti from 'react-confetti'
import { images } from './images';
import './App.scss';

const questions = [{
  answer: 'dragon',
  image: 'dragon'
}]

const Confetti = () => {
  const { width, height } = useWindowSize()
  return (
    <ReactConfetti
      width={width}
      height={height}
    />
  )
}

const Home = ({ }) => {
  const { register, handleSubmit, errors } = useForm()
  const [isCorrect, setCorrect] = useState(false);
  const [isIncorrect, setIncorrect] = useState(false);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const { questionIndex } = useParams();

  const onSubmit = ({ guess }) => {
    const answer = questions[questionIndex].answer;
    const isIncorrect = answer !== guess.toLowerCase();
    if (isIncorrect) {
      setCorrect(false); // needed?
      setIncorrect(true);
      setIncorrectCount(incorrectCount + 1);
      console.log('INCORRECT!');
    } else {
      setCorrect(true);
      setIncorrect(false);
      setIncorrectCount(0);
      console.log('CORRECT!');
    }
    console.log({ isIncorrect, questionIndex });
  }
  console.log({ incorrectCount })
  return (
    <>
      <div className="guess">
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
        {/* register your input into the hook by invoking the "register" function */}
          <span className="form__label">Guess here</span>
          <div className="form__fields">
            <input
              type="text"
              name="guess"
              autoComplete="off"
              ref={register({ required: true })}
              onChange={() => {
                setIncorrect(false);
              }}
            />
            <input type="submit" value="👉 🔴" />
          </div>
          {errors.guess && (
            <p className="validation-error">Try a little harder... literally anything is better than your guess.</p>
          )}
        </form>
        <div className={cx('heckling', ({
          'heckling--hidden': !isIncorrect,
        }))}>
          <img src={images.heckling.chrisFarley} />
        </div>
      </div>
      <div className="question">
        <div className="question__image-container">
          <img src={images.questions.dragon} />
        </div>
      </div>
      {isCorrect && <Confetti />}
    </>
  )
}


const App = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <Router>
      <div className="app">
        <nav className="nav">
          <h1 className="nav__title">
            <Link to="/">Pun fun</Link>
          </h1>
          <h2>
            <Link to="/about">About</Link>
          </h2>
          <button
            className={cx('nav__hamburger hamburger hamburger--collapse', {
              'is-active': isMenuOpen,
            })}
            onClick={() => setMenuOpen(!isMenuOpen)}
            type="button"
            aria-label="Menu"
            aria-controls="navigation"
          >
            <span className="hamburger-box">
              <span className="hamburger-inner"></span>
            </span>
          </button>
        </nav>
        <div className="content">
          <Switch>
            <Route path="/:questionIndex">
              <Home />
            </Route>
            <Route path="/">
              <Redirect to={{ pathname: '/0' }} />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
