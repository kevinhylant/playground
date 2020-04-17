import React, { useEffect, useState } from 'react';
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

function getRandomIndex(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const Confetti = ({ stopConfetti }) => {
  useEffect(() => {
    setTimeout(stopConfetti, 5000);
  }, []);

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
  const [stats, setStats] = useState({});
  const [hasConfetti, setHasConfetti] = useState(false);
  const { index } = useParams();
  const questionIndex = Number(index);

  const updateStats = (questionStats) => {
    setStats({
      ...stats,
      [questionIndex]: {
        ...stats[questionIndex],
        ...questionStats,
      }
    });
  }

  function onSubmit(formData) {
    const { guess } = formData;
    const answer = questions[questionIndex].answer;

    if (!guess) {
      return;
    }

    const isCorrect = answer === guess.toLowerCase();
    const questionStats = stats[questionIndex] ?? {};
    const guessCount = (questionStats.guessCount ?? 0) + 1;

    let guessImage;
    let showImage;
    if (!isCorrect || (isCorrect && guessCount <= 3)) {
      const guessImages = isCorrect ? images.praise : images.heckle;
      const imageKeys = Object.keys(guessImages);
      guessImage = guessImages[imageKeys[getRandomIndex(imageKeys.length)]];
      showImage = true;
    }

    updateStats({
      isCorrect,
      guessCount,
      guessImage,
      showImage,
    });
    setHasConfetti(isCorrect);
  }

  function stopConfetti() {
    setHasConfetti(false);
  }

  const questionImage = images.questions.dragon;
  const questionStats = stats[questionIndex] ?? {};

  let formLabel = 'Guess here';
  const guessCount = questionStats.guessCount;
  if (guessCount) {
    if (guessCount === 1) {
      formLabel = 'Wowza! You must be a genius!';
    } else if (guessCount <= 3) {
      formLabel = 'Ya wicked smaaat';
    } else {
      formLabel = `You know what they say, ${guessCount}rd time’s the charm... wait, nobody says that. Think a little harder next time.`;
    }
  }

  return (
    <>
      <div className="guess">
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
        {/* register your input into the hook by invoking the "register" function */}
          <span className="form__label">{formLabel}</span>
          <div className="form__fields">
            <input
              type="text"
              name="guess"
              autoComplete="off"
              ref={register({ required: true })}
              onChange={() => {
                updateStats({ showImage: false })
              }}
            />
            <input type="submit" value="👉 🔴" />
          </div>
          {errors.guess && (
            <p className="validation-error">Try a little harder... literally anything is better than your guess.</p>
          )}
        </form>
        <div className={cx('guess__image-container', ({
          'guess__image-container--hidden': !questionStats.showImage,
        }))}>
          <img src={questionStats.guessImage} />
        </div>
      </div>
      <div className="question">
        <div className="question__image-container">
          <img src={questionImage} />
        </div>
      </div>
      {hasConfetti && <Confetti stopConfetti={stopConfetti} />}
    </>
  )
}


const App = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <Router basename="/playground">
      <div className="app">
        <nav className="nav">
          <h1 className="nav__title">
            <Link to="/">Pun fun</Link>
          </h1>
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
            <Route path="/:index">
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
