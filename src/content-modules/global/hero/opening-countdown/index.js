import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import moment from 'moment-timezone';

import styles from './opening-countdown.module.css';
import heroStyles from '../hero.module.css';

const propTypes = {
  date: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

const INTERVALS = ['weeks', 'days', 'hours', 'minutes'];

class OpeningCountdown extends React.Component {
  state = {
    countdown: {
      days: '-',
      hours: '-',
      minutes: '-',
      weeks: '-',
    },
  };

  componentDidMount() {
    this.setState({
      countdown: this.getCountdown(),
    });
  }

  componentWillUnmount() {
    clearInterval(this.countdownInterval);
  }

  getCountdown = () => this.countdown(moment(), moment(this.props.date));

  countdownInterval = setInterval(() => {
    this.setState({
      countdown: this.getCountdown(),
    });
  }, 1000);

  countdown = (dateNow, eventDate) => {
    const countdown = {};

    INTERVALS.forEach((interval) => {
      const diff = eventDate.diff(dateNow, interval);
      dateNow.add(diff, interval);
      countdown[interval] = diff > 0 ? diff : 0;
    });

    return countdown;
  };

  render() {
    const { countdown } = this.state;
    const { title } = this.props;
    const { translation } = this.context;

    return (
      <div className={styles.wrapper}>
        <h2 className={cx(heroStyles.sideTitle, styles.componentTitle)}>{title}</h2>
        <div className={styles.countdown}>
          {INTERVALS.map((interval, index) => (
            <div
              className={styles.numberWrapper}
              key={index}
            >
              <span className="screenReaderText">
                {`${countdown[interval]} ${translation(`dateIntervals.${interval}`)}`}
              </span>
              <span
                aria-hidden="true"
                className={styles.number}
              >
                {
                  countdown[interval] &&
                  countdown[interval] < 10 ?
                    (`0${countdown[interval]}`).slice(-2) : countdown[interval]}
              </span>
              <span
                aria-hidden="true"
                className={styles.label}
              >
                {translation(`dateIntervals.${interval}`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

OpeningCountdown.propTypes = propTypes;
OpeningCountdown.contextTypes = { translation: PropTypes.func.isRequired };

export default OpeningCountdown;
