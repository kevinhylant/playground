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
  imageId: 'dragon'
}, {
  answer: 'speakeasy',
  imageId: 'speakeasy'
}, {
  answer: 'footsie',
  imageId: 'footsie'
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
  const { register, handleSubmit, errors, reset } = useForm()
  const [stats, setStats] = useState({});
  const [hasConfetti, setHasConfetti] = useState(false);
  const [guessImage, setGuessImage] = useState({ hidden: true });
  const { index } = useParams();
  const questionIndex = Number(index);
  console.log({ questionIndex });

  function hideGuessImage() {
    setGuessImage({
      ...guessImage,
      hidden: true,
    })
  }

  function updateStats(questionStats) {
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

    let showImage;
    if ((!isCorrect && guessCount >= 3) || (isCorrect && guessCount <= 3)) {
      const guessImages = isCorrect ? images.praise : images.heckle;
      const imageIds = Object.keys(guessImages);
      const guessImage = guessImages[imageIds[getRandomIndex(imageIds.length)]];
      setGuessImage({
        hidden: false,
        src: guessImage,
      });
      showImage = true;
    }

    updateStats({
      isCorrect,
      guessCount,
      showImage,
    });
    setHasConfetti(isCorrect);
  }

  function stopConfetti() {
    setHasConfetti(false);
  }

  const imageId = questions[questionIndex].imageId;
  const questionImage = images.questions[imageId];
  const correctCount = Object.keys(stats).filter(statKey => stats[statKey].isCorrect).length;
  const questionStats = stats[questionIndex] ?? {};

  let formLabel = 'Guess here';
  const guessCount = questionStats.guessCount ?? 0;
  if (guessCount) {
    if (questionStats.isCorrect) {
      if (guessCount === 1) {
        formLabel = 'Wowza! You must be a genius!';
      } else if (guessCount <= 3) {
        formLabel = 'Ya wicked smaaat';
      } else {
        formLabel = `You know what they say, ${guessCount}rd time’s the charm... wait, nobody says that. Think a little harder next time.`;
      }
    } else {
      if (guessCount === 1) {
        formLabel = 'Almost! Keep trying!';
      } else if (guessCount === 2) {
        formLabel = 'It’s a tough one, don’t lose hope yet!';
      } else if (guessCount === 3) {
        formLabel = 'Here’s a strategy. \n Actually use your brain.';
      } else {
        formLabel = `That’s ${guessCount} guesses now... an actual monkey could guess it faster than you.`;
      }
    }
  }
  console.log({
    hideImage: !questionStats.showImage,
  })

  return (
    <>
      <div className="content-top">
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
                onChange={hideGuessImage}
              />
              <input type="submit" value="👉 🔴" />
            </div>
            {errors.guess && (
              <p className="validation-error">Try a little harder... literally anything is better than your guess.</p>
            )}
          </form>
          <div className={cx('guess__image-container', ({
            'guess__image-container--hidden': guessImage.hidden,
          }))}>
            <img src={guessImage.src} />
          </div>
        </div>
      </div>
      <div className="content-bottom">
        <div className="question">
          <div className="question__image-container">
            <img src={questionImage} />
          </div>
          <Link
            to={`/${questionIndex - 1}`}
            onClick={() => {
              hideGuessImage();
              reset();
            }}
          >
            <button className={cx('question__nav question__nav--back', {
              hidden: questionIndex === 0,
            })}>
              <img src={images.arrowLineLeft} />
            </button>
          </Link>
          <Link
            to={`/${questionIndex + 1}`}
            onClick={() => {
              hideGuessImage();
              reset();
            }}
          >
            <button className={cx('question__nav question__nav--forward', {
              'question__nav--highlighted': questionStats.isCorrect,
              hidden: questionIndex === (questions.length - 1),
            })}>
              <img src={images.arrowLineLeft} />
            </button>
          </Link>
        </div>
      </div>
      {hasConfetti && <Confetti stopConfetti={stopConfetti} />}
      <div className="bottom-nav">
        <div className="stats">
        <div className="stats__item">
            Correct: <strong>{correctCount}</strong>
          </div>
          <div className="stats__item">
            Question <strong>{questionIndex + 1}</strong>/<strong>{questions.length}</strong>
          </div>
          <div className="stats__item">
            Guess # <strong>{guessCount}</strong>
          </div>
        </div>
      </div>
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
